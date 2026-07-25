import pool from "../config/database.js";


//View all Tour From Database
export const getAllTours = async () => {
  
  const result = await pool.query(`
      SELECT
    t.tour_id,
    t.title,
    t.description,
    t.itinerary,
    t.location,
    t.price,
    t.duration,
    t.max_people,
    t.image,

    TO_CHAR(
        t.available_from,
        'YYYY-MM-DD'
    ) AS available_from,

    TO_CHAR(
        t.available_until,
        'YYYY-MM-DD'
    ) AS available_until,

    t.status,
    t.created_at,

      COALESCE(

        SUM(

          CASE

            WHEN b.status IN ('Pending','approved')

            THEN b.people_count

            ELSE 0

          END

        ),

        0

      ) AS booked_people,

      (

        t.max_people -

        COALESCE(

          SUM(

            CASE

              WHEN b.status IN ('Pending','approved')

              THEN b.people_count

              ELSE 0

            END

          ),

          0

        )

      ) AS remaining_seats

    FROM tours t

    LEFT JOIN bookings b

      ON t.tour_id = b.tour_id

    GROUP BY t.tour_id

    ORDER BY t.created_at DESC
  `);

  return result.rows;

};

export const createTourService = async ({
  title,
  description,
  itinerary,
  location,
  price,
  duration,
  max_people,
  available_from,
  available_until,
  image,
}) => {

  const result = await pool.query(
    `
    INSERT INTO tours
(
  title,
  description,
  itinerary,
  location,
  price,
  duration,
  max_people,
  available_from,
  available_until,
  image
)

VALUES
(
  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
)

    RETURNING *
    `,
    [
      title,
      description,
      itinerary,
      location,
      price,
      duration,
      max_people,
      available_from,
      available_until,
      image,
    ]
  );

  return result.rows[0];
};
export const getAvailableTours = async () => {
   await updateTourStatus();
  const result = await pool.query(`
      SELECT
    t.tour_id,
    t.title,
    t.description,
    t.itinerary,
    t.location,
    t.price,
    t.duration,
    t.max_people,
    t.image,

    TO_CHAR(
        t.available_from,
        'YYYY-MM-DD'
    ) AS available_from,

    TO_CHAR(
        t.available_until,
        'YYYY-MM-DD'
    ) AS available_until,

    t.status,
    t.created_at,

      (
        t.max_people -
        COALESCE(
          (
            SELECT SUM(b.people_count)
            FROM bookings b
            WHERE b.tour_id = t.tour_id
            AND b.status IN ('Pending','approved')
          ),
          0
        )
      ) AS remaining_seats

    FROM tours t

    WHERE

      t.status = 'ACTIVE'

      AND t.available_from > CURRENT_DATE

      AND (
        t.max_people -
        COALESCE(
          (
            SELECT SUM(b.people_count)
            FROM bookings b
            WHERE b.tour_id = t.tour_id
            AND b.status IN ('Pending','approved')
          ),
          0
        )
      ) > 0

    ORDER BY t.available_from ASC
  `);

  return result.rows;

};

export const getTourByIdService = async (id) => {
   await updateTourStatus();
  const result = await pool.query(
    `
    SELECT

    t.tour_id,
    t.title,
    t.description,
    t.itinerary,
    t.location,
    t.price,
    t.duration,
    t.max_people,
    t.image,

    TO_CHAR(
        t.available_from,
        'YYYY-MM-DD'
    ) AS available_from,

    TO_CHAR(
        t.available_until,
        'YYYY-MM-DD'
    ) AS available_until,

    t.status,
    t.created_at,

      COALESCE(
          SUM(
              CASE
                  WHEN b.status IN ('Pending','approved')
                  THEN b.people_count
                  ELSE 0
              END
          ),
          0
      ) AS booked_people,

      (
          t.max_people -
          COALESCE(
              SUM(
                  CASE
                      WHEN b.status IN ('Pending','approved')
                      THEN b.people_count
                      ELSE 0
                  END
              ),
              0
          )
      ) AS remaining_seats

  FROM tours t

  LEFT JOIN bookings b
  ON t.tour_id = b.tour_id

  WHERE t.tour_id = $1

  GROUP BY t.tour_id;
    `,
    [id]
  );

  return result.rows[0];
};
//Update Tour
export const updateTourService = async (id, data) => {

  const {
    title,
    description,
    itinerary,
    location,
    price,
    duration,
    max_people,
    available_from,
    available_until,
    image,
  } = data;

  const result = await pool.query(
    `
    UPDATE tours
    SET
      title = $1,
      description = $2,
      itinerary = $3,
      location = $4,
      price = $5,
      duration = $6,
      max_people = $7,
      available_from = $8,
      available_until = $9,
      image = COALESCE($10, image)

    WHERE tour_id = $11

    RETURNING *;
    `,
    [
      title,
      description,
      itinerary,
      location,
      price,
      duration,
      max_people,
      available_from,
      available_until,
      image,
      id,
    ]
  );

  return result.rows[0];

};

export const deleteTourService = async (id) => {
  await pool.query(`DELETE FROM tours WHERE tour_id = $1`, [id]);
};

export const getPopularTours = async () => {

  const result = await pool.query(`
    SELECT
    t.*,
    COUNT(b.booking_id)::int AS bookings
FROM tours t
LEFT JOIN bookings b
ON b.tour_id = t.tour_id

WHERE
    t.status = 'ACTIVE'
    AND t.available_from > CURRENT_DATE

GROUP BY t.tour_id

ORDER BY
    bookings DESC,
    t.available_from ASC

LIMIT 3;
  `);

  return result.rows;
};
export const getTourStats = async () => {

    const result = await pool.query(`
        SELECT
            COUNT(*) AS total_tours,
            COUNT(DISTINCT location) AS destinations
        FROM tours
    `);

    const bookingResult = await pool.query(`
        SELECT COUNT(*) AS travelers
        FROM bookings
        WHERE status='completed'
    `);

    const reviewResult = await pool.query(`
        SELECT
            ROUND(AVG(rating),1) AS average_rating
        FROM reviews
    `);

    return {
        totalTours: Number(result.rows[0].total_tours),
        destinations: Number(result.rows[0].destinations),
        travelers: Number(bookingResult.rows[0].travelers),
        averageRating:
            Number(reviewResult.rows[0].average_rating || 0)
    };
};

export const updateTourStatus = async () => {

  await pool.query(`
    UPDATE tours t
    SET status = CASE

      -- Tour starts today or has already started
      WHEN t.available_from <= CURRENT_DATE
        THEN 'EXPIRED'

      -- Tour is full
      WHEN (
        SELECT COALESCE(SUM(b.people_count), 0)
        FROM bookings b
        WHERE
          b.tour_id = t.tour_id
          AND b.status IN ('Pending', 'approved')
      ) >= t.max_people
        THEN 'FULL'

      -- Otherwise it is available
      ELSE 'ACTIVE'

    END
  `);

};

export const updateSingleTourStatus = async (tourId) => {

  await pool.query(
    `
    UPDATE tours t
    SET status = CASE

      WHEN t.available_from <= CURRENT_DATE
        THEN 'EXPIRED'

      WHEN (
        SELECT COALESCE(SUM(b.people_count), 0)
        FROM bookings b
        WHERE
          b.tour_id = t.tour_id
          AND b.status IN ('Pending', 'approved')
      ) >= t.max_people
        THEN 'FULL'

      ELSE 'ACTIVE'

    END

    WHERE t.tour_id = $1
    `,
    [tourId]
  );

};

export const getPopularDestinations = async () => {

  const result = await pool.query(`
    SELECT

      location,

      MIN(image) AS image,

      COUNT(*)::int AS total_tours,

      MIN(price) AS starting_price

    FROM tours

    WHERE status = 'ACTIVE'

    GROUP BY location

    ORDER BY total_tours DESC
  `);

  return result.rows;

};


export const getDestinationsService = async () => {

  const result = await pool.query(`
    SELECT
      location,

      COUNT(*)::int AS total_tours,

      MIN(price) AS starting_price,

      (
        SELECT image
        FROM tours t2
        WHERE
          t2.location = t.location
          AND t2.status = 'ACTIVE'
        LIMIT 1
      ) AS image

    FROM tours t

    WHERE
      t.status = 'ACTIVE'

    GROUP BY location

    ORDER BY total_tours DESC;
  `);

  return result.rows;

};