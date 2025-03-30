import express from 'express';
import signUpUser from '../services/signUp.js';

const router = express.Router();

router.post("/", async (req, res) => {
    try {
      console.log("controller",req.body);
      const response = await signUpUser(req.body);
      console.log(response);
      if(response.status==409){
        return res.status(409).json({message:"User Already exists"});
      }
  
      else if (response.status=200) {
        return res.status(200).json({ message:"User Added successfully" });
      } else {
        throw new Error("Error in adding user");
      }
    } catch (err) {
      console.error("Error in signUp:", err);
      return res.status(400).send("Error Occurred");
    }
  });
  
  export default router;
  