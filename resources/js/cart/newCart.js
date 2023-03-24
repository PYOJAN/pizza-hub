import axios from "axios";
import ShowNoty from "../notyfy";
import { cartItemTempleteHtml } from "./cartItem-templet";
import { cartEmpty } from "./empty-cart";

const TYPE = {
  INCREMENT: "INCREMENT",
  DECREMENT: "DECREMENT",
  REMOVE: "REMOVE"
}
const MESSAGE_TYPE = {
  SUCCESS: "SUCCESS",
  FAIL: "FAIL",
  INCREMENT: "INCREMENT",
  DECREAMENT: "DECREAMENT"
}

/**
 * Updates the cart values based on the given type of update and item details.
 *
 * @param {string} typeOfUpdate - The type of update, either "INCREMENT" or "DECREMENT".
 * @param {object} itemDetails - The details of the item being updated.
 * @param {number} itemDetails.itemQty - The quantity of the item being updated.
 * @param {number} itemDetails.itemsSubTotalAmount - The subtotal amount of the item being updated.
 * @param {number} itemDetails.itemsGrandTotalAmount - The grand total amount of the item being updated.
 */
const updateCartQuantities = (data = {}) => {
  let subTotalAmount = document.querySelector("#subtotal");
  let grandTotalAmount = document.querySelector("#grand-total");
  return new Promise((resolve, reject) => {

    axios({
      url: "/api/v1/auth/update-cart",
      method: "POST",
      data: data
    }).then(res => {
      resolve(res);
      if (res.status !== 201) return resolve(res)
      if (!TYPE[data?.updateType]) return;


      const { items, totalPrice, grandTotal } = res.data.data;

      if (items.length > 0) {
        let itemWarapper = document.querySelector('#cart-item-wrapper');
        itemWarapper.innerHTML = "";
        for (let i = 0; i < items.length; i++) {
          console.log(items[i])
          itemWarapper.innerHTML += cartItemTempleteHtml(items[i]);
        }
        subTotalAmount.innerText = totalPrice;
        grandTotalAmount.innerText = grandTotal;
      } else {
        document.querySelector(".cart").innerHTML = cartEmpty();
      }

      cartService();

    }).catch(err => {
      console.log(err.message)
      reject(err)
    })
  });
}



/**
 * Handles the cart item increment, decrement, and related actions.
 *
 * @param {Element} cartItem - The cart item element.
 */
const handleCartItemsActions = (cartItem, allItems) => {
  const itemQtyIncrementBtn = cartItem.querySelector(".qyt-increment-btn");
  const itemQtyDecrementBtn = cartItem.querySelector(".qyt-decrement-btn");
  const removeCartItem = cartItem.querySelector(".remove-cart-item");

  const increment = async () => {
    const data = { _id: cartItem.dataset.item_id, updateType: TYPE.INCREMENT }
    const res = await updateCartQuantities(data);

    if (res.status !== 201) return ShowNoty().error('Some this happen wrong, check console');
    ShowNoty().success(`${TYPE.INCREMENT} done`)

  };


  const decrement = async () => {
    const data = { _id: cartItem.dataset.item_id, updateType: TYPE.DECREMENT };
    const res = await updateCartQuantities(data)
    if (res.status !== 201) return ShowNoty().error('Some this happen wrong, check console');
    ShowNoty().success(`${TYPE.DECREMENT} done`)
  };

  const removeItem = async () => {
    const data = { _id: cartItem.dataset.item_id, updateType: TYPE.REMOVE }
    const res = await updateCartQuantities(data)

    if (res.status !== 201) return ShowNoty().error('Some this happen wrong, check console');
    ShowNoty().success(`${TYPE.REMOVE} done`)
  }

  itemQtyIncrementBtn.addEventListener("click", increment)
  itemQtyDecrementBtn.addEventListener("click", decrement);
  removeCartItem.addEventListener("click", removeItem)
}


const cartService = () => {
  const allAddedCartItems = document.querySelectorAll('.cart-ordered-items');

  allAddedCartItems.forEach(orderedItem => {
    handleCartItemsActions(orderedItem, allAddedCartItems)
  });


  // Home page pizza menu item to add cart
  const addToCartBtn = document.querySelectorAll(".cart-add-btn");
  addToCartBtn.forEach(item => {
    item.addEventListener('click', async (e) => {
      const itemData = JSON.parse(e.target.dataset.pizza);

      const res = await updateCartQuantities(itemData);

      // If Error happen
      if (res?.code) return;

      ShowNoty().success("Item successfully added to the cart");

      let totalNumberOfCartItems = document.querySelector(".total-cart-qty");
      totalNumberOfCartItems.innerText = res.data.data.totalQty;

    })
  })

}



export default cartService();