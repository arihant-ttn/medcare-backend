import jwt from "jsonwebtoken";

const JWT_SECRET = "my_jwt_secret";
// Generate JWT Token
export const generateToken = (user) => {
    
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const generateResetToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "15m" });
  };
  
  //  Verify Reset Token
  export const verifyResetToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
  };