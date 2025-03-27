import express from "express";
import upload from "../middleware/multer.js";
import { addDoctor, deleteDoctor ,updateDoctor} from "../services/manageDoctor.js";

const router = express.Router();


router.put("/update/:id", updateDoctor);

router.post("/add", upload.single("image"), addDoctor);

router.delete("/delete/:id", deleteDoctor);

export default router;
