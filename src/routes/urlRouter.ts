import { Router } from "express";
import {
  createUrl,
  deleteUrl,
  getOriginalUrl,
  listUrls,
  updateUrl
} from "../controllers/urlController";
import {
  authenticateToken,
  optionalAuthenticateToken,
} from "../middlewares/authMiddleware";

const router = Router();

router.post("/urls", optionalAuthenticateToken, createUrl);

router.get("/urls", authenticateToken, listUrls);
router.patch("/urls/:id", authenticateToken, updateUrl);
router.delete("/urls/:id", authenticateToken, deleteUrl);

router.get("/:alias", getOriginalUrl);

export default router;
