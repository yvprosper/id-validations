import express from "express";
// import other routes
import dummyRouter from "interfaces/http/router/v1/dummyRouter";

const router = express.Router();

// mount routes
router.use("/todos", dummyRouter);

export default router;
