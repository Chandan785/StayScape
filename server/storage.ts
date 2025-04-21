import { 
  User, InsertUser, 
  Property, InsertProperty, 
  Booking, InsertBooking,
  Favorite, InsertFavorite,
  Review, InsertReview
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Storage interface for all database operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property operations
  getProperties(): Promise<Property[]>;
  getPropertyById(id: number): Promise<Property | undefined>;
  getPropertiesByHost(hostId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  searchProperties(query: string): Promise<Property[]>;
  filterProperties(filters: Record<string, any>): Promise<Property[]>;
  
  // Booking operations
  getBookings(userId: number): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  getBookingsForProperty(propertyId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Favorite operations
  getFavorites(userId: number): Promise<{ property: Property; favorite: Favorite }[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, propertyId: number): Promise<boolean>;
  isFavorite(userId: number, propertyId: number): Promise<boolean>;
  
  // Review operations
  getReviews(propertyId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private bookings: Map<number, Booking>;
  private favorites: Map<number, Favorite>;
  private reviews: Map<number, Review>;
  sessionStore: session.Store;
  
  private userIdCounter: number;
  private propertyIdCounter: number;
  private bookingIdCounter: number;
  private favoriteIdCounter: number;
  private reviewIdCounter: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.bookings = new Map();
    this.favorites = new Map();
    this.reviews = new Map();
    
    this.userIdCounter = 1;
    this.propertyIdCounter = 1;
    this.bookingIdCounter = 1;
    this.favoriteIdCounter = 1;
    this.reviewIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Initialize with sample data
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getPropertyById(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getPropertiesByHost(hostId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.hostId === hostId
    );
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyIdCounter++;
    const property: Property = { ...insertProperty, id, createdAt: new Date() };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, propertyUpdate: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty = { ...property, ...propertyUpdate };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  async searchProperties(query: string): Promise<Property[]> {
    if (!query) return Array.from(this.properties.values());
    
    const lowercasedQuery = query.toLowerCase();
    return Array.from(this.properties.values()).filter(property => 
      property.title.toLowerCase().includes(lowercasedQuery) ||
      property.description.toLowerCase().includes(lowercasedQuery) ||
      property.location.toLowerCase().includes(lowercasedQuery) ||
      property.city.toLowerCase().includes(lowercasedQuery) ||
      property.state.toLowerCase().includes(lowercasedQuery) ||
      property.country.toLowerCase().includes(lowercasedQuery)
    );
  }

  async filterProperties(filters: Record<string, any>): Promise<Property[]> {
    let filtered = Array.from(this.properties.values());
    
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.bedrooms !== undefined) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedrooms);
    }
    
    if (filters.bathrooms !== undefined) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathrooms);
    }
    
    if (filters.propertyType !== undefined) {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }
    
    if (filters.location !== undefined) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(p => 
        p.city.toLowerCase().includes(location) || 
        p.state.toLowerCase().includes(location) || 
        p.country.toLowerCase().includes(location)
      );
    }
    
    return filtered;
  }

  // Booking methods
  async getBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsForProperty(propertyId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.propertyId === propertyId
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const booking: Booking = { ...insertBooking, id, createdAt: new Date() };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Favorite methods
  async getFavorites(userId: number): Promise<{ property: Property; favorite: Favorite }[]> {
    const userFavorites = Array.from(this.favorites.values()).filter(
      (favorite) => favorite.userId === userId
    );
    
    return userFavorites.map(favorite => {
      const property = this.properties.get(favorite.propertyId);
      if (!property) throw new Error(`Property ${favorite.propertyId} not found`);
      return { property, favorite };
    });
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    // Check if already a favorite
    const existing = Array.from(this.favorites.values()).find(
      f => f.userId === insertFavorite.userId && f.propertyId === insertFavorite.propertyId
    );
    
    if (existing) return existing;
    
    const id = this.favoriteIdCounter++;
    const favorite: Favorite = { ...insertFavorite, id, createdAt: new Date() };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFavorite(userId: number, propertyId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      f => f.userId === userId && f.propertyId === propertyId
    );
    
    if (!favorite) return false;
    return this.favorites.delete(favorite.id);
  }

  async isFavorite(userId: number, propertyId: number): Promise<boolean> {
    return Array.from(this.favorites.values()).some(
      f => f.userId === userId && f.propertyId === propertyId
    );
  }

  // Review methods
  async getReviews(propertyId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.propertyId === propertyId
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const review: Review = { ...insertReview, id, createdAt: new Date() };
    this.reviews.set(id, review);
    
    // Update property rating
    const property = this.properties.get(insertReview.propertyId);
    if (property) {
      const propertyReviews = await this.getReviews(property.id);
      const totalRating = propertyReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = Math.round(totalRating / propertyReviews.length);
      
      await this.updateProperty(property.id, { 
        rating: averageRating,
        reviews: propertyReviews.length
      });
    }
    
    return review;
  }

  // Initialize with sample data
  private initializeData() {
    // Sample property data with different types
    const propertyData: InsertProperty[] = [
      {
        title: "Modern City Apartment",
        description: "Beautiful modern apartment in the heart of downtown with amazing city views, fully renovated with high-end appliances and stylish decor. Perfect for business travelers or couples seeking a luxurious stay in the center of the action.",
        price: 189,
        location: "Downtown",
        city: "Seattle",
        state: "Washington",
        country: "United States",
        bedrooms: 2,
        bathrooms: 2,
        guests: 4,
        hostId: 1,
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          "https://images.unsplash.com/photo-1502672023488-70e25813eb80",
          "https://images.unsplash.com/photo-1536376072261-38c75010e6c9"
        ],
        amenities: ["Wifi", "Kitchen", "TV", "Air conditioning", "Washer", "Dryer"],
        rating: 92,
        reviews: 45,
        latitude: "47.6062",
        longitude: "-122.3321",
        propertyType: "apartment"
      },
      {
        title: "Beachfront Paradise",
        description: "Stunning beachfront property with direct ocean access. This beautiful home offers panoramic views, a spacious deck, and luxurious amenities for the perfect beach getaway. Fall asleep to the sound of waves and wake up to breathtaking sunrises.",
        price: 349,
        location: "Malibu",
        city: "Malibu",
        state: "California",
        country: "United States",
        bedrooms: 3,
        bathrooms: 2,
        guests: 6,
        hostId: 1,
        images: [
          "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
          "https://images.unsplash.com/photo-1499916078039-922301b0eb9b"
        ],
        amenities: ["Beach access", "Ocean view", "Kitchen", "Wifi", "Parking", "BBQ grill"],
        rating: 97,
        reviews: 78,
        latitude: "34.0259",
        longitude: "-118.7798",
        propertyType: "beach house"
      },
      {
        title: "Mountain Cabin Retreat",
        description: "Cozy cabin nestled in the woods with mountain views. Perfect for a peaceful getaway with hiking trails nearby and a wood-burning fireplace for chilly evenings. Disconnect from the hustle and bustle and reconnect with nature in this rustic yet comfortable cabin.",
        price: 229,
        location: "Aspen",
        city: "Aspen",
        state: "Colorado",
        country: "United States",
        bedrooms: 2,
        bathrooms: 1,
        guests: 4,
        hostId: 1,
        images: [
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
          "https://images.unsplash.com/photo-1542718610-a1d656d1884c",
          "https://images.unsplash.com/photo-1520984032042-162d526883e0"
        ],
        amenities: ["Fireplace", "Mountain view", "Kitchen", "Wifi", "Hiking trails", "Parking"],
        rating: 89,
        reviews: 36,
        latitude: "39.1911",
        longitude: "-106.8175",
        propertyType: "cabin"
      },
      {
        title: "Luxury Villa with Pool",
        description: "Stunning luxury villa with private pool and spacious outdoor entertainment area. Perfect for family vacations or group getaways, this beautiful home offers privacy, luxury, and all the comforts of home in a prime location close to attractions.",
        price: 399,
        location: "Scottsdale",
        city: "Scottsdale",
        state: "Arizona",
        country: "United States",
        bedrooms: 4,
        bathrooms: 3,
        guests: 8,
        hostId: 1,
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
        ],
        amenities: ["Pool", "Hot tub", "Kitchen", "Wifi", "Parking", "BBQ grill", "Air conditioning"],
        rating: 98,
        reviews: 126,
        latitude: "33.4942",
        longitude: "-111.9261",
        propertyType: "villa"
      },
      {
        title: "Designer Loft Apartment",
        description: "Stylish urban loft with high ceilings and designer furnishings. This contemporary space offers a unique stay in a trendy neighborhood with easy access to restaurants, shopping, and cultural attractions. Industrial elements meet modern luxury.",
        price: 175,
        location: "Brooklyn",
        city: "Brooklyn",
        state: "New York",
        country: "United States",
        bedrooms: 1,
        bathrooms: 1,
        guests: 2,
        hostId: 1,
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
          "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
          "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92"
        ],
        amenities: ["Wifi", "Kitchen", "TV", "Air conditioning", "Workspace", "Elevator"],
        rating: 85,
        reviews: 52,
        latitude: "40.6782",
        longitude: "-73.9442",
        propertyType: "apartment"
      },
      {
        title: "Oceanfront Condo",
        description: "Beautiful oceanfront condo with panoramic views and beach access. Recently renovated with modern amenities while maintaining a coastal charm. Relax on the balcony watching dolphins play or take a short walk to nearby shops and restaurants.",
        price: 279,
        location: "Miami Beach",
        city: "Miami Beach",
        state: "Florida",
        country: "United States",
        bedrooms: 2,
        bathrooms: 2,
        guests: 4,
        hostId: 1,
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
          "https://images.unsplash.com/photo-1566073771259-6a8506099945",
          "https://images.unsplash.com/photo-1564574685553-eddafc5dec31"
        ],
        amenities: ["Beach access", "Ocean view", "Pool", "Wifi", "Kitchen", "Parking", "Gym"],
        rating: 91,
        reviews: 63,
        latitude: "25.7907",
        longitude: "-80.1300",
        propertyType: "beach house"
      },
      {
        title: "Charming Family Home",
        description: "Comfortable family home in a safe neighborhood with a beautiful garden and outdoor seating. Spacious and well-appointed, this home is perfect for families or groups looking for a homey place to stay with all the amenities needed for a comfortable visit.",
        price: 210,
        location: "Portland",
        city: "Portland",
        state: "Oregon",
        country: "United States",
        bedrooms: 3,
        bathrooms: 2,
        guests: 6,
        hostId: 1,
        images: [
          "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09",
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858"
        ],
        amenities: ["Garden", "Kitchen", "Wifi", "TV", "Washer", "Dryer", "Free parking"],
        rating: 88,
        reviews: 41,
        latitude: "45.5051",
        longitude: "-122.6750",
        propertyType: "house"
      },
      {
        title: "Lakeside Cabin",
        description: "Rustic cabin on the shores of a beautiful lake with private dock and canoe included. Enjoy peaceful mornings on the porch and evening campfires under the stars. This authentic cabin offers the perfect blend of rustic charm and necessary comforts.",
        price: 245,
        location: "Lake Tahoe",
        city: "Lake Tahoe",
        state: "California",
        country: "United States",
        bedrooms: 2,
        bathrooms: 1,
        guests: 4,
        hostId: 1,
        images: [
          "https://images.unsplash.com/photo-1542718610-a1d656d1884c",
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
          "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99"
        ],
        amenities: ["Lakefront", "Private dock", "Canoe", "Fireplace", "Kitchen", "Wifi", "BBQ grill"],
        rating: 96,
        reviews: 72,
        latitude: "39.0968",
        longitude: "-120.0324",
        propertyType: "cabin"
      }
    ];

    // Create properties
    propertyData.forEach(property => {
      this.createProperty(property);
    });
  }
}

export const storage = new MemStorage();
