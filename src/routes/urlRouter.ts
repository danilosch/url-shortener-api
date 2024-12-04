import { Router } from "express";
import {
  createUrl,
  deleteUrl,
  getOriginalUrl,
  listUrls,
  updateUrl,
} from "../controllers/urlController";
import {
  authenticateToken,
  optionalAuthenticateToken,
} from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Url:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: URL original a ser encurtada.
 *           example: "https://example.com"
 *     UrlUpdate:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: Novo endereço da URL.
 *           example: "https://newexample.com"
 *     UrlResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         original_url:
 *           type: string
 *         alias:
 *           type: string
 *         clicks:
 *           type: integer
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 *   /urls:
 *     post:
 *       summary: Cria um URL encurtado.
 *       tags: [URLs]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Url'
 *       responses:
 *         201:
 *           description: URL encurtada criada com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   shortURL:
 *                     type: string
 *                     example: "http://localhost:3000/abc123"
 *         400:
 *           description: Dados inválidos.
 *         409:
 *           description: Não foi possível gerar um alias único.
 */
router.post("/urls", optionalAuthenticateToken, createUrl);

/**
 * @swagger
 *   /urls:
 *     get:
 *       summary: Lista todas as URLs encurtadas do usuário autenticado.
 *       tags: [URLs]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Lista de URLs encurtadas.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/UrlResponse'
 *         401:
 *           description: Usuário não autenticado.
 */
router.get("/urls", authenticateToken, listUrls);

/**
 * @swagger
 *   /urls/{id}:
 *     patch:
 *       summary: Atualiza o endereço de uma URL encurtada.
 *       tags: [URLs]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             type: integer
 *           description: ID da URL a ser atualizada.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UrlUpdate'
 *       responses:
 *         200:
 *           description: URL atualizada com sucesso.
 *         400:
 *           description: Dados inválidos.
 *         404:
 *           description: URL não encontrada ou inacessível.
 */
router.patch("/urls/:id", authenticateToken, updateUrl);

/**
 * @swagger
 *   /urls/{id}:
 *     delete:
 *       summary: Exclui logicamente uma URL encurtada.
 *       tags: [URLs]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             type: integer
 *           description: ID da URL a ser excluída.
 *       responses:
 *         200:
 *           description: URL excluída com sucesso.
 *         404:
 *           description: URL não encontrada ou inacessível.
 */
router.delete("/urls/:id", authenticateToken, deleteUrl);

/**
 * @swagger
 *   /{alias}:
 *     get:
 *       summary: Redireciona para a URL original com base no alias.
 *       tags: [URLs]
 *       parameters:
 *         - name: alias
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *           description: Alias da URL encurtada.
 *       responses:
 *         302:
 *           description: Redireciona para a URL original.
 *         404:
 *           description: URL não encontrada.
 */
router.get("/:alias", getOriginalUrl);

export default router;
