import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Speed Dating Profiles ────────────────────────────────────────────────────

export const speedDatingProfiles = mysqlTable("speed_dating_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  age: int("age"),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  preferredGender: mysqlEnum("preferredGender", ["male", "female", "other"]),
  bio: text("bio"),
  photoUri: text("photoUri"),
  interests: json("interests").$type<string[]>(),
  isOnline: boolean("isOnline").default(false).notNull(),
  lastSeenAt: timestamp("lastSeenAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Speed Dating Events ──────────────────────────────────────────────────────
export const speedDatingEvents = mysqlTable("speed_dating_events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: mysqlEnum("eventType", ["general", "age_group", "interest_based"]).default("general").notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  maxParticipants: int("maxParticipants").default(50).notNull(),
  currentParticipants: int("currentParticipants").default(0).notNull(),
  callDurationSeconds: int("callDurationSeconds").default(180).notNull(),
  status: mysqlEnum("status", ["scheduled", "active", "completed", "cancelled"]).default("scheduled").notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Event Participants ───────────────────────────────────────────────────────
export const eventParticipants = mysqlTable("event_participants", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  userId: int("userId").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  leftAt: timestamp("leftAt"),
  status: mysqlEnum("status", ["waiting", "in_call", "completed"]).default("waiting").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Call Sessions ────────────────────────────────────────────────────────────
export const callSessions = mysqlTable("call_sessions", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  roomName: varchar("roomName", { length: 255 }).notNull().unique(),
  user1Id: int("user1Id").notNull(),
  user2Id: int("user2Id").notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  endedAt: timestamp("endedAt"),
  durationSeconds: int("durationSeconds"),
  status: mysqlEnum("status", ["active", "completed", "cancelled"]).default("active").notNull(),
  user1Rating: int("user1Rating"),
  user2Rating: int("user2Rating"),
  user1Feedback: text("user1Feedback"),
  user2Feedback: text("user2Feedback"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Matches ──────────────────────────────────────────────────────────────────
export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  callSessionId: int("callSessionId").notNull(),
  user1Id: int("user1Id").notNull(),
  user2Id: int("user2Id").notNull(),
  user1Liked: boolean("user1Liked").default(false).notNull(),
  user2Liked: boolean("user2Liked").default(false).notNull(),
  isMutualMatch: boolean("isMutualMatch").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Chat Messages ────────────────────────────────────────────────────────────
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  matchId: int("matchId").notNull(),
  senderId: int("senderId").notNull(),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── User Ratings ────────────────────────────────────────────────────────────
export const userRatings = mysqlTable("user_ratings", {
  id: int("id").autoincrement().primaryKey(),
  ratedUserId: int("ratedUserId").notNull(),
  raterUserId: int("raterUserId").notNull(),
  rating: int("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Waiting Queue ────────────────────────────────────────────────────────────
export const waitingQueue = mysqlTable("waiting_queue", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  userId: int("userId").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["waiting", "paired", "completed"]).default("waiting").notNull(),
});

// ─── Export Types ────────────────────────────────────────────────────────────
export type SpeedDatingProfile = typeof speedDatingProfiles.$inferSelect;
export type InsertSpeedDatingProfile = typeof speedDatingProfiles.$inferInsert;

export type SpeedDatingEvent = typeof speedDatingEvents.$inferSelect;
export type InsertSpeedDatingEvent = typeof speedDatingEvents.$inferInsert;

export type EventParticipant = typeof eventParticipants.$inferSelect;
export type InsertEventParticipant = typeof eventParticipants.$inferInsert;

export type CallSession = typeof callSessions.$inferSelect;
export type InsertCallSession = typeof callSessions.$inferInsert;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

export type UserRating = typeof userRatings.$inferSelect;
export type InsertUserRating = typeof userRatings.$inferInsert;

export type WaitingQueue = typeof waitingQueue.$inferSelect;
export type InsertWaitingQueue = typeof waitingQueue.$inferInsert;
