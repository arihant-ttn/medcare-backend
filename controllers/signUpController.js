import express from 'express';
import signUp from '../services/signUp.js';

const router = express.Router();

router.post("/", async (req, res) => {
    try {
      const response = await signUp(req.body);
  
      if (response && response.success) {
        return res.status(201).send({ data: response.data });
      } else {
        throw new Error("Error in adding user");
      }
    } catch (err) {
      console.error("Error in signUp:", err);
      return res.status(400).send("Error Occurred");
    }
  });
  
  export default router;
  