import { catchAsync } from "../../../../utils/utils";
import Menu from "../../../models/menuModel";
import {
  findCartItem,
  addNewItemToCart,
  incrementCartItem,
  decrementCartItem,
  removeCartItem
} from '../../../services/cartService'

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
    const data = req.body;
    const session = req.session;
    console.log("body", data)

    if (!session.cart) {
      session.cart = {
        items: [],
        totalQty: 0,
        totalPrice: 0,
      };
    }
    // Find Item from database
    const selectedMenuItem = await Menu.findById(data._id);
    console.log("selectedMenuItem", selectedMenuItem)

    const cart = session.cart;

    if (!selectedMenuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    const existingItem = findCartItem(cart.items, data._id);

    switch (data.updateType) {
      case "DECREMENT":
        if (existingItem) {
          decrementCartItem(existingItem, cart, selectedMenuItem);
        }
        break;
      case "INCREMENT":
        if (existingItem) {
          incrementCartItem(existingItem, cart, selectedMenuItem);
        }
        break;
      case "REMOVE":
        if (existingItem) {
          removeCartItem(existingItem, cart);
        }
        break;
      default:
        addNewItemToCart(cart, selectedMenuItem);
        break;
    }


    let grandTotal = 0;
    const tax = 200;
    session.cart.items.forEach(item => {
      grandTotal += (item.price * item.qty);
    });

    // return res.status(201).json({
    //   message: "Cart updated successfully",
    //   updatedData: {
    //     ...session.cart.items.find((item) => item._id === data._id),
    //     totalPrice: session.cart.totalPrice,
    //     totalQty: session.cart.totalQty,
    //     grandTotal: grandTotal + tax
    //   },
    // });

    return res.status(201).json({
      message: "Cart updated successfully",
      data: {
        items: session.cart.items,
        totalPrice: session.cart.totalPrice,
        totalQty: session.cart.totalQty,
        grandTotal: grandTotal + tax
      },
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
