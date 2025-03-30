import express from "express";
import  fetchDoctors  from "../services/doctorsList.js";

const router = express.Router();

//  Fetch Doctors with Filters & Pagination
router.get("/", async (req, res) => {
  console.log("hit");

  const filters = req.query;
  console.log(filters);
  
  const page = parseInt(req.query.page) || 1;


  // Fetch doctors with filters
  const response = await fetchDoctors(filters, page);
  // console.log("Controller ", response);
  if (response) {
    res.status(200).json(response);
  } else {
    res.status(500).json({message: "Nothing!!"});
  }
});

export default router;
