import axios from "axios";
import ShowNoty from "./notyfy";

const TYPE = {
  INCREMENT: "INCREMENT",
  DECREMENT: "DECREMENT"
}

// This function updates the quantity of an item in the cart and sends the update to the server.
const handleQtyUpdate = async (updateQty, elements) => {
  // Destructure the necessary elements from the parameter 'elements'
  const { qty, totalPrice, subTotal, singlePrice } = elements;

  try {
    // Update the quantity based on the 'updateType'
    qty.value = TYPE.DECREMENT === updateQty.updateType ? Number(qty.value) - 1 : Number(qty.value) + 1;

    // Update the total price and sub-total based on the 'updateType'
    totalPrice.innerText = updateTotalPrice(TYPE.DECREMENT === updateQty.updateType, Number(totalPrice.innerText), Number(singlePrice));
    subTotal.innerText = updateTotalPrice(TYPE.DECREMENT === updateQty.updateType, Number(subTotal.innerText), Number(singlePrice));

    // Send the update to the server and display a success message if the update was successful
    const res = await axios.post("/api/v1/auth/update-cart", updateQty);
    if (res.status === 201) {
      ShowNoty().success("Item successfully Added to cart.");
    }
  } catch (error) {
    // If there is an error, revert the quantity, total price, and sub-total to their previous values
    qty.value = TYPE.DECREMENT === updateQty.updateType ? +qty.value - 1 : +qty.value + 1;
    totalPrice.innerText = updateTotalPrice(TYPE.DECREMENT === updateQty.updateType, Number(totalPrice.innerText), Number(singlePrice));
    subTotal.innerText = updateTotalPrice(TYPE.DECREMENT === updateQty.updateType, Number(subTotal.innerText), Number(singlePrice));

    // Log the error to the console for debugging purposes
    console.log(error)
  }
}

// This function updates the total price or sub-total based on the 'updateType'
const updateTotalPrice = (updateTypeIsDecrement, currentValue, singlePrice) => {
  return updateTypeIsDecrement ? currentValue - singlePrice : currentValue + singlePrice;
}



const cartHandle = () => {

  // cart handle form menu page 
  const cartAddBtns = document.querySelectorAll(".cart-add-btn");

  const updateCart = async (selectedItem) => {
    const totalCartQty = document.querySelector(".total-cart-qty");
    try {
      totalCartQty.innerText++;
      const res = await axios.post("/api/v1/auth/update-cart", selectedItem);

      if (res.status === 201) {
        ShowNoty().success("Item successfully Added to cart.");
      }
    } catch (error) {
      totalCartQty.innerText--;
      console.log(error);
      // ShowNoty().error(error.r)
    }
  };

  // Add item to the cart
  cartAddBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const pizza = JSON.parse(btn.dataset.pizza);

      const data = { _id: pizza._id, updateType: TYPE.INCREMENT }
      updateCart(data);
    });
  });


  const cartItems = document.querySelectorAll('.cart-ordered-items');

  cartItems.forEach(cartItem => {
    const qtyDecrementBtn = cartItem.querySelector(".qyt-decrement-btn");
    const qtyIncrementBtn = cartItem.querySelector(".qyt-increment-btn");

    const qty = cartItem.querySelector('input[type="text"]');
    let totalPrice = cartItem.querySelector("#totalPrice");
    let subTotal = document.querySelector("#subtotal");
    const singlePrice = cartItem.querySelector('#singlePrice').innerText;

    // Cart decrement item handling
    qtyDecrementBtn.addEventListener("click", e => {

      const data = { _id: cartItem.dataset.item_id, updateType: TYPE.DECREMENT }
      handleQtyUpdate(data, { qty, totalPrice, subTotal, singlePrice })
    });

    // Cart increment item handling
    qtyIncrementBtn.addEventListener("click", e => {
      const data = { _id: cartItem.dataset.item_id, updateType: TYPE.INCREMENT }
      handleQtyUpdate(data, { qty, totalPrice, subTotal, singlePrice });
    });
  })
};

export default cartHandle();