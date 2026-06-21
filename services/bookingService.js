import pool from "../config/database.js";
import * as notificationService from "./notificationService.js";
// ✅ CREATE BOOKING
export const createBooking = async (
  userId,
  data
) => {

  const client =
    await pool.connect();

  try {

    await client.query("BEGIN");

    const {

      tour_id,
      people_count,
      total_price,
      full_name,
      email,
      phone,
      travel_date,
      special_requests,

    } = data;

    // ✅ CHECK EXISTING BOOKING
    const existingBooking =
      await client.query(

        `
        SELECT *
        FROM bookings
        WHERE user_id=$1
        AND tour_id=$2
        AND status='Pending'
        LIMIT 1
        `,

        [
          userId,
          tour_id,
        ]

      );

    // ✅ RETURN EXISTING
    if (
      existingBooking.rows.length > 0
    ) {

      await client.query("COMMIT");

      return {

        booking:
          existingBooking.rows[0],

        existing: true,

      };

    }

    // ✅ INSERT BOOKING
    const bookingResult =
      await client.query(

        `
        INSERT INTO bookings (

          user_id,
          tour_id,
          booking_date,
          people_count,
          total_price,
          full_name,
          email,
          phone,
          travel_date,
          special_requests,
          status

        )

        VALUES (

          $1,$2,CURRENT_DATE,
          $3,$4,$5,$6,$7,$8,$9,
          'Pending'

        )

        RETURNING *
        `,

        [

          userId,
          tour_id,
          people_count,
          total_price,
          full_name,
          email,
          phone,
          travel_date,
          special_requests,

        ]

      );

    const booking =
      bookingResult.rows[0];

    // ✅ INSERT PAYMENT
    await client.query(

      `
      INSERT INTO payments (

        booking_id,
        amount,
        payment_method,
        payment_status,
        payment_date

      )

      VALUES (

        $1,
        $2,
        'KHQR',
        'Pending',
        NOW()

      )
      `,

      [
        booking.booking_id,
        total_price,
      ]

    );

    await client.query("COMMIT");

    // ✅ RETURN NEW BOOKING
    return {

      booking,

      existing: false,

    };

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};

// ✅ GET ALL BOOKINGS
export const getAllBookings =
  async () => {

    const result =
      await pool.query(`

        SELECT

          b.*,
          u.name AS user_name,
          t.title AS tour_title,

          p.payment_status,
          p.payment_method,
          p.amount,
          p.payment_date

        FROM bookings b

        JOIN users u
        ON b.user_id = u.user_id

        JOIN tours t
        ON b.tour_id = t.tour_id

        LEFT JOIN payments p
        ON b.booking_id = p.booking_id

        ORDER BY b.booking_id DESC

      `);

    return result.rows;

};

// ✅ UPDATE BOOKING + PAYMENT STATUS
export const updateBookingStatus =
  async (

    bookingId,
    bookingStatus,
    paymentStatus

  ) => {

    const client =
      await pool.connect();

    try {

      await client.query("BEGIN");

      // ✅ UPDATE BOOKING
      await client.query(

        `
        UPDATE bookings
        SET status=$1
        WHERE booking_id=$2
        `,

        [
          bookingStatus,
          bookingId,
        ]

      );

      await client.query(

        `
        UPDATE payments
        SET payment_status=$1
        WHERE booking_id=$2
        `,

        [
          paymentStatus,
          bookingId,
        ]

      );
      const bookingInfo =
  await client.query(
    `
    SELECT
      b.booking_id,
      b.user_id,
      t.title
    FROM bookings b

    JOIN tours t
    ON b.tour_id = t.tour_id

    WHERE b.booking_id = $1
    `,
    [bookingId]
  );

        const booking =
        bookingInfo.rows[0];
        let message = "";

    if (
      bookingStatus === "approved"
    ) {

      message =
        `Your booking #${booking.booking_id}
    (${booking.title})
    has been approved on. ${new Date().toLocaleString()}.🎉`;

    }

    if (
      bookingStatus === "rejected"
    ) {

      message =
        `Your booking #${booking.booking_id}
    (${booking.title})
    has been rejected on.${new Date().toLocaleString()}.❌`;

    }

    if (
      bookingStatus === "completed"
    ) {

      message =
        `🏁 Your trip
    (${booking.title})
    has been completed.

    Thank you for travelling
    with WanderEscape.`;

    }
        await notificationService.createNotification(
      booking.user_id,
      booking.booking_id,
      message
    );

      await client.query("COMMIT");

      return {
        success: true,
      };

    } catch (error) {

      await client.query("ROLLBACK");

      throw error;

    } finally {

      client.release();

    }

};
export const updateCompletedBookings = async () => {

  await pool.query(`
    UPDATE bookings
    SET status = 'completed'
    WHERE status = 'approved'
    AND travel_date < CURRENT_DATE
  `);

};
export const getTicketById = async (
  bookingId
) => {

  const result =
    await pool.query(
      `
      SELECT

  b.booking_id,
  b.full_name,
  b.email,
  b.phone,
  b.travel_date,
  b.people_count,
  b.total_price,
  b.status,

  t.title AS tour_title,
  t.location,

  'Mr. Dara' AS guide_name,
  '+855 12 345 678' AS guide_phone

FROM bookings b
JOIN tours t
ON b.tour_id=t.tour_id

WHERE b.booking_id=$1`,
      [bookingId]
    );

  return result.rows[0];

};
export const checkInBooking = async (
  bookingId
) => {

  // Find booking first
  const existing =
    await pool.query(
      `
      SELECT
        b.*,
        t.title AS tour_title
      FROM bookings b
      JOIN tours t
      ON b.tour_id = t.tour_id
      WHERE b.booking_id = $1
      `,
      [bookingId]
    );

  if (
    existing.rows.length === 0
  ) {
    throw new Error(
      "Booking not found"
    );
  }

  const booking =
    existing.rows[0];

  // Already checked in
  if (
    booking.is_checked_in
  ) {

    return {
      alreadyCheckedIn: true,
      ...booking,
    };

  }

  // First check-in
  const result =
    await pool.query(
      `
      UPDATE bookings
      SET
        is_checked_in = TRUE,
        checked_in_at = NOW()
      WHERE booking_id = $1
      RETURNING *
      `,
      [bookingId]
    );

  const updated =
    await pool.query(
      `
      SELECT
        b.*,
        t.title AS tour_title
      FROM bookings b
      JOIN tours t
      ON b.tour_id = t.tour_id
      WHERE b.booking_id = $1
      `,
      [bookingId]
    );

  return {
    alreadyCheckedIn: false,
    ...updated.rows[0],
  };
};
export const getCheckedInBookings =
  async () => {

    const result =
      await pool.query(`

        SELECT

          b.booking_id,
          b.full_name,
          b.checked_in_at,

          t.title AS tour_title,
          t.location

        FROM bookings b

        JOIN tours t
        ON b.tour_id = t.tour_id

        WHERE b.is_checked_in = TRUE

        ORDER BY b.checked_in_at DESC

      `);

    return result.rows;

};
export const getMyBookings =
  async (userId) => {

    const result =
      await pool.query(
        `
        SELECT
          b.*,
          t.title,
          t.image
        FROM bookings b
        JOIN tours t
          ON b.tour_id =
             t.tour_id
        WHERE
          b.user_id = $1
        ORDER BY
          b.created_at DESC
        `,
        [userId]
      );

    return result.rows;

};