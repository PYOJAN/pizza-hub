import { catchAsync } from "../../../utils/utils";
import User from "../../models/userModel";
import sendMail from "../../services/mailService";
import Otp from "../../services/otpService";

class AuthControllers {
  /**
   * Renders the Login page with relevant content.
   * @route GET /login
   * @returns {Object} Rendered view of the Login page
   */
  login = catchAsync(async (req, res, next) => {
    return res.status(200).render("pages/customers/login", {
      title: "Login",
      layout: "./layouts/full-screen-layout",
    });
  });
  /**
   * Renders the Register page with relevant content.
   * @route GET /login
   * @returns {Object} Rendered view of the Register page
   */
  registerRender = catchAsync(async (req, res, next) => {
    return res.status(200).render("pages/customers/register", {
      title: "Register",
      layout: "./layouts/full-screen-layout",
    });
  });
  /**
   * Renders the Register page with relevant content.
   * @route GET /login
   * @returns {Object} Rendered view of the Register page
   */
  register = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    // Generating OTP
    const hashedOtpData = Otp.genOtp(
      JSON.stringify({ email: newUser.email, id: newUser._id })
    );
    console.log(hashedOtpData.OTP)

    // Sending verification mail to user
    // sendMail({
    //   to: "pintuprajapati4@gmail.com",
    //   subject: "Testing mail",
    //   text: JSON.stringify(newUser),
    // });

    // Refresh Token for resend OTP if it is expired
    const expIn = new Date(Number(new Date()) + 1000 * 60 * 15); // cookies life for the 15 mintus
    const refreshToken = newUser.getJwtToken("15m");
    res.cookie('refreshToken', `RefreshToken ${refreshToken}`, {
      expires: expIn,
      secure: true,
      httpOnly: true,
    });

    // OTP Token
    const otpToken = `${newUser._id}.${hashedOtpData.hash}.${hashedOtpData.exIn}`;
    const expireIn = new Date(Number(new Date()) + hashedOtpData.exIn); // cookies life for the 2 mintus
    res.cookie('otpToken', otpToken, {
      expires: expireIn,
      secure: true,
      httpOnly: true,
    });
    res.status(201).json({
      message: "Register successfully",
      status: "success",
      otp: hashedOtpData.OTP
    });
  });



  verifyOtpRender = catchAsync(async (req, res, next) => {
    return res.status(200).render("pages/customers/otp", {
      title: "OTP verification",
      layout: "./layouts/full-screen-layout",
    });
  });

  /**
   * OTP vetification activating user
   */
  /**
 * Activates a user account and sends a JWT token in response.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Promise that resolves when the response is sent.
 * @throws {Error} - If there was an error activating the user or generating a JWT token.
 */
  verifyOtpAndActiveUser = catchAsync(async (req, res, next) => {
    // Activate the user account
    const user = await User.findByIdAndUpdate(req.user, { isActive: true }, { new: true });

    // Generate a JWT token for the user
    const H = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const expireIn = new Date(Number(new Date()) + H);
    const token = user.getJwtToken();

    // clearing otp token form cookies
    res.clearCookie("otpToken")
    res.clearCookie("refreshToken")

    // Send the token in a secure and httpOnly cookie
    res.cookie('token', `Bearer ${token}`, {
      expires: expireIn,
      secure: true,
      httpOnly: true,
    });

    // Send success response with JWT token
    res.status(201).json({
      status: "success",
      message: "User successfully activated",
      token,
    });
  });


  // Resend Otp 
  resendOtpForUserActive = catchAsync(async (req, res, next) => {

    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) return next(new Error("This user is not registered or has been deleted"))

    // Generating OTP
    const hashedOtpData = Otp.genOtp(
      JSON.stringify({ email: user.email, id: user._id })
    );
    console.log(hashedOtpData.OTP)

    // Sending verification mail to user
    // sendMail({
    //   to: "pintuprajapati4@gmail.com",
    //   subject: "Testing mail",
    //   text: JSON.stringify(newUser),
    // });

    // Refresh Token for resend OTP if it is expired
    const expIn = new Date(Number(new Date()) + 1000 * 60 * 15); // cookies life for the 15 mintus
    const refreshToken = user.getJwtToken("15m");
    res.cookie('refreshToken', `RefreshToken ${refreshToken}`, {
      expires: expIn,
      secure: true,
      httpOnly: true,
    });

    // OTP Token
    const otpToken = `${user._id}.${hashedOtpData.hash}.${hashedOtpData.exIn}`;
    const expireIn = new Date(Number(new Date()) + hashedOtpData.exIn); // cookies life for the 2 mintus
    res.cookie('otpToken', otpToken, {
      expires: expireIn,
      secure: true,
      httpOnly: true,
    });
    res.status(201).json({
      message: "OTP resended successfully",
      status: "success",
      otp: hashedOtpData.OTP
    });
  });



  /**
   * Returns an error message for any method other than GET on the home page route.
   * @route *
   * @returns {Error} Error message for invalid method
   */
  error(req, res, next) {
    return next(new Error("This method is not allowed"));
  }
}

export default new AuthControllers();
