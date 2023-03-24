/**
 * 
 * Finds the cart item with the specified itemId from the items array.
 * @param {Array<Object>} items - An array of cart items.
 * @param {string} itemId - The ID of the item to find.
 * @returns {Object} - The cart item with the specified ID, or undefined if not found.
*/
const findCartItem = (items, itemId) => items.find((item) => item._id === itemId);


/**
 * 
 * Adds a new item to the cart.
 * @param {Object} cart - The cart object.
 * @param {Object} selectedMenuItem - The menu item to add to the cart.
 * @returns {void}
*/
const addNewItemToCart = (cart, selectedMenuItem) => {

  const itemIndex = cart.items.findIndex(item => item._id === selectedMenuItem._id.toString());
  // If item is not in cart
  if (itemIndex === -1) {
    cart.items.push({
      _id: selectedMenuItem._id,
      name: selectedMenuItem.name,
      price: selectedMenuItem.price,
      size: selectedMenuItem.size,
      image: selectedMenuItem.image,
      qty: 1,
    });
    cart.totalPrice += selectedMenuItem.price;
    cart.totalQty += 1;
  } else {
    // if item is already in cart
    cart.items[itemIndex].qty += 1;
    cart.totalPrice += selectedMenuItem.price;
    cart.totalPrice += 1;
  }

};


/**
 *Increments the quantity of an existing cart item.
 *@param {Object} existingItem - The existing cart item to increment.
 *@param {Object} cart - The cart object.
 *@param {Object} selectedMenuItem - The menu item associated with the existing cart item.
 *@returns {void}
*/
const incrementCartItem = (existingItem, cart, selectedMenuItem) => {
  existingItem.qty += 1;
  cart.totalPrice += selectedMenuItem.price;
  // cart.totalQty += 1;
};

/**
 * Decrements the quantity of an existing cart item, and updates the cart total price and quantity.
 * @param {Object} existingItem - The cart item object to be decremented.
 * @param {Object} cart - The cart object containing the existing items and total price and quantity.
 * @param {Object} selectedMenuItem - The menu item object selected by the user.
 * @return {void}
*/
const decrementCartItem = (existingItem, cart, selectedMenuItem) => {
  if (existingItem.qty > 1) {
    existingItem.qty -= 1;
    cart.totalPrice -= selectedMenuItem.price;
    // cart.totalQty -= 1;
  } else {
    cart.items = cart.items.filter((item) => item._id !== existingItem._id);
    // cart.totalQty -= 1;
    cart.totalPrice -= selectedMenuItem.price;
  }
};


/**
 * 
 *Removes an item from the cart and updates the cart's total quantity and price.
 *@param {Object} itemToRemove - The item to remove from the cart.
 *@param {Object} cart - The cart object to update.
 *@returns {void}
*/
const removeCartItem = (itemToRemove, cart) => {
  // Find the index of the item to remove
  const indexToRemove = cart.items.findIndex((item) => item._id === itemToRemove._id);

  // If the item is not found, return the original cart
  if (indexToRemove === -1) return cart;

  // Get the quantity and price of the item to remove
  const { qty, price } = cart.items[indexToRemove];

  // Remove the item from the cart
  cart.items.splice(indexToRemove, 1);

  // Decrement the total quantity and update the total price
  cart.totalQty -= 1;
  cart.totalPrice -= price * qty;

  console.log(cart);

  // Return the updated cart
  // return cart;
}


export {
  findCartItem,
  addNewItemToCart,
  incrementCartItem,
  decrementCartItem,
  removeCartItem
}
