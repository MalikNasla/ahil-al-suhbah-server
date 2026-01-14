import { Router } from "express"
import User from "../models/user.js"
import requireAuth from "../middleware/requireAuth.js"

const router = Router()

router.get("/me", requireAuth, async (req, res, next) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId).select("-passwordHash");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                roles: user.roles,
            },
        });
    } catch (err){
        next(err);
    }
});

export default router;