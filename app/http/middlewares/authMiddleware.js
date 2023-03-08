import { verify } from "jsonwebtoken";
import env from "../../../config";
import { catchAsync } from "../../../utils/utils";
import User from "../../models/userModel";
import Otp from "../../services/otpService";

class GaurdClass {
  /**
   * Middleware function that checks if the required fields exist in the request body.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function to call in the middleware chain.
   * @returns {void} - Returns nothing if all required fields exist. Otherwise, an error response is sent.
   */
  checkBody(req, res, next) {
    const { name, email, password, confirmPassword } = req.body;

    if (!name) return next(new Error("[name] value is require"));
    if (!email) return next(new Error("[email] value is require"));
    if (!password) return next(new Error("[password] value is require"));
    if (!confirmPassword)
      return next(new Error("[confirmPassword] value is require"));

    next();
  }

  /**
   * Middleware to check the validity of the OTP token and body.
   * @param {Object} req - The Express Request object.
   * @param {Object} res - The Express Response object.
   * @param {Function} next - The next function to be called in the middleware chain.
   * @returns {void} - Calls next middleware function if OTP token and body are valid. Otherwise, sends an error response.
   */
  checkOtpTokenAndOtpBody = catchAsync(async (req, res, next) => {
    // Get OTP token from cookie and OTP value from request body
    const { otpToken } = req.cookies;
    const { otp } = req.body;

    // Check if OTP token and OTP value are present
    if (!otpToken || !otp) return next(new Error('Unauthorized attempt'));

    // Split OTP token into its constituent parts
    const [userID, hash, exIn] = otpToken.split('.') || [];

    // Check if OTP token is expired
    const currentTimestamp = Date.now();
    if (currentTimestamp > exIn) return next(new Error('OTP is expired'));

    // Get user associated with the OTP token
    const user = await User.findById(userID);
    if (!user) return next(new Error('This user is not registered or has been deleted.'));

    // Verify OTP value
    const tokenData = {
      hash,
      exIn,
    };
    const { isValid, reason } = Otp.verifyOtp(
      tokenData,
      JSON.stringify({ email: user.email, id: user._id }),
      otp
    );
    if (!isValid) return next(new Error(reason));

    // Set user ID on request object
    req.user = user._id;

    // Call next middleware function
    next();
  });



  /**
   * Middleware function that checks if a user is authenticated with OTP.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function to call in the middleware chain.
   * @returns {void} - Redirects to home page if user is not authenticated. Otherwise, calls next middleware function.
   */
  otpPageProtect(req, res, next) {
    const { otpToken, refreshToken } = req.cookies;

    if (!otpToken && !refreshToken) {
      // If user is not authenticated, redirect to home page
      return res.redirect("/");
    }

    // If user is authenticated, call next middleware function
    next();
  }



  /**
   * Middleware to check if the user has a refresh token and retrieve the user ID from the token.
   * @param {Object} req - The Express Request object.
   * @param {Object} res - The Express Response object.
   * @param {Function} next - The next function to be called in the middleware chain.
   * @returns {void} - Calls next middleware function if user has a valid refresh token. Otherwise, sends an error response.
   */
  checkResendOtpRefreshToken = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.cookies;

    // Check if refresh token is present
    if (!refreshToken) return next(new Error('Unauthorized attempt'));

    const [_, token] = refreshToken.split(' ');

    // Verify refresh token and get user ID
    const user = verify(token, env.JWT_SECRET);
    req.user = user;

    // Call next middleware function
    next();
  });



  /**
   * Check if user is logged in or not and render user details if they are logged in.
   * @function
   * @async
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @param {Function} next - The next middleware function.
   * @returns {Function} The next middleware function.
   */

  isUserLoggedin = catchAsync(async (req, res, next) => {

    const { token } = req.cookies;

    // if user is not loging
    if (!token) return next();

    const authToken = token.split(" ")[1];

    const isValid = verify(authToken, env.JWT_SECRET);

    req.user = isValid;

    next();

  });

  /**
 * Validates the request body for a valid email address and a minimum password length of 8
 * @param {object} req - The request object
 * @param {object} req.body - The body of the request
 * @param {string} req.body.email - The email address to validate
 * @param {string} req.body.password - The password to validate
 * @param {object} res - The response object
 * @param {function} next - The next function to be called
 */
  hashValidBody = (req, res, next) => {
    const { email, password } = req.body;

    // Check if the email is a valid email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return next(new Error('Please provide a valid email addres'));
    }

    // Check if the password has a minimum length of 8 characters
    if (!password || password.length < 8) {
      return next(new Error("Please provide minimum 8 character password"))
    }

    next();
  }

}


const Gaurd = new GaurdClass();

export default Gaurd;
