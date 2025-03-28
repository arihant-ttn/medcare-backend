
import {getAllAppointments,createAppointment,doctorsWithAppointments,getAppointmentsByDoctor,updateStatus,getBookedSlots }from '../services/appointments.js'
import express from 'express';

const router = express.Router();

router.get('/doctor/:doctorId', async (req,res)=>{
  const {doctorId} = req.params;
  const result = await getAppointmentsByDoctor(doctorId);
  if(result){
    res.status(200).json(result);}
    else{
      res.status(404).json(result);
    }
  
})

router.get("/doctorsWithAppointments", async (req, res) => {
  console.log("controller hit");
  const result = await doctorsWithAppointments();
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
});
router.get("/", async (req, res) => {
    const result = await getAllAppointments();
    console.log(result);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  });
  

router.post("/appointments", async (req, res) => {
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
  
router.put ('/updateStatus/:appointmentId', async(req,res)=>{
  const {appointmentId} = req.params;
  const {status} = req.body;
  const result = await updateStatus(appointmentId,status);
  console.log(result);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
})
router.get('/get-bookedSlots',getBookedSlots);

  export default router;