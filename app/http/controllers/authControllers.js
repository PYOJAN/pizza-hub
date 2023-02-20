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

    // Sending verification mail to user
    // sendMail({
    //   to: "pintuprajapati4@gmail.com",
    //   subject: "Testing mail",
    //   text: JSON.stringify(newUser),
    // });
    res.json({
      message: "Register successfully",
      otpInfo: hashedOtpData,
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
