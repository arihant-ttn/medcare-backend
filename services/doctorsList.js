// controllers/doctorsController.js
import pool from "../db/index.js";

const fetchDoctors = async (filters, page=1) => {
  try {
    const { search, rating, experience, gender, page = 1, limit = 6 } = filters;

    let query = `SELECT * FROM doctors WHERE 1 = 1`;

    //  Search by name or specialization
    if (search) {
      query += ` AND (
        LOWER(name) LIKE LOWER('%${search}%') OR
        LOWER(specialization) LIKE LOWER('%${search}%') OR
        LOWER(disease) LIKE LOWER('%${search}%')
      )`;
    }
    // Filter by Rating
    if (rating && rating !== "showAll") {
      query += ` AND rating = ${parseInt(rating)}`;
    }

    //  Filter by Experience
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

    //  Filter by Gender
    if (gender && gender !== "showAll") {
      query += ` AND gender = '${gender}'`;
    }
    if (!search && !rating && !experience && gender === "showAll") {
      query += ` ORDER BY rating DESC`; //  Default sort by highest ratings
    } else {
      query += ` ORDER BY rating DESC`; //  Always sort filtered results by rating
    }
    const cQuery = query;
    console.log(query);
    //  Pagination Logic
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    //  Count total doctors for pagination
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
    console.error(" Error fetching doctors:", err);
   
  }
};




export default fetchDoctors;
