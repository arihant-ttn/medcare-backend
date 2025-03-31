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
    { expiresIn: "1h" }
  );
};
