import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authoriozation

        if (!authHeader){
            return res.status(401).json({message: "Missing Authorization Header" });
        }

        const [scheme, token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({message: "Invalid Authorization Format"})
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({message: "JWT_SECRET not configured on server"})
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded payload to the request so future middleware/routes can use it.
        // Example payload: { userId: "...", role: "basic", iat: ..., exp: ... }
        req.user = payload

        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}