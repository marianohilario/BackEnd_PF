import { Router } from "express";
import MockingController from "../controllers/mockingController.js";
import { rollAdminVerify } from "../middleware/rollVerify.js";

const router = Router()
const mockingController = new MockingController

router.get('/', rollAdminVerify, mockingController.getMocks)

export default router