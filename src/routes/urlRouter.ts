import { Router } from "express";
import { getOriginalUrl, shortenUrl } from "../controllers/urlController";

const router = Router();

router.post("/shorten", shortenUrl);
router.get("/:shortId", getOriginalUrl);

export default router;
