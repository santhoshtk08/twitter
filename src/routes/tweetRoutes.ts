import { Router } from "express";
import { PrismaClient } from "@prisma/client";



const router = Router()
const prisma = new PrismaClient();

// Create A TWEET

router.post("/", async (req, res) => {
    const { content, image } = req.body
    //@ts-ignore
    const user = req.user;

    try {
        const tweet = await prisma.tweet.create({
            data: {
                content,
                image,
                userId: user.id,
            }
        })
        res.json({
            "tweetCreated": tweet
        })
    } catch (error) {

    }
})

// GET ALL TWEETS

router.get('/', async (req, res) => {
    const allTweets = await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    userName: true,
                    image: true,
                },
            },
        },
    });
    res.json(allTweets);
});

//GET A TWEET
router.get("/:id", async (req, res) => {
    const id = req.params.id
    const tweet = await prisma.tweet.findUnique({
        where: { id: Number(id) },
        include: { user: true }

    });
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