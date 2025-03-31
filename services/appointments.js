import pool from "../db/index.js";
import { sendEmail } from "./sendEmail.js";
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
      `SELECT DISTINCT ON (doctors.id) 
  doctors.*, 
  appointments.*
FROM doctors
INNER JOIN appointments ON doctors.id = appointments.docId
WHERE appointments.status = 'Pending'
ORDER BY doctors.id, appointments.selectedDate DESC;`
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

export const updateStatus = async(id,status)=>{
  try {
  

    // Validate status
    if (!["Approved", "Declined"].includes(status)) {
      return res.status(400).json({ error: "Invalid status provided." });
    }

    const response =await pool.query(`SELECT users.email, users.name, appointments.selecteddate, appointments.slot
FROM appointments
JOIN users ON appointments.userid = users.user_id
WHERE appointments.id = $1;
`,[id])
    //  Get appointment details
    const result = await pool.query(
      `SELECT appointments.*, doctors.name AS doctor_name
FROM appointments
JOIN doctors ON appointments.docid = doctors.id
WHERE appointments.id = $1;
`
     , [id]
    );

    if (result.rows.length === 0) {
      return {
        status:404
      }
    }

    const appointment = result.rows[0];
    const ans = response.rows[0];
    //  Update appointment status
    await pool.query("UPDATE appointments SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);
    console.log(appointment);
    //  Send Email Based on Status
    const emailTemplate = status === "Approved" ? "approved" : "declined";
    const subject = `Appointment ${status}`;
    const emailData = {
      patientName: ans.name,
      doctorName: appointment.doctor_name,
      appointmentDate: appointment.selecteddate,
      appointmentTime: appointment.slot,
    };

    //  Send email
    console.log(emailData);
    console.log("response",response);
    await sendEmail(ans.email, subject, emailTemplate, emailData);

    return{
      success: true,
      message: `Appointment status updated to ${status} and email sent successfully.`,
    }
  } catch (error) {
    console.error("Error updating status:", error);
    // res.status(500).json({ error: "Failed to update appointment status." });
  }
}


// Get Booked Slots for a Doctor on a Specific Date
export const getBookedSlots = async (req, res) => {
  const { doctorId, selectedDate } = req.query;

  try {
    const query = `
     SELECT slot, selectedShift
FROM appointments
WHERE docId = $1 AND selecteddate = $2 AND status = 'Approved';
    `;


    const result = await pool.query(query, [doctorId, selectedDate]);
    console.log(result.rows);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("❌ Error fetching booked slots:", error);
    res.status(500).json({ success: false, message: "Error fetching booked slots" });
  }
};
