
import { updateDoctorRatingService } from "../services/ratingService.js";

import express from 'express';

const router = express.Router();


//  Add/Update Doctor Rating
router.post('/updateRating', async (req, res) => {
  try {
    const { doctorId, rating } = req.body;

    // 🔎 Validate input
    if (!doctorId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Doctor ID and valid rating are required" });
    }

    //  Update Doctor Rating
    const updatedRating = await updateDoctorRatingService(doctorId, rating);

    res.status(200).json({
      message: "Rating updated successfully",
      newRating: updatedRating,
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ error: "Failed to update rating" });
  }


});

export default router;
