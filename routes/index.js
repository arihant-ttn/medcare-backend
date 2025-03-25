import express from 'express';

import doctorsListController from '../controllers/listController.js';
import signUpController from '../controllers/signUpController.js';
import loginController from '../controllers/loginController.js';
const router=express.Router();

router.use('/listDoctors',doctorsListController);
router.use('/signUp',signUpController);
router.use('/',loginController);
export default router;