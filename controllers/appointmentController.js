import {createAppointment} from "../services/appointments.js";
import {getAllAppointments }from '../services/appointments.js'
import express from 'express';

const router = express.Router();
router.get("/", async (req, res) => {
    const result = await getAllAppointments();
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  });
  

router.post("/", async (req, res) => {
    try {
      const response = await createAppointment(req.body);
  
      if (response) {
        return res.status(201).send({ data: response.data });
      } else {
        throw new Error("Error in adding appointment");
      }
    } catch (err) {
      console.error("Error in adding appointment", err);
      return res.status(400).send("Error Occurred");
    }
  });
  
  export default router;