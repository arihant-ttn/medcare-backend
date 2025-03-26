import pool from "../db/index.js";

export const createAppointment = async (body) => {
  const {
    doctorId,
    userId,
    visitType,
    hospital,
    selectedShift,
    slot,
    selectedDate,
  } = body;

  try {
    // ✅ SQL Query to Insert Appointment
    const query = `
      INSERT INTO appointments (
        visitType, hospital, selectedShift, slot, selectedDate, docId, userId
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    // ✅ Query Parameters
    const values = [
      visitType,
      hospital,
      selectedShift,
      slot,
      selectedDate,
      doctorId,
      userId,
    ];

    // 🔥 Execute Query
    const res = await pool.query(query, values);

    // ✅ Return Inserted Record
    return {
      success: true,
      message: "Appointment created successfully",
      data: res.rows[0],
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return {
      success: false,
      message: "Error creating appointment",
      error: error.message,
    };
  }
};


export const getAllAppointments = async () => {
    try {
      // 🎯 Fetch all appointments
      const response = await pool.query("SELECT * FROM appointments");
  
      // ✅ Check if appointments exist
      if (response.rows.length > 0) {
        return {
          success: true,
          data: response.rows,
        };
      } else {
        return {
          success: false,
          message: "No appointments found",
        };
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return {
        success: false,
        message: "Error fetching appointments",
        error: error.message,
      };
    }
  };
  


