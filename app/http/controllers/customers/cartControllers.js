import { catchAsync } from "../../../../utils/utils";
import Menu from "../../../models/menuModel";

class CartControllers {
  /**
   * Renders the Cart page with relevant content.
   * @route GET /cart
   * @returns {Object} Rendered view of the Cart page
   */
  cart = catchAsync(async (req, res, next) => {
    return res
      .status(200)
      .render("pages/customers/cart/cart", {
        title: "Cart Items",
        user: {
          isLogin: req.user ? true : false,
          details: req.user
        }
      });
  });

  /**
   * Updates the contents of a user's shopping cart, or creates a new cart if none exists.
   *
   * @route POST /cart
   * @returns {Object} An object representing the updated cart value
   */
  updateCart = catchAsync(async (req, res, next) => {
    // const cart = {
    //   items: [
    //     pizzaId: {
    //       item: pizzaObject, qty: 0
    //     },
    //     totalQty: 0,
    //     totalPrice: 0
    //   ]
    // }

    const data = req.body;
    const session = req.session;

    if (!session.cart) {
      session.cart = {
        items: [],
        totalQty: 0,
        totalPrice: 0,
      };
    }

    // Find Item from database
    const selectedMenuItem = await Menu.findById(data._id);

    const cart = session.cart;
    // check if pizza does not exist
    const existingPizzaIndex = cart.items.findIndex(
      (item) => item._id === data._id
    );

    if (existingPizzaIndex === -1) {
      cart.items.push({
        _id: selectedMenuItem._id,
        name: selectedMenuItem.name,
        price: selectedMenuItem.price,
        size: selectedMenuItem.size,
        image: selectedMenuItem.image,
        qty: 1
      });
      cart.totalPrice += selectedMenuItem.price;
      cart.totalQty += 1;
    } else {
      switch (data.updateType) {
        case 'DECREMENT':
          cart.items[existingPizzaIndex].qty -= 1;
          cart.totalPrice -= selectedMenuItem.price;
          // cart.totalQty -= 1;
          break;

        case "INCREMENT":
          cart.items[existingPizzaIndex].qty += 1;
          cart.totalPrice += selectedMenuItem.price;
          // cart.totalQty += 1;
          break;

        default:
          cart.items[existingPizzaIndex].qty += 1;
          cart.totalPrice += selectedMenuItem.price;
          cart.totalQty += 1;
          break;
      }
    }
    // res.locals.qty = session.cart.totalQty;
    return res.status(201).json({
      // data: session,
      message: "Cart updated successfully",
      totalQty: session.cart.totalQty,
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

export default new CartControllers();
