import pool from "../config/database.js";

export const getReportData = async () => {

  const totalRevenue =
    await pool.query(`
      SELECT
      COALESCE(
      SUM(amount),0
      ) AS revenue
      FROM payments
      WHERE payment_status='paid'
    `);

  const totalBookings =
    await pool.query(`
      SELECT COUNT(*)
      FROM bookings
    `);

  const approved =
    await pool.query(`
      SELECT COUNT(*)
      FROM bookings
      WHERE status='approved'
    `);

  const pending =
    await pool.query(`
      SELECT COUNT(*)
      FROM bookings
      WHERE status='Pending'
    `);

  const rejected =
    await pool.query(`
      SELECT COUNT(*)
      FROM bookings
      WHERE status='rejected'
    `);
  const completed =
    await pool.query(`
      SELECT COUNT(*)
      FROM bookings
      WHERE status='completed'
    `);
  const monthlyBookings = await pool.query(`
    SELECT
    TO_CHAR(created_at,'Mon') AS month,
    COUNT(*) AS bookings
    FROM bookings
    GROUP BY month,
    DATE_PART('month',created_at)
    ORDER BY DATE_PART('month',created_at)
    `);
    const recentTransactions =
        await pool.query(`
        SELECT
        b.booking_id,
        b.full_name,
        p.amount,
        p.payment_status,
        p.payment_date

        FROM payments p

        JOIN bookings b
        ON p.booking_id=b.booking_id

        ORDER BY p.payment_date DESC
        LIMIT 5
        `);
    const topTourWeek =
        await pool.query(`
          SELECT
            t.title,
            COUNT(*)::int AS bookings
          FROM bookings b
          JOIN tours t
            ON b.tour_id = t.tour_id
          WHERE
            b.created_at >=
            NOW() - INTERVAL '7 days'
          GROUP BY t.title
          ORDER BY bookings DESC
          LIMIT 1
        `);
  const topTourMonth =
  await pool.query(`
    SELECT
      t.title,
      COUNT(*)::int AS bookings
    FROM bookings b
    JOIN tours t
      ON b.tour_id = t.tour_id
    WHERE
      DATE_TRUNC(
        'month',
        b.created_at
      )
      =
      DATE_TRUNC(
        'month',
        CURRENT_DATE
      )
    GROUP BY t.title
    ORDER BY bookings DESC
    LIMIT 1
  `);
  const topTourYear =
  await pool.query(`
    SELECT
      t.title,
      COUNT(*)::int AS bookings
    FROM bookings b
    JOIN tours t
      ON b.tour_id = t.tour_id
    WHERE
      DATE_TRUNC(
        'year',
        b.created_at
      )
      =
      DATE_TRUNC(
        'year',
        CURRENT_DATE
      )
    GROUP BY t.title
    ORDER BY bookings DESC
    LIMIT 1
  `);
  
  const topToursWeek =
await pool.query(`
SELECT

t.title,

COUNT(*)::int AS bookings

FROM bookings b

JOIN tours t
ON b.tour_id=t.tour_id

WHERE
b.created_at >=
NOW() - INTERVAL '7 days'

GROUP BY t.title

ORDER BY bookings DESC

LIMIT 5
`);

const topToursMonth =
await pool.query(`
SELECT

t.title,

COUNT(*)::int AS bookings

FROM bookings b

JOIN tours t
ON b.tour_id=t.tour_id

WHERE

DATE_TRUNC(
'month',
b.created_at
)

=

DATE_TRUNC(
'month',
CURRENT_DATE
)

GROUP BY t.title

ORDER BY bookings DESC

LIMIT 5
`);

const topToursYear =
await pool.query(`
SELECT

t.title,

COUNT(*)::int AS bookings

FROM bookings b

JOIN tours t
ON b.tour_id=t.tour_id

WHERE

DATE_TRUNC(
'year',
b.created_at
)

=

DATE_TRUNC(
'year',
CURRENT_DATE
)

GROUP BY t.title

ORDER BY bookings DESC

LIMIT 5
`);

  const revenueWeek =
  await pool.query(`
    SELECT
      COALESCE(
        SUM(amount),
        0
      ) AS revenue
    FROM payments
    WHERE
      payment_status='paid'
    AND
      payment_date >=
      NOW() - INTERVAL '7 days'
  `);
  const revenueMonth =
  await pool.query(`
    SELECT
      COALESCE(
        SUM(amount),
        0
      ) AS revenue
    FROM payments
    WHERE
      payment_status='paid'
    AND
      DATE_TRUNC(
        'month',
        payment_date
      )
      =
      DATE_TRUNC(
        'month',
        CURRENT_DATE
      )
  `);
  const revenueYear =
  await pool.query(`
    SELECT
      COALESCE(
        SUM(amount),
        0
      ) AS revenue
    FROM payments
    WHERE
      payment_status='paid'
    AND
      DATE_TRUNC(
        'year',
        payment_date
      )
      =
      DATE_TRUNC(
        'year',
        CURRENT_DATE
      )
  `);
  const topTours =
await pool.query(`
  SELECT
    t.title,
    COUNT(*)::int AS bookings
  FROM bookings b
  JOIN tours t
  ON b.tour_id=t.tour_id
  GROUP BY t.title
  ORDER BY bookings DESC
  LIMIT 5
`);

const weekStats =
await pool.query(`
SELECT

COUNT(*)::int AS bookings,

COUNT(*) FILTER (
WHERE status='approved'
)::int AS approved,

COUNT(*) FILTER (
WHERE status='completed'
)::int AS completed,

COUNT(*) FILTER (
WHERE status='Pending'
)::int AS pending,

COUNT(*) FILTER (
WHERE status='rejected'
)::int AS rejected

FROM bookings

WHERE created_at >=
NOW() - INTERVAL '7 days'
`);


const monthStats =
await pool.query(`
SELECT

COUNT(*)::int AS bookings,

COUNT(*) FILTER (
WHERE status='approved'
)::int AS approved,

COUNT(*) FILTER (
WHERE status='completed'
)::int AS completed,

COUNT(*) FILTER (
WHERE status='Pending'
)::int AS pending,

COUNT(*) FILTER (
WHERE status='rejected'
)::int AS rejected

FROM bookings

WHERE DATE_TRUNC(
'month',
created_at
)
=
DATE_TRUNC(
'month',
CURRENT_DATE
)
`);

const yearStats =
await pool.query(`
SELECT

COUNT(*)::int AS bookings,

COUNT(*) FILTER (
WHERE status='approved'
)::int AS approved,

COUNT(*) FILTER (
WHERE status='completed'
)::int AS completed,

COUNT(*) FILTER (
WHERE status='Pending'
)::int AS pending,

COUNT(*) FILTER (
WHERE status='rejected'
)::int AS rejected

FROM bookings

WHERE DATE_TRUNC(
'year',
created_at
)
=
DATE_TRUNC(
'year',
CURRENT_DATE
)
`);

  return {

    totalRevenue:
      totalRevenue.rows[0].revenue,

    totalBookings:
      totalBookings.rows[0].count,

    approved:
      approved.rows[0].count,

    pending:
      pending.rows[0].count,

    rejected:
      rejected.rows[0].count,
    completed:
      completed.rows[0].count,

    monthlyBookings:
    monthlyBookings.rows,
    recentTransactions:
    recentTransactions.rows,

    topTourWeek:topTourWeek.rows[0] || null,
    topTourMonth:topTourMonth.rows[0] || null,
    topTourYear:topTourYear.rows[0] || null,

    topToursWeek:
    topToursWeek.rows,

    topToursMonth:
    topToursMonth.rows,

    topToursYear:
    topToursYear.rows,

    revenueWeek:revenueWeek.rows[0].revenue,

    revenueMonth:revenueMonth.rows[0].revenue,

    revenueYear:revenueYear.rows[0].revenue,

    topTours:topTours.rows,

    week: weekStats.rows[0],

    month: monthStats.rows[0],

    year: yearStats.rows[0],
  };
};