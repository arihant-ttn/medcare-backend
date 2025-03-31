import pool from "../db/index.js";

//  Fetch Current Rating and Total Reviews Count
const getDoctorData = async (doctorId) => {
  const query = `
    SELECT rating, reviews_count
    FROM doctors
    WHERE id = $1;
  `;
  const result = await pool.query(query, [doctorId]);
  return result.rows[0];
};

//  Update Doctor's Rating
export const updateDoctorRatingService = async (doctorId, newRating) => {
  //  Get current rating and reviews count
  const doctorData = await getDoctorData(doctorId);

  if (!doctorData) {
    throw new Error("Doctor not found");
  }

  const { rating, reviews_count } = doctorData;

  //  Calculate new average rating
  const currentRating = parseInt(rating, 10);
  const currentReviewsCount = parseInt(reviews_count, 10);

  //  Calculate new total rating and new average as an integer
  const totalRating = currentRating * currentReviewsCount + parseInt(newRating, 10);
  const newReviewsCount = currentReviewsCount + 1;
  const avgRating = Math.round(totalRating / newReviewsCount);
  //  Update doctor's rating and review count
  const updateQuery = `
    UPDATE doctors
    SET rating = $1, reviews_count = $2
    WHERE id = $3;
  `;
  const updateRes = await pool.query(updateQuery, [avgRating, newReviewsCount, doctorId]);

};
