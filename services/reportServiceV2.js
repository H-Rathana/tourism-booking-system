import pool from "../config/database.js";

export const getReportDataV2 = async (
  type = "month",
  date = new Date().toISOString().split("T")[0]
) => {

  let bookingFilter = "";
  let bookingFilterJoin = "";
  let paymentFilter = "";
  let params = [];

  switch (type) {

    case "day":

      bookingFilter =
        "DATE(created_at) = DATE($1)";

      bookingFilterJoin =
        "DATE(b.created_at) = DATE($1)";

      paymentFilter =
        "DATE(payment_date) = DATE($1)";

      params = [date];

      break;

    case "week":

      bookingFilter = `
        DATE_TRUNC('week', created_at)
        =
        DATE_TRUNC('week', DATE($1))
      `;

      bookingFilterJoin = `
        DATE_TRUNC('week', b.created_at)
        =
        DATE_TRUNC('week', DATE($1))
      `;

      paymentFilter = `
        DATE_TRUNC('week', payment_date)
        =
        DATE_TRUNC('week', DATE($1))
      `;

      params = [date];

      break;

    case "month":

      bookingFilter = `
        DATE_TRUNC('month', created_at)
        =
        DATE_TRUNC('month', DATE($1))
      `;

      bookingFilterJoin = `
        DATE_TRUNC('month', b.created_at)
        =
        DATE_TRUNC('month', DATE($1))
      `;

      paymentFilter = `
        DATE_TRUNC('month', payment_date)
        =
        DATE_TRUNC('month', DATE($1))
      `;

      params = [date];

      break;

    case "year":

      bookingFilter = `
        DATE_TRUNC('year', created_at)
        =
        DATE_TRUNC('year', DATE($1))
      `;

      bookingFilterJoin = `
        DATE_TRUNC('year', b.created_at)
        =
        DATE_TRUNC('year', DATE($1))
      `;

      paymentFilter = `
        DATE_TRUNC('year', payment_date)
        =
        DATE_TRUNC('year', DATE($1))
      `;

      params = [date];

      break;

    default:

      bookingFilter = `
        DATE_TRUNC('month', created_at)
        =
        DATE_TRUNC('month', CURRENT_DATE)
      `;

      bookingFilterJoin = `
        DATE_TRUNC('month', b.created_at)
        =
        DATE_TRUNC('month', CURRENT_DATE)
      `;

      paymentFilter = `
        DATE_TRUNC('month', payment_date)
        =
        DATE_TRUNC('month', CURRENT_DATE)
      `;

  }

  // =====================================================
  // BOOKING STATISTICS
  // =====================================================

  const bookingStats =
    await pool.query(
      `
      SELECT

      COUNT(*)::int AS bookings,

      COUNT(*) FILTER(
      WHERE status='approved'
      )::int AS approved,

      COUNT(*) FILTER(
      WHERE status='completed'
      )::int AS completed,

      COUNT(*) FILTER(
      WHERE status='Pending'
      )::int AS pending,

      COUNT(*) FILTER(
      WHERE status='rejected'
      )::int AS rejected

      FROM bookings

      WHERE ${bookingFilter}
      `,
      params
    );
    //Revenue
            const revenue =
            await pool.query(
                `
                SELECT

                COALESCE(
                    SUM(amount),
                    0
                ) AS revenue

                FROM payments

                WHERE
                payment_status = 'paid'

                AND
                ${paymentFilter}
                `,
                params
            );
            // =====================================================
// TOP TOUR
// =====================================================

const topTour = await pool.query(
  `
  SELECT

    t.tour_id,
    t.title,
    t.location,
    t.image,

    COUNT(*)::int AS bookings

  FROM bookings b

  JOIN tours t
    ON b.tour_id = t.tour_id

  WHERE
    ${bookingFilterJoin}

  GROUP BY
    t.tour_id,
    t.title,
    t.location,
    t.image

  ORDER BY bookings DESC

  LIMIT 1
  `,
  params
);
// =====================================================
// TOP 5 TOURS
// =====================================================

const topTours =
  await pool.query(
    `
    SELECT

      t.tour_id,

      t.title,

      t.location,

      t.image,

      COUNT(*)::int AS bookings

    FROM bookings b

    JOIN tours t
      ON b.tour_id = t.tour_id

    WHERE
      ${bookingFilterJoin}

    GROUP BY

      t.tour_id,

      t.title,

      t.location,

      t.image

    ORDER BY bookings DESC

    LIMIT 5
    `,
    params
  );
  // =====================================================
// RECENT TRANSACTIONS
// =====================================================

const recentTransactions =
  await pool.query(
    `
    SELECT

      b.booking_id,

      b.full_name,

      b.tour_id,

      p.amount,

      p.payment_status,

      p.payment_date,

      t.title

    FROM payments p

    JOIN bookings b
      ON p.booking_id = b.booking_id

    JOIN tours t
      ON b.tour_id = t.tour_id

    WHERE
      ${paymentFilter}

    ORDER BY
      p.payment_date DESC

    LIMIT 5
    `,
    params
  );
  // =====================================================
// CHART DATA
// =====================================================

let chartQuery = "";

switch (type) {

  case "day":

    chartQuery = `
      SELECT
        TO_CHAR(created_at, 'HH24:00') AS label,
        COUNT(*)::int AS bookings
      FROM bookings
      WHERE DATE(created_at) = DATE($1)
      GROUP BY label
      ORDER BY label
    `;
    break;

  case "week":

    chartQuery = `
      SELECT
        TO_CHAR(created_at, 'Dy') AS label,
        COUNT(*)::int AS bookings
      FROM bookings
      WHERE
        DATE_TRUNC('week', created_at)
        =
        DATE_TRUNC('week', DATE($1))
      GROUP BY
        label,
        DATE_PART('dow', created_at)
      ORDER BY
        DATE_PART('dow', created_at)
    `;
    break;

  case "month":

    chartQuery = `
      SELECT
        EXTRACT(DAY FROM created_at)::int AS label,
        COUNT(*)::int AS bookings
      FROM bookings
      WHERE
        DATE_TRUNC('month', created_at)
        =
        DATE_TRUNC('month', DATE($1))
      GROUP BY label
      ORDER BY label
    `;
    break;

  case "year":

    chartQuery = `
      SELECT
        TO_CHAR(created_at, 'Mon') AS label,
        COUNT(*)::int AS bookings
      FROM bookings
      WHERE
        DATE_TRUNC('year', created_at)
        =
        DATE_TRUNC('year', DATE($1))
      GROUP BY
        label,
        DATE_PART('month', created_at)
      ORDER BY
        DATE_PART('month', created_at)
    `;
    break;

  default:

    chartQuery = `
    SELECT

    TO_CHAR(created_at,'Mon') AS label,

    COUNT(*)::int AS bookings

    FROM bookings

    WHERE
    DATE_TRUNC(
    'month',
    created_at
    )
    =
    DATE_TRUNC(
    'month',
    CURRENT_DATE
    )

    GROUP BY

    label,

    DATE_PART('month',created_at)

    ORDER BY

    DATE_PART('month',created_at)
    `;

}
const chartData = await pool.query(
  chartQuery,
  params
);
return {

  bookingStats: bookingStats.rows[0],

  revenue: revenue.rows[0].revenue,

  topTour: topTour.rows[0] || null,

  topTours: topTours.rows,

  recentTransactions:recentTransactions.rows,

  chartData:
chartData.rows,

};

};