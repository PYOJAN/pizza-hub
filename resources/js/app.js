import axios from "axios";
import ShowNoty from "./notyfy";
import { registerNewUser } from "./registerUser";
import { addError } from "./utils";
import { isValidEmail } from "../../utils/utils";

const cartAddBtns = document.querySelectorAll(".cart-add-btn");

const updateCart = async (pizza) => {
  const totalCartQty = document.querySelector(".total-cart-qty");
  try {
    totalCartQty.innerText++;
    const res = await axios.post("/update-cart", pizza);

    if (res.status === 201) {
      ShowNoty().success("Item successfully Added to cart.");
    }
  } catch (error) {
    totalCartQty.innerText--;
    console.log(error);
  }
};

// Add item to the cart
cartAddBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const pizza = JSON.parse(btn.dataset.pizza);

    updateCart(pizza);
  });
});

// Rigister new user
const registerForm = document.querySelector("#registerForm");
registerForm &&
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = [
      {
        name: "name",
        error: "Name is required",
        validate: (value) => value !== "",
      },
      {
        name: "email",
        error: "Email is not valid",
        validate: (value) => isValidEmail(value),
      },
      {
        name: "password",
        error: "Password must be at least 8 characters",
        validate: (value) => value.length >= 8,
      },
      {
        name: "confirmPassword",
        error: "Passwords do not match",
        validate: (value) => value === registerForm.password.value,
      },
    ];

    registerNewUser(registerForm, fields, (formData, errorEl) => {
      axios
        .post("/register", formData)
        .then((data) => {
          console.log(data.data);
        })
        .catch((err) => {
          const errData = err.response.data;
          addError(errorEl, errData.message);
        });
    });
  });

// Login user
const loginForm = document.querySelector("#login");
loginForm &&
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = [
      {
        name: "email",
        error: "Email is not valid",
        validate: (value) => isValidEmail(value),
      },
      {
        name: "password",
        error: "Password must be at least 8 characters",
        validate: (value) => value.length >= 8,
      },
    ];

    registerNewUser(loginForm, fields, (data) => {
      console.log(data);
    });
  });
