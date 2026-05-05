CREATE TABLE `call_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`roomName` varchar(255) NOT NULL,
	`user1Id` int NOT NULL,
	`user2Id` int NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	`durationSeconds` int,
	`status` enum('active','completed','cancelled') NOT NULL DEFAULT 'active',
	`user1Rating` int,
	`user2Rating` int,
	`user1Feedback` text,
	`user2Feedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `call_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `call_sessions_roomName_unique` UNIQUE(`roomName`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`matchId` int NOT NULL,
	`senderId` int NOT NULL,
	`message` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`userId` int NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`leftAt` timestamp,
	`status` enum('waiting','in_call','completed') NOT NULL DEFAULT 'waiting',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`callSessionId` int NOT NULL,
	`user1Id` int NOT NULL,
	`user2Id` int NOT NULL,
	`user1Liked` boolean NOT NULL DEFAULT false,
	`user2Liked` boolean NOT NULL DEFAULT false,
	`isMutualMatch` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `speed_dating_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`eventType` enum('general','age_group','interest_based') NOT NULL DEFAULT 'general',
	`startTime` timestamp NOT NULL,
	`endTime` timestamp NOT NULL,
	`maxParticipants` int NOT NULL DEFAULT 50,
	`currentParticipants` int NOT NULL DEFAULT 0,
	`callDurationSeconds` int NOT NULL DEFAULT 180,
	`status` enum('scheduled','active','completed','cancelled') NOT NULL DEFAULT 'scheduled',
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `speed_dating_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `speed_dating_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`age` int,
	`gender` enum('male','female','other'),
	`preferredGender` enum('male','female','other'),
	`bio` text,
	`photoUri` text,
	`interests` json,
	`isOnline` boolean NOT NULL DEFAULT false,
	`lastSeenAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `speed_dating_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `speed_dating_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `user_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ratedUserId` int NOT NULL,
	`raterUserId` int NOT NULL,
	`rating` int NOT NULL,
	`review` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waiting_queue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`userId` int NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`status` enum('waiting','paired','completed') NOT NULL DEFAULT 'waiting',
	CONSTRAINT `waiting_queue_id` PRIMARY KEY(`id`)
);
