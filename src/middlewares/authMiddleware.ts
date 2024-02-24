import { Request, Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";


const JWT_SECRET = process.env.JWT_SECRET|| 'SUPER SECRET';
const jwt = require("jsonwebtoken")


const prisma = new PrismaClient();

type AuthReq = Request & { user?: User }

export default async function authenticateToken(
    req: AuthReq,
    res: Response,
    next: NextFunction
) {
    const jwtToken = req.headers['authorization']?.split(" ")[1];
    if (!jwtToken) return res.sendStatus(401);

    try {
        const payload = await jwt.verify(jwtToken, JWT_SECRET)

        const dbToken = await prisma.token.findUnique({
            where: { id: payload.tokenId },
            include: { user: true }
        })

        if (!dbToken?.valid || dbToken.expiration < new Date()) return res.status(401).json({ "error": "API token not valid" })

        req.user = dbToken.user;


    } catch (error) {
        console.log(error);
        res.status(401);

    }

    next()
}