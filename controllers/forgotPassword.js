import express from "express";
import {
  forgotPassword,
} from "../services/forgotPassword.js";

const router = express.Router();

//  Forgot Password Route
router.post("/forgot-password", forgotPassword);

//  Reset Password Route
// router.post("/reset-password", resetPassword);

export default router;
