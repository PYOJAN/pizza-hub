import { Router } from "express";
import authControllers from "../app/http/controllers/authControllers";
import cartControllers from "../app/http/controllers/customers/cartControllers";
import Gaurd from "../app/http/middlewares/authMiddleware";



const router = Router();


/**
 * Handles the "update cart" route, which updates the contents of a user's shopping cart.
 *
 * @route POST /update-cart
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
 * @route POST /register
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
 * @route POST /verify-otp
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} An object with message to user successfull active and cookies with login token.
 * @throws {Error} If there was an error while registering the user.
 * @access SEMI protected - this route only can be accessed by authoried pepole how have OTP token.
 */
router.post("/verify-otp", [Gaurd.checkOtpTokenAndOtpBody], authControllers.verifyOtpAndActiveUser)




/**
 * Handles any non-GET request on the login, register, home and cart pages routes with an error message.
 * @route *
 * @returns {Error} Error message for invalid method
 */
router.all(/^\/(login|register|update-cart)?$/i, authControllers.error);



export default router;