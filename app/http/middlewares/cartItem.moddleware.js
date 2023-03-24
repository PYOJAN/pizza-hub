const addEmptyCartIfNotThere = (req, res, next) => {
  const session = req.session;

  if (!session.cart) {
    session.cart = {
      items: [],
      totalQty: 0,
      totalPrice: 0,
    };
  }

  next();
}

export default addEmptyCartIfNotThere;