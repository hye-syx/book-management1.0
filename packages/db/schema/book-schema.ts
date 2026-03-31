import { index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const bookStatusEnum = pgEnum("book_status", ["在馆", "借出", "遗失", "损坏"]);
export const books = pgTable("books", {
  id: text("id").primaryKey(),
  isbn: text("isbn").unique().notNull(),//ISBN编号
  title: text("title").notNull(),//书名
  author: text("author").notNull(),//作者
  publisher: text("publisher").notNull(),//出版社
  publicationDate: timestamp("publication_date").notNull(),//出版日期
  categoryId: text("category_id").references(() => bookCategory.id,{ onDelete:"cascade" }).notNull(),//分类ID
  price: integer("price").notNull(),//价格
  total: integer("total").notNull(),//总数
  available: integer("available").notNull(),//可用数量
  status: bookStatusEnum("status").default("在馆"),//状态
  createdAt: timestamp("created_at").defaultNow().notNull(),//创建时间
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
},
(table) => [index("book_categoryId_idx").on(table.categoryId)]

);

export const bookCategory = pgTable("book_category", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),//分类名称
  createdAt: timestamp("created_at").defaultNow().notNull(),//创建时间
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});