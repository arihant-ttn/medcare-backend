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
  
export const doctorsWithAppointments = async ()=>{
  try {
    //  Fetch all appointments
    const response = await pool.query(
      "SELECT doctors.*, appointments.* FROM doctors INNER JOIN appointments ON doctors.id = appointments.docId WHERE appointments.status = 'Pending'"
    );
    
    //  Check if appointments exist
    if (response.rows.length > 0) {
      return {
        success: true,
        data: response.rows,
      };
    } else {
      return {
        success: false,
        message: "No Doctors with appointments found",
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
}

export const getAppointmentsByDoctor = async (doctorId) => {
  try {
    //  Fetch all appointments
    const response = await pool.query(
      "SELECT * FROM appointments WHERE docId = $1 ORDER BY selectedDate ASC",
      [doctorId]);
    
    //  Check if appointments exist
    if (response.rows.length > 0) {
      return {
        success: true,
        data: response.rows,
      };
    } else {
      return {
        success: false,
        message: "No Doctors with appointments found",
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

export const updateStatus = async(appointmentId,status)=>{
  try {
    //  Fetch all appointments
    const response = await pool.query(
      "UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *",
      [status, appointmentId]);
    
    //  Check if appointments exist
    if (response.rows.length > 0) {
      return {
        success: true,
        data: response.rows,
      };
    } else {
      return {
        success: false,
        message: "Appointment Status updated Successfully",
      };
    }
  } catch (error) {
    console.error("Error updating:", error);
    return {
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    };
  }
}