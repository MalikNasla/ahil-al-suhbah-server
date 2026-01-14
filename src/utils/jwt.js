import jwt from "jsonwebtoken";

export function signToken({ userId, role }) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing in .env");

  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}
