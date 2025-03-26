import express from 'express';
import appointmentController from '../controllers/appointmentController.js'
import doctorsListController from '../controllers/listController.js';
import signUpController from '../controllers/signUpController.js';
import loginController from '../controllers/loginController.js';
import getAllAppointments from '../controllers/appointmentController.js';
const router=express.Router();
router.use('/get-appointments',getAllAppointments);
router.use('/listDoctors',doctorsListController);
router.use('/signUp',signUpController);
router.use('/',loginController);
router.use('/appointments',appointmentController);   
export default router;