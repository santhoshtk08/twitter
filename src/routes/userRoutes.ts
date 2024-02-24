import { Router } from "express";
import { PrismaClient } from "@prisma/client";


const router = Router()
const prisma = new PrismaClient();

// CREATE A USER
router.post("/", async (req, res) => {
    const { email, name, userName } = req.body
    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                userName: userName,
                bio: "Hi, I'm new on Twitter"
            }
        })
        res.json({
            "userCreated": user
        })
    } catch (err) {
        res.json({
            "error": "User not created"
        })
    }

})

// GET ALL USERS
router.get("/", async (req, res) => {
    const allUsers = await prisma.user.findMany()
    res.json({
        "allUsers": allUsers
    })
})

// GET ONE USER
router.get("/:id", async (req, res) => {
    const id = req.params.id
    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: { tweets: true }
    })
    if (!user) {
        return res.json({ "Error": "USer not found" })
    }
    res.json({
        "User": user
    })
})

//UPDATE A USER
router.put("/:id", async (req, res) => {
    const id = req.params.id
    const { bio } = req.body
    try {
        const user = await prisma.user.update({ where: { id: Number(id) }, data: { bio } })
        res.json({
            "userUpdated": user
        })
    } catch (error) {
        res.json({
            "Error": "Failed to update the user"
        })
    }

})

// DELETE A USER

router.delete("/:id", async (req, res) => {
    const id = req.params.id

    const user = await prisma.user.delete({ where: { id: Number(id) } })
    res.json({
        "Msg": "User Deleted"
    })
})

export default router;