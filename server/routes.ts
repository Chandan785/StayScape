import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertPropertySchema, 
  insertBookingSchema, 
  insertFavoriteSchema,
  insertReviewSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Middleware to check authentication
  const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in" });
    }
    next();
  };

  // Properties
  app.get("/api/properties", async (req, res) => {
    try {
      // Check if there's a search query
      const query = req.query.search as string;
      let properties;
      
      if (query) {
        properties = await storage.searchProperties(query);
      } else if (Object.keys(req.query).length > 0) {
        // Handle filters
        const filters: Record<string, any> = {};
        
        if (req.query.minPrice) filters.minPrice = parseInt(req.query.minPrice as string);
        if (req.query.maxPrice) filters.maxPrice = parseInt(req.query.maxPrice as string);
        if (req.query.bedrooms) filters.bedrooms = parseInt(req.query.bedrooms as string);
        if (req.query.bathrooms) filters.bathrooms = parseInt(req.query.bathrooms as string);
        if (req.query.location) filters.location = req.query.location as string;
        if (req.query.propertyType) filters.propertyType = req.query.propertyType as string;
        
        properties = await storage.filterProperties(filters);
      } else {
        properties = await storage.getProperties();
      }
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const property = await storage.getPropertyById(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/properties", isAuthenticated, async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse({
        ...req.body,
        hostId: req.user.id // Set the authenticated user as the host
      });
      
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Bookings
  app.get("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getBookings(req.user.id);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if property exists
      const property = await storage.getPropertyById(bookingData.propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Validate dates
      const startDate = new Date(bookingData.startDate);
      const endDate = new Date(bookingData.endDate);
      
      if (startDate >= endDate) {
        return res.status(400).json({ message: "End date must be after start date" });
      }
      
      // Check for conflicting bookings
      const existingBookings = await storage.getBookingsForProperty(bookingData.propertyId);
      const conflict = existingBookings.some(booking => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);
        
        return (
          (startDate >= bookingStart && startDate < bookingEnd) ||
          (endDate > bookingStart && endDate <= bookingEnd) ||
          (startDate <= bookingStart && endDate >= bookingEnd)
        );
      });
      
      if (conflict) {
        return res.status(400).json({ message: "The selected dates are not available" });
      }
      
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/bookings/:id/status", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const { status } = req.body;
      if (!status || !["confirmed", "cancelled", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const booking = await storage.getBookingById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Only allow the property owner or the booking user to update status
      const property = await storage.getPropertyById(booking.propertyId);
      if (booking.userId !== req.user.id && property?.hostId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(id, status);
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Favorites
  app.get("/api/favorites", isAuthenticated, async (req, res) => {
    try {
      const favorites = await storage.getFavorites(req.user.id);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/favorites", isAuthenticated, async (req, res) => {
    try {
      const favoriteData = insertFavoriteSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if property exists
      const property = await storage.getPropertyById(favoriteData.propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const favorite = await storage.addFavorite(favoriteData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/favorites/:propertyId", isAuthenticated, async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const removed = await storage.removeFavorite(req.user.id, propertyId);
      if (!removed) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/favorites/check/:propertyId", isAuthenticated, async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const isFavorite = await storage.isFavorite(req.user.id, propertyId);
      res.json({ isFavorite });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Reviews
  app.get("/api/properties/:id/reviews", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const reviews = await storage.getReviews(propertyId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/properties/:id/reviews", isAuthenticated, async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      // Check if property exists
      const property = await storage.getPropertyById(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user.id,
        propertyId
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
