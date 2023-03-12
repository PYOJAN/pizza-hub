import { Router } from "express";
import authControllers from "../app/http/controllers/authControllers";
import cartControllers from "../app/http/controllers/customers/cartControllers";
import Gaurd from "../app/http/middlewares/authMiddleware";



const router = Router();


/**
 * Handles the "update cart" route, which updates the contents of a user's shopping cart.
 *
 * @route POST /api/v1/auth/update-cart
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} An object representing the updated cart.
 * @access Public - this route can be accessed by anyone, including unauthenticated users.
 */
router.post("/update-cart", cartControllers.updateCart);


/**
 * 
 * Registers a new user and returns cookies with token.
 *
 * @route POST /api/v1/auth/verify-otp
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} An object with user information and cookies with token.
 * @throws {Error} If there was an error while registering the user.
 * @access Public - this route can be accessed by anyone, including unauthenticated users.
 */
router.post("/register", [Gaurd.checkBody], authControllers.register);


/**
 * 
 * Verifing activation OTP Token and OTP.
 *
 * @route POST /api/v1/auth/verify-otp
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} An object with message to user successfull active and cookies with login token.
 * @throws {Error} If there was an error while registering the user.
 * @access SEMI protected - this route only can be accessed by authoried pepole how have OTP token.
 */
router.post("/verify-otp", [Gaurd.checkOtpTokenAndOtpBody], authControllers.verifyOtpAndActiveUser);



/**
 * Resends OTP if it has expired
 * Access with refresh token
 * 
 * @route GET /api/v1/auth/resend-otp
 * @param {object} req - The request object
 * @param {string} req.cookies - The authorization header containing the refresh token
 * @param {object} res - The response object
 * @param {function} next - The next function to be called
 */
router.get("/resend-otp", [Gaurd.checkResendOtpRefreshToken], authControllers.resendOtpForUserActive);


/**
 * Logs in the user and issues a JWT token that is valid for 24 hours
 * 
 * @route POST /api/v1/auth/login
 * @param {object} req - The request object
 * @param {object} req.body - The body of the request
 * @param {string} req.body.email - The email of the user
 * @param {string} req.body.password - The password of the user
 * @param {object} res - The response object
 * @param {function} next - The next function to be called
 */
router.post("/login", authControllers.login);



/**
 * Logs out the currently authenticated user and invalidates the JWT token issued.
 * @route GET /api/v1/auth/logout
 * @group Authentication - Operations for user authentication
 * @returns {object} HTTP response indicating the success or failure of the operation
 * @throws {UnauthorizedError} If the user is not authenticated
 */
router.get("/logout", authControllers.logout)


/**
 * Handles any non-GET request on the login, register, home and cart pages routes with an error message.
 * @route *
 * @returns {Error} Error message for invalid method
 */
router.all(/^\/(login|register|update-cart|update-cart|verify-otp|resend-otp|logout)?$/i, authControllers.error);



export default router;