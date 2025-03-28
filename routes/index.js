import express from 'express';
import appointmentController from '../controllers/appointmentController.js'
import doctorsListController from '../controllers/listController.js';
import signUpController from '../controllers/signUpController.js';
import loginController from '../controllers/loginController.js';
import getAllAppointments from '../controllers/appointmentController.js';
import doctorsWithAppointments from '../controllers/appointmentController.js';
import  fetchAppointmentsByDoctor from '../controllers/appointmentController.js';
import  updateStatus from '../controllers/appointmentController.js';

import forgotPassword from '../controllers/forgotPassword.js' 

import manageDoctor from '../controllers/manageDoctor.js';
const router=express.Router();

router.use('/manageDoctors',manageDoctor);
// router.use("/", fetchAppointmentsByDoctor);

// router.use('/doctorsWithAppointments',doctorsWithAppointments);
router.use('/',updateStatus);
// router.use('/get-appointments',getAllAppointments);
router.use('/listDoctors',doctorsListController);
router.use('/signUp',signUpController);
router.use('/',loginController);
router.use('/',appointmentController);   

router.use('/',forgotPassword);

export default router;