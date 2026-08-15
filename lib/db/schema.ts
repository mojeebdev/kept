import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  userId: uuid("user_id").primaryKey(),
  displayName: text("display_name"),
  timezone: text("timezone").notNull().default("Africa/Lagos"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const contentItems = pgTable(
  "content_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    body: text("body").notNull(),
    platform: text("platform").notNull(),
    sourceUrl: text("source_url"),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("content_items_user_id_idx").on(table.userId)],
);

export const promises = pgTable(
  "promises",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    contentItemId: uuid("content_item_id")
      .notNull()
      .references(() => contentItems.id, { onDelete: "cascade" }),
    evidenceQuote: text("evidence_quote").notNull(),
    summary: text("summary").notNull(),
    promiseType: text("promise_type").notNull(),
    dueAt: timestamp("due_at", { withTimezone: true, mode: "date" }),
    status: text("status").notNull().default("open"),
    confidence: text("confidence").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    fulfilledAt: timestamp("fulfilled_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("promises_user_id_idx").on(table.userId),
    index("promises_content_item_id_idx").on(table.contentItemId),
    uniqueIndex("promises_user_source_evidence_uidx").on(
      table.userId,
      table.contentItemId,
      table.evidenceQuote,
    ),
  ],
);

export const followUpDrafts = pgTable(
  "follow_up_drafts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    promiseId: uuid("promise_id")
      .notNull()
      .references(() => promises.id, { onDelete: "cascade" }),
    channel: text("channel").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("follow_up_drafts_user_id_idx").on(table.userId),
    uniqueIndex("follow_up_drafts_promise_id_uidx").on(table.promiseId),
  ],
);

export type ProfileRow = typeof profiles.$inferSelect;
export type ContentItemRow = typeof contentItems.$inferSelect;
export type PromiseRow = typeof promises.$inferSelect;
export type FollowUpDraftRow = typeof followUpDrafts.$inferSelect;
