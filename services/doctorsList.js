// controllers/doctorsController.js
import { fileLoader } from "ejs";
import pool from "../db/index.js";

// const fetchDoctors = async (filters,page=1) => {
//   // console.log("list service",req.query);

//   const { search, rating, experience, gender } = filters;
  

//   // ✅ SQL Query with Filters
//   let query = `SELECT * FROM doctors WHERE 1 = 1`;

  
//   if (search) {
//     query += ` AND (LOWER(name) LIKE LOWER('%${search}%') OR LOWER(specialization) LIKE LOWER('%${search}%'))`;
//   }

//   // ⭐️ Filter by Rating
//   if (rating && rating !== "showAll") {
//     query += ` AND rating = ${parseInt(rating)}`;
//   }

//   // ⏳ Filter by Experience
//   if (experience) {
//     switch (experience) {
//       case "15+":
//         query += ` AND experience >= 15`;
//         break;
//       case "10-15":
//         query += ` AND experience >= 10 AND experience < 15`;
//         break;
//       case "5-10":
//         query += ` AND experience >= 5 AND experience < 10`;
//         break;
//       case "3-5":
//         query += ` AND experience >= 3 AND experience < 5`;
//         break;
//       case "1-3":
//         query += ` AND experience >= 1 AND experience < 3`;
//         break;
//       case "0-1":
//         query += ` AND experience < 1`;
//         break;
//     }
//   }

//   // 👩‍⚕️ Filter by Gender
//   if (gender && gender !== "showAll") {
//     query += ` AND gender = '${gender}'`;
//   }

//   const limit = 6;
//   const offset = (page - 1) * limit;
//   query += ` LIMIT ${limit} OFFSET ${offset}`;

//   const result = await pool.query(query,[]);
//   console.log(result)
//   return result.rows;
// };


// const fetchDoctors = async (filters, page = 1) => {
//   try {
//     console.log("doctor service hit");
//     const { search, rating, experience, gender} = filters;

//     // ✅ SQL Query with Filters
//     let query = `SELECT * FROM doctors WHERE 1 = 1`;

//     // 🔎 Search by name or specialization
//     if (search) {
//       query += ` AND (LOWER(name) LIKE LOWER('%${search}%') OR LOWER(specialization) LIKE LOWER('%${search}%'))`;
//     }

//     // ⭐️ Filter by Rating
//     if (rating && rating !== "showAll") {
//       query += ` AND rating = ${parseInt(rating)}`;
//     }

//     // ⏳ Filter by Experience
//     if (experience) {
//       switch (experience) {
//         case "15+":
//           query += ` AND experience >= 15`;
//           break;
//         case "10-15":
//           query += ` AND experience >= 10 AND experience < 15`;
//           break;
//         case "5-10":
//           query += ` AND experience >= 5 AND experience < 10`;
//           break;
//         case "3-5":
//           query += ` AND experience >= 3 AND experience < 5`;
//           break;
//         case "1-3":
//           query += ` AND experience >= 1 AND experience < 3`;
//           break;
//         case "0-1":
//           query += ` AND experience < 1`;
//           break;
//       }
//     }

//     // 👩‍⚕️ Filter by Gender
//     if (gender && gender !== "showAll") {
//       query += ` AND gender = '${gender}'`;
//     }

//     // 📝 Pagination with LIMIT and OFFSET
//     const limit = 6;
//     const offset = (page - 1) * limit;
//     query += ` LIMIT ${limit} OFFSET ${offset}`;
//     console.log(query);
//     // ✅ Execute the Query
//     const result = await pool.query(query, []);
//     // console.log("Query Result:", result.rows);


//     return result.rows;
//   } catch (error) {
//     console.error("Error fetching doctors:", error.message);
//     throw new Error("Error fetching doctors from database.");
//   }
// };

// ✅ Fetch Doctors from DB with Filters & Pagination


const fetchDoctors = async (filters, page=1) => {
  try {
    const { search, rating, experience, gender, page = 1, limit = 6 } = filters;

    let query = `SELECT * FROM doctors WHERE 1 = 1`;

    // 🔎 Search by name or specialization
    if (search) {
      query += ` AND (LOWER(name) LIKE LOWER('%${search}%') OR LOWER(specialization) LIKE LOWER('%${search}%'))`;
    }

    // ⭐️ Filter by Rating
    if (rating && rating !== "showAll") {
      query += ` AND rating = ${parseInt(rating)}`;
    }

    // ⏳ Filter by Experience
    if (experience) {
      switch (experience) {
        case "15+":
          query += ` AND experience >= 15`;
          break;
        case "10-15":
          query += ` AND experience BETWEEN 10 AND 15`;
          break;
        case "5-10":
          query += ` AND experience BETWEEN 5 AND 10`;
          break;
        case "3-5":
          query += ` AND experience BETWEEN 3 AND 5`;
          break;
        case "1-3":
          query += ` AND experience BETWEEN 1 AND 3`;
          break;
        case "0-1":
          query += ` AND experience <= 1`;
          break;
      }
    }

    // 👩‍⚕️ Filter by Gender
    if (gender && gender !== "showAll") {
      query += ` AND gender = '${gender}'`;
    }
    const cQuery = query;
    // 📝 Pagination Logic
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    // 📊 Count total doctors for pagination
    const countQuery = `SELECT COUNT(*) FROM doctors WHERE 1 = 1`;

  
    const [doctorResult, countResult,fresult] = await Promise.all([
      pool.query(query),
      pool.query(countQuery),
      pool.query(cQuery)
      
    ]);

    const totalDoctors = parseInt(countResult.rows[0].count);
    const fDoctors = fresult.rows;

    return{
      doctors: doctorResult.rows,
      totalDoctors,
      fDoctors
    };

  } catch (err) {
    console.error("❌ Error fetching doctors:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




export default fetchDoctors;
