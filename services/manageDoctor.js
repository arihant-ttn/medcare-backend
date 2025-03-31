import pool from "../db/index.js";
import { uploadToCloudinary, deleteFromCloudinary } from "./upload.js";

//  Add New Doctor
export const addDoctor = async (req, res) => {
  try {
    const { name, specialization, experience, gender, qualification, diseases ,description,reviews} = req.body;
    let imageUrl = "";

    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        if (!result.secure_url) {
          return res.status(500).json({ error: "Failed to upload image to Cloudinary" });
        }
        imageUrl = result.secure_url;
      }
      

    const query = `
     INSERT INTO doctors (name, specialization, experience, gender, qualification, disease, description, reviews, image)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);


    `;

    const values = [
        name,
        specialization,
        experience,
        gender,
        qualification,
        diseases,
        description,
        reviews,
        imageUrl,
      ];
      
    const { rows } = await pool.query(query, values);

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ error: "Failed to add doctor" });
  }
};


//  Delete Doctor
export const deleteDoctor = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    // Get the image URL and public ID
    const doctor = await pool.query("SELECT image FROM doctors WHERE id = $1;", [id]);
    if (doctor.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const imageUrl = doctor.rows[0].image;
    const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public ID from URL

    // Delete image from Cloudinary
    await deleteFromCloudinary(publicId);

    // Delete record from database
    await pool.query("DELETE FROM doctors WHERE id = $1;", [id]);

    res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ error: "Failed to delete doctor" });
  }
};
export const getAllDoctor = async (req, res) => {
  try {
    //  Fetch all doctors from the database
    const doctor = await pool.query("SELECT * FROM doctors;");
    
    //  Return empty array if no doctor found
    if (doctor.rows.length === 0) {
      return res.status(200).json({ data: [] }); // Return empty array
    }

    //  Send fetched doctor data
    res.status(200).json({ success: true, data: doctor.rows });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};



export const updateDoctor = async (req, res) => {
    try {
      const { id } = req.params; 
      const {
        qualification,
        diseases,
        rating,
        image,
        reviews,
        description,
      } = req.body;
  
      //  Prepare fields dynamically
      let query = `UPDATE doctors SET `;
      const values = [];
      let index = 1;
  
      if (qualification) {
        query += `qualification = $${index}, `;
        values.push(qualification);
        index++;
      }
  
      if (diseases) {
        query += `disease = $${index}, `;
        values.push(diseases);
        index++;
      }
  
      if (rating) {
        query += `rating = $${index}, `;
        values.push(rating);
        index++;
      }
  
      if (image) {
        query += `image = $${index}, `;
        values.push(image);
        index++;
      }
  
      if (reviews) {
        query += `reviews = $${index}, `;
        values.push(reviews);
        index++;
      }
  
      if (description) {
        query += `description = $${index}, `;
        values.push(description);
        index++;
      }
  
      //  Remove trailing comma and space
      query = query.slice(0, -2);
  
      //  Add WHERE clause
      query += ` WHERE id = $${index}`;
      values.push(id);
  
      //  Execute query
      const result = await pool.query(query, values);
  
      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: `Doctor with ID ${id} not found.`,
        });
      }
  
      res.status(200).json({
        success: true,
        message: `Doctor with ID ${id} updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating doctor:", error);
      res.status(500).json({
        success: false,
        message: "Error updating doctor.",
      });
    }
  };
  