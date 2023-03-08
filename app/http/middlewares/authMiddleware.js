import { verify } from "jsonwebtoken";
import env from "../../../config";
import { catchAsync } from "../../../utils/utils";
import User from "../../models/userModel";
import Otp from "../../services/otpService";

class GaurdClass {
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
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The next function to be called in the middleware chain.
 */
  checkOtpTokenAndOtpBody = catchAsync(async (req, res, next) => {
    // Get OTP token from cookie and OTP value from request body
    const { otpToken } = req.cookies;
    const { otp } = req.body;

    console.log(otpToken);

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

    next();
  })


  /**
   * resend otp
   */
  checkResendOtpRefreshToken = catchAsync(async (req, res, next) => {

    const { refreshToken } = req.cookies;
    if (!refreshToken) return next(Error("unauthorized attempt"));

    const [_, token] = refreshToken.split(" ");

    const user =  verify(token, env.JWT_SECRET);

    req.user = user;

    next();
  })
}


const Gaurd = new GaurdClass();

export default Gaurd;
