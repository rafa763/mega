import express, { Router } from "express";
import server from "./api/auth";
import s from "./api/upload";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("api main route working!");
})

router.use("/auth", server);
router.use("/", s);

export default router;