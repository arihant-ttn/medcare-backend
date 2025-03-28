import jwt from "jsonwebtoken";


// ✅ Generate JWT Token
export const generateToken = (user) => {
    const JWT_SECRET = "my_jwt_secret";
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};
