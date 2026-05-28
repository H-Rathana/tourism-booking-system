import pool from "../config/database.js";

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

      // ✅ UPDATE PAYMENT
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