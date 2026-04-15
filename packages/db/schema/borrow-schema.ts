import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { books } from "./book-schema";
import dayjs from "dayjs";



// 借阅申请表
export const borrowApplicationStatusEnum = pgEnum('borrow_application_status', [
  '待审核',
  '已批准',
  '已拒绝',
  '已取消'
]);
export const borrowApplications = pgTable('borrow_applications', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(), //申请借阅图书的读者ID
  bookId: integer('book_id')
    .references(() => books.id, { onDelete: 'cascade' })
    .notNull(), //申请借阅图书ID
  borrowDate: integer('borrow_date').notNull(), //申请借阅日期
  returnDate: integer('return_date').notNull(), //申请归还日期
  borrowTotal: integer('borrow_total').notNull(), //申请借阅总数
  status: borrowApplicationStatusEnum('status').default("待审核"), //申请状态
  createdAt: integer('created_at').$defaultFn(() => dayjs().unix()).notNull(), //创建时间
  updatedAt: integer('updated_at')
  .$defaultFn(() => dayjs().unix())
  .$onUpdateFn(() => dayjs().unix())
  .notNull(), //更新时间
});
// 借阅记录表
export const borrowStatusEnum = pgEnum('borrow_status', [
  '借阅中',
  '已归还',
  '逾期',
  '已续借'
]);
export const borrowRecords = pgTable("borrow_records", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id").references(() => user.id,{ onDelete:"cascade" }).notNull(), //借阅图书的读者ID
    bookId: integer("book_id").references(() => books.id,{ onDelete:"cascade" }).notNull(),//借阅图书ID
    borrowDate: integer("borrow_date").notNull(),//借阅日期
    returnDate: integer("return_date").notNull(),//应归还日期
    actualReturnDate: integer("actual_return_date"),//实际归还日期
    overdueDays: integer("overdue_days"),//逾期天数
    borrowTotal: integer("borrow_total").notNull(),//借阅总数
    status: borrowStatusEnum("status").default("借阅中").notNull(),//借阅状态
    createdAt: integer("created_at").$defaultFn(() => dayjs().unix()).notNull(),//创建时间
    updatedAt: integer("updated_at")
    .$defaultFn(() => dayjs().unix())
    .$onUpdateFn(() => dayjs().unix())
    .notNull(),//更新时间  
});
// 续借记录表
export const renewalRecords = pgTable("renewal_records", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    borrowRecordId:integer("borrow_record_id").references(() => borrowRecords.id,{ onDelete:"cascade" }).notNull(),
    userId: text("user_id").references(() => user.id,{ onDelete:"cascade" }).notNull(), //续借图书的读者ID
    bookId: integer("book_id").references(() => books.id,{ onDelete:"cascade" }).notNull(),//续借图书ID
    borrowDate: integer("borrow_date").notNull(),//续借日期
    returnDate: integer("return_date").notNull(),//续借归还日期
    borrowTotal: integer("borrow_total").notNull(),//续借总数
    createdAt: integer("created_at").$defaultFn(() => dayjs().unix()).notNull(),//创建时间
    updatedAt: integer("updated_at")
    .$defaultFn(() => dayjs().unix())
    .$onUpdateFn(() => dayjs().unix())
    .notNull(),//更新时间  
});