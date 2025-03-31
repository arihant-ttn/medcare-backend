import pool from '../db/index.js';
import bcrypt from 'bcrypt';


const signUp =async (body)=>{
    try{
        const {name,email,password}=body;
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [
            email,
          ]);

          if (userExists.rows.length > 0) {
            //  Return 409 if user exists
            return{
                status:409,
                success:true,
                message:"User Exists"
            }
          }
      
        
        const hashed_password = await bcrypt.hash(password,10);

        const result= await pool.query("INSERT INTO users (name , email,password) values ($1,$2,$3)",[name,email,hashed_password]);
        return{
            status:200,
            success:true,
            message:"User Added"
        }
    }catch(err){
        console.error("Error in adding User(signUp)", err)
        return{
            status:500,
            success:false,
            data:error
        }
    }
}

export default signUp;