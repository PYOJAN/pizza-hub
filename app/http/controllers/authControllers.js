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
  loginRender = catchAsync(async (req, res, next) => {
    return res.status(200).render("pages/customers/login", {
      title: "Login",
      layout: "./layouts/full-screen-layout",
    });
  });

  /**
   * Logs in a user with the provided email and password
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next function to be called
   */
  login = catchAsync(async (req, res, next) => {

    // Destructure the email and password from the request body
    const { email, password } = req.body;

    //  Find the user with the provided email address and select the password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new Error("This user is not registered yet!"));

    // Validate the password provided against the hashed password stored in the database
    const isValidPass = await user.validatePassword(password, user.password);

    if (!isValidPass) return next(new Error("Invalid credentials"));


    //  * Get the JSON Web Token (JWT) and expiration time for the user
    //  * @property {string} token - The JWT for the user
    //  * @property {Date} expireIn - The date when the JWT will expire
    const { token, expireIn } = user.getJwtToken();

    // Send the token in a secure and httpOnly cookie
    res.cookie("token", `Bearer ${token}`, {
      expires: expireIn,
      secure: true,
      httpOnly: true,
    });

    res.status(200).json({ status: "success", message: "User logged in" });
  });


  /**
   * Renders the Register page with relevant content.
   * @route GET /register
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
   * @route GET /register
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

    // Refresh Token for resend OTP if it is expired
    const expIn = new Date(Number(new Date()) + 1000 * 60 * 15); // cookies life for the 15 mintus
    const { token, _ } = newUser.getJwtToken("15m");
    res.cookie('refreshToken', `RefreshToken ${token}`, {
      expires: expIn,
      secure: true,
      httpOnly: true,
    });
    // OTP Token
    const otpToken = `${newUser._id}.${hashedOtpData.hash}.${hashedOtpData.exIn}`;
    const ttl = new Date(Number(hashedOtpData.exIn)); // cookies life for the 2 mintus
    res.cookie('otpToken', otpToken, {
      expires: ttl,
      secure: true,
      httpOnly: true,
    });

    // Sending verification mail to user
    sendMail({
      to: newUser.email,
      subject: "Testing mail",
      OTP: {
        otp: hashedOtpData.OTP,
        validFor: "2 Mint"
      }
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
    // const H = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    // const expireIn = new Date(Number(new Date()) + H);
    const { token, expireIn } = user.getJwtToken();

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

    // Refresh Token for resend OTP if it is expired
    const expIn = new Date(Number(new Date()) + 1000 * 60 * 15); // cookies life for the 15 mintus
    const { token, expireIn } = user.getJwtToken("15m");
    res.cookie('refreshToken', `RefreshToken ${token}`, {
      expires: expIn,
      secure: true,
      httpOnly: true,
    });

    // OTP Token
    const otpToken = `${user._id}.${hashedOtpData.hash}.${hashedOtpData.exIn}`;
    const ttl = new Date(Number(new Date()) + hashedOtpData.exIn); // cookies life for the 2 mintus
    res.cookie('otpToken', otpToken, {
      expires: ttl,
      secure: true,
      httpOnly: true,
    });

    // Sending verification mail to user
    // sendMail({
    //   to: user.email,
    //   subject: "Testing mail",
    //   OTP: 
    // });

    res.status(201).json({
      message: "OTP resended successfully",
      status: "success",
      otp: hashedOtpData.OTP
    });
  });

  /**
    * Logout the user by clearing the authentication token cookie and redirecting to the home page.
    *
    * @function
    * @async
    * @param {object} req - The Express request object.
    * @param {object} res - The Express response object.
    * @param {function} next - The Express next middleware function.
    * @returns {void}
    */
  logout = catchAsync(async (req, res, next) => {
    // Clear the authentication token cookie
    res.clearCookie("token");
    // Redirect to the home page
    res.status(301).redirect('/');
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
