import { catchAsync } from "../../../utils/utils";
import Menu from "../../models/menuModel";

class HomeController {
  /**
   * Renders the home page with relevant content.
   * @route GET /
   * @returns {Object} Rendered view of the home page
   */
  index = catchAsync(async (req, res, next) => {

    const menuItems = await Menu.find();
    return res
      .status(200)
      .render("pages/customers/home", {
        title: "Real time Pizza App",
        menus: menuItems,
        user: {
          isLogin: req.user ? true : false,
          details: req.user
        }
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

export default new HomeController();
