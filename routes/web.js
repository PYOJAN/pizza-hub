import { Router } from "express";
import homeController from "../app/http/controllers/homeControllers";
import authControllers from "../app/http/controllers/authControllers";
import cartControllers from "../app/http/controllers/customers/cartControllers";
import Gaurd from "../app/http/middlewares/authMiddleware";

const router = Router();

/**
 * Handles the home page route.
 * @route GET /
 * @returns {Object} Rendered view of the home page
 * @access Public
 */
router.get("/", homeController.index);

/**
 * Handles the login page route.
 * @route GET /login
 * @returns {Object} Rendered view of the Login page
 * @access Public
 */
router.get("/login", authControllers.login);

/**
 * Handles the Register page route.
 * @route GET /register
 * @returns {Object} Rendered view of the Register page
 * @access Public
 */
router
  .get("/register", authControllers.registerRender);


router.get("/otp-verify", authControllers.verifyOtpRender)

/**
 * Handles the Cart page route.
 * @route GET /Cart
 * @returns {Object} Rendered view of the Cart page
 * @access Public
 */
router.get("/cart", cartControllers.cart);

/**
 * Handles any non-GET request on the login, register, home and cart pages routes with an error message.
 * @route *
 * @returns {Error} Error message for invalid method
 */
router.all(/^\/(login|register|cart)?$/i, authControllers.error);

export default router;
