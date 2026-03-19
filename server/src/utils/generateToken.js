import jwt from "jsonwebtoken";

export const generateToken = (userId, isAdmin = false) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return jwt.sign(
    { id: userId, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

