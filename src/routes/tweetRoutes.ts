import { Router } from "express";


const router = Router()

// Create a new User

router.get("/", (req, res) => {
    res.send("Hello from tweets")
})

export default router;