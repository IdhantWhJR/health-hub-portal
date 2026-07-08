import { Router, type IRouter } from "express";
import healthRouter from "./health";
import recipesRouter from "./recipes";
import blogsRouter from "./blogs";
import timeslotsRouter from "./timeslots";
import bookingsRouter from "./bookings";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(recipesRouter);
router.use(blogsRouter);
router.use(timeslotsRouter);
router.use(bookingsRouter);
router.use(adminRouter);

export default router;
