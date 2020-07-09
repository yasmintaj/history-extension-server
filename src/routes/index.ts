/**
 * Router import
 */
import { Router } from "express";
import sessionRoute from "../controllers/session";

const router: Router = Router();

router.use("/session", sessionRoute);

export default router;
