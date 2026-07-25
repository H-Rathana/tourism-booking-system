import pool from "../config/database.js";

export const createGalleryImage = async (
  tourId,
  image
) => {

  const result = await pool.query(

    `
    INSERT INTO tour_gallery
    (
      tour_id,
      image
    )

    VALUES
    (
      $1,
      $2
    )

    RETURNING *
    `,

    [
      tourId,
      image
    ]

  );

  return result.rows[0];

};

export const getGalleryByTour = async (
  tourId
) => {

  const result = await pool.query(

    `
    SELECT *
    FROM tour_gallery
    WHERE tour_id=$1
    ORDER BY gallery_id ASC
    `,

    [tourId]

  );

  return result.rows;

};

export const deleteGalleryImage = async (
  galleryId
) => {

  await pool.query(

    `
    DELETE
    FROM tour_gallery
    WHERE gallery_id=$1
    `,

    [galleryId]

  );

};