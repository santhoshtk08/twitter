import express, { Request, Response } from 'express';
import userRoutes from "./routes/userRoutes"
import tweetRoutes from "./routes/tweetRoutes"
import authRoutes from "./routes/authRoutes"
import authMiddleware from "./middlewares/authMiddleware"
const app = express();

app.use(express.json());
app.use("/user", authMiddleware, userRoutes)
app.use("/tweet", authMiddleware, tweetRoutes)
app.use("/auth", authRoutes)


app.get("/", (req: Request, res: Response) => {
    res.send("Hello!")
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");

})