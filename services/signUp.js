import pool from '../db/index.js';
import bcrypt from 'bcrypt';


const signUp =async (body)=>{
    try{
        const {name,email,password}=body;
        const hashed_password = await bcrypt.hash(password,10);

        const result= await pool.query("INSERT INTO users (name , email,password) values ($1,$2,$3)",[name,email,hashed_password]);
        return{
            success:true,
            message:"User Added"
        }
    }catch(err){
        console.error("Error in adding User(signUp)", err)
        return{
            success:false,
            data:error
        }
    }
}

export default signUp;