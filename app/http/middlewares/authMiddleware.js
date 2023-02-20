class GaurdClass {
  checkBody(req, res, next) {
    const { name, email, password, confirmPassword } = req.body;

    if (!name) return next(new Error("[name] value is require"));
    if (!email) return next(new Error("[email] value is require"));
    if (!password) return next(new Error("[password] value is require"));
    if (!confirmPassword)
      return next(new Error("[confirmPassword] value is require"));

    next();
  }
}

const Gaurd = new GaurdClass();

export default Gaurd;
