import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router()
const prisma = new PrismaClient();

// Create A TWEET

router.post("/", async (req, res) => {
    const { content, userId } = req.body

    try {
        const tweet = await prisma.tweet.create({
            data: {
                content: content,
                userId: Number(userId)
            }
        })
        res.json({
            "tweetCreated": tweet
        })
    } catch (error) {

    }
})

// GET ALL TWEETS

router.get("/", async (req, res) => {
    const tweets = await prisma.tweet.findMany();
    res.json({
        "allTweets": tweets
    })
})

//GET A TWEET
router.get("/:id", async (req, res) => {
    const id = req.params.id
    const tweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });
    if (!tweet) {
        return res.json({ "error": "Tweet not found" })
    }
    res.json({
        "tweet": tweet
    })
})

// DELETE A TWEET
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.tweet.delete({ where: { id: Number(id) } });
    res.json({ "msg": "Tweet Deleted" });
});
export default router;