import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const jwt = require("jsonwebtoken")


const EMAIL_TOKEN_EXPIRATION_MIN = 10;
const JWT_TOKEN_EXPIRATION_HRS = 12;
const JWT_SECRET = "It is a super secret"

const router = Router()
const prisma = new PrismaClient()

function generateEmailToken(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function generateJwtToken(tokenId: number): string {
    const jwtPayload = { tokenId };
    return jwt.sign(jwtPayload, JWT_SECRET, {
        algorithm: "HS256",
        noTimestamp: true,
    })
}
//CREATE A USER IF DOES'T EXIST
//GENERATE THE EMAILTOKEN AND SEND TO THIER EMAIL
router.post('/login', async (req, res) => {
    const { email } = req.body;

    //GENERATE A TOKEN
    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MIN * 60 * 1000)
    try {
        const createToken = await prisma.token.create({
            data: {
                type: "EMAIL",
                emailToken,
                expiration,
                user: {
                    connectOrCreate: {
                        where: { email },
                        create: { email }
                    },
                },
            },
        })

        console.log(createToken);
        // SEND EMAIL TOKEN TO USER EMAIL
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.status(400).json({
            "error": "Could't start authentication"
        })

    }
})

//VALIDATE THE EMAIL TOKEN
//GENERATE A LONGLIVED JWT TOKEN

router.post('/authenticate', async (req, res) => {
    const { email, emailToken } = req.body;
    const dbEmailToken = await prisma.token.findUnique({
        where: { emailToken },
        include: { user: true }
    })

    if (!dbEmailToken || !dbEmailToken.valid) return res.sendStatus(401)

    if (dbEmailToken.expiration < new Date()) return res.sendStatus(401).json({ "error": "Token Expired" })

    if (dbEmailToken?.user?.email != email) return res.sendStatus(401).json({ "error": "Incorrect Email" })

    const expiration = new Date(new Date().getTime() + JWT_TOKEN_EXPIRATION_HRS * 60 * 60 * 1000)

    const jwtToken = await prisma.token.create({
        data: {
            type: "JWT",
            expiration,
            user: {
                connect: {
                    email
                }
            }
        }
    })

    // INVALIDATE EMAIL TOKEN

    await prisma.token.update({
        where: { id: dbEmailToken.id },
        data: { valid: false }
    })

    //GENERATE A JWT TOKEN

    const authToken = generateJwtToken(jwtToken.id)

    res.json({ authToken });
})

export default router