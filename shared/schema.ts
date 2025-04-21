import { pgTable, text, serial, integer, boolean, jsonb, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  avatar: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Property schema
export const properties = pgTable(
  "properties",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: integer("price").notNull(),
    location: text("location").notNull(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    country: text("country").notNull(),
    bedrooms: integer("bedrooms").notNull(),
    bathrooms: integer("bathrooms").notNull(),
    guests: integer("guests").notNull(),
    images: jsonb("images").notNull().$type<string[]>(),
    amenities: jsonb("amenities").notNull().$type<string[]>(),
    hostId: integer("host_id").notNull(),
    rating: integer("rating"),
    reviews: integer("reviews").default(0),
    latitude: text("latitude"),
    longitude: text("longitude"),
    propertyType: text("property_type").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  }
);

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

// Booking schema
export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    propertyId: integer("property_id").notNull(),
    userId: integer("user_id").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    totalPrice: integer("total_price").notNull(),
    guests: integer("guests").notNull(),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
  }
);

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Favorites schema
export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    propertyId: integer("property_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      userPropertyIdx: uniqueIndex("user_property_idx").on(
        table.userId,
        table.propertyId
      ),
    };
  }
);

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// Reviews schema
export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    propertyId: integer("property_id").notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  }
);

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
