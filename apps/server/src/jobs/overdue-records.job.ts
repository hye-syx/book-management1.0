import { db } from '@repo/db';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { sql } from 'drizzle-orm';

dayjs.extend(utc);
dayjs.extend(timezone);

const JOB_TIMEZONE = 'Asia/Shanghai';
const JOB_HOUR = 0;
const JOB_MINUTE = 5;
const JOB_LOCK_KEY = 420001;

const schedulerState = globalThis as typeof globalThis & {
  __bookOverdueSchedulerStarted?: boolean;
  __bookOverdueSchedulerTimer?: ReturnType<typeof setTimeout>;
};

function getMsUntilNextRun(now = dayjs().tz(JOB_TIMEZONE)) {
  let nextRun = now
    .hour(JOB_HOUR)
    .minute(JOB_MINUTE)
    .second(0)
    .millisecond(0);

  if (!nextRun.isAfter(now)) {
    nextRun = nextRun.add(1, 'day');
  }

  return nextRun.diff(now);
}

async function withJobLock<T>(fn: () => Promise<T>) {
  const result = await db.execute(
    sql`SELECT pg_try_advisory_lock(${JOB_LOCK_KEY}) AS locked`,
  );
  const locked = Boolean(result.rows[0]?.locked);

  if (!locked) {
    return;
  }

  try {
    return await fn();
  } finally {
    await db.execute(sql`SELECT pg_advisory_unlock(${JOB_LOCK_KEY})`);
  }
}

export async function updateOverdueRecords() {
  await withJobLock(async () => {
    await db.execute(sql`
      UPDATE borrow_records
      SET
        overdue_days = GREATEST(
          0,
          DATE(timezone(${JOB_TIMEZONE}, now()))
          - DATE(timezone(${JOB_TIMEZONE}, to_timestamp(return_date)))
        ),
        status = CASE
          WHEN DATE(timezone(${JOB_TIMEZONE}, now()))
               > DATE(timezone(${JOB_TIMEZONE}, to_timestamp(return_date)))
            THEN '逾期'::borrow_status
          ELSE '借阅中'::borrow_status
        END,
        updated_at = EXTRACT(EPOCH FROM now())::integer
      WHERE actual_return_date IS NULL
    `);
  });
}

function scheduleNextRun() {
  schedulerState.__bookOverdueSchedulerTimer = setTimeout(async () => {
    try {
      await updateOverdueRecords();
    } catch (error) {
      console.error('Failed to update overdue records', error);
    } finally {
      scheduleNextRun();
    }
  }, getMsUntilNextRun());
}

export function startOverdueRecordsScheduler() {
  if (schedulerState.__bookOverdueSchedulerStarted) {
    return;
  }

  schedulerState.__bookOverdueSchedulerStarted = true;

  void updateOverdueRecords().catch((error) => {
    console.error('Failed to run overdue records update on startup', error);
  });

  scheduleNextRun();
}
