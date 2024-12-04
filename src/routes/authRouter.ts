import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail do usuário.
 *           example: "usuario@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário.
 *           example: "SenhaForte123"
 *     UserLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail do usuário.
 *           example: "usuario@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário.
 *           example: "SenhaForte123"
 *     TokenResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token JWT para autenticação.
 *           example: "eyJhbGciOiJIUzI1NiIsInR..."
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *       400:
 *         description: Dados inválidos ou e-mail já registrado.
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login de um usuário.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post("/login", loginUser);

export default router;
