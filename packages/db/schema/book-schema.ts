import { index, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import dayjs from "dayjs";

export const bookStatusEnum = pgEnum("book_status", ["在馆", "借出", "遗失", "损坏"]);
export const books = pgTable("books", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  isbn: text("isbn").unique().notNull(),//ISBN编号
  title: text("title").notNull(),//书名
  author: text("author").notNull(),//作者
  publisher: text("publisher").notNull(),//出版社
  publicationDate: integer("publication_date").notNull(),//出版日期(unix时间戳)
  categoryId: text("category_id").references(() => bookCategory.id,{ onDelete:"cascade" }).notNull(),//分类ID
  price: integer("price").notNull(),//价格
  total: integer("total").notNull(),//总数
  available: integer("available").notNull(),//可用数量
  status: bookStatusEnum("status").default("在馆"),//状态
  createdAt: integer("created_at").$defaultFn(() => dayjs().unix()).notNull(),//创建时间(unix时间戳)
  updatedAt: integer("updated_at")
    .$defaultFn(() => dayjs().unix())
    .$onUpdateFn(() => dayjs().unix())
    .notNull(),//更新时间(unix时间戳)
},
(table) => [index("book_categoryId_idx").on(table.categoryId)]

);

export const bookCategory = pgTable("book_category", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),//分类名称
  createdAt: integer("created_at").$defaultFn(() => dayjs().unix()).notNull(),//创建时间(unix时间戳)
  updatedAt: integer("updated_at")
    .$defaultFn(() => dayjs().unix())
    .$onUpdateFn(() => dayjs().unix())
    .notNull(),//更新时间(unix时间戳)
});