import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { signToken } from "../utils/jwt.js";

const router = Router();

router.post("/register", async (req, res, next) => {
    try{

        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "name, email, phone, password are required" });
        }
        
        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
        const incomingEmail = email.toLowerCase().trim();
        const roles = adminEmail && incomingEmail === adminEmail ? ["admin"] : ["basic"];


        const user = await User.create({
            name: name.trim(),
            email: incomingEmail,
            phone: phone.trim(),
            passwordHash,
            roles,
        });

        const token = signToken({ userId: user._id.toString(), roles: user.roles });


        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                roles: user.roles,   // or roles: user.roles
            },
            token,
        });
    } catch (err) {
        next(err);
    }    
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" });
      }
  
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({ message: "Invalid Email" });
      }
  
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ message: "Invalid Password" });
      }
  
      const token = signToken({ userId: user._id.toString(), roles: user.roles });
  
      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          roles: user.roles,
        },
        token,
      });
    } catch (err) {
        next(err);
    }
});
  
  export default router;