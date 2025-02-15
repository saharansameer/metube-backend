import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { SIZE_LIMIT } from "./constants.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: SIZE_LIMIT})); 
app.use(express.urlencoded({extended: false, limit: SIZE_LIMIT}));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import authRouter from "./routes/auth.routes.js";

// routes declaration
app.use("/auth", authRouter);

export default app;