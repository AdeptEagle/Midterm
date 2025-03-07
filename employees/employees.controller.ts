import { Router } from "express";
import { bulkImportEmployees } from "./bulkImportEmployees";
import { deactivateInactiveEmployees } from "./deactivateInactiveEmployees";

const router = Router();

router.post("/bulk", bulkImportEmployees);
router.post("/deactivate-inactive", deactivateInactiveEmployees);

export default router;
