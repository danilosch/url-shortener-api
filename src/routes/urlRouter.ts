import { Router } from "express";
import { getOriginalUrl, shortenUrl } from "../controllers/urlController";

const router = Router();

router.post("/shorten", shortenUrl);
router.get("/:alias", getOriginalUrl);

export default router;
