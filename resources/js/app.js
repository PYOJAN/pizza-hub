import axios from "axios";
import ShowNoty from "./notyfy";
import { formValidate } from "./formValidator";
import { addError } from "./utils";
import { isValidEmail } from "../../utils/utils";

const cartAddBtns = document.querySelectorAll(".cart-add-btn");

const updateCart = async (pizza) => {
  const totalCartQty = document.querySelector(".total-cart-qty");
  console.log(pizza);
  try {
    totalCartQty.innerText++;
    const res = await axios.post("/api/v1/auth/update-cart", pizza);

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

    formValidate(registerForm, fields, (formData, errorEl) => {
      axios
        .post("/api/v1/auth/register", formData)
        .then((res) => {
          if (res.status === 201) {
            location.replace('/otp-verify')
          }
        })
        .catch((err) => {
          const errData = err.response.data;
          addError(errorEl, errData.message);
        });
    });
  });



const otpVerificationForm = document.getElementById('otpVerification');
if (otpVerificationForm) {
  otpVerificationForm.addEventListener("submit", e => {
    e.preventDefault();
    const fields = [
      {
        name: "otp",
        error: "Please enter a 4-digit numeric code",
        validate: (value) => /^\d{4}$/.test(value),
      }
    ]

    formValidate(otpVerificationForm, fields, (formData, errorEl) => {
      axios
        .post("/api/v1/auth/verify-otp", formData)
        .then((res) => {
          if (res.status === 201) {
            location.replace('/')
          }
        })
        .catch((err) => {
          const errData = err.response.data;
          addError(errorEl, errData.message);
        });
    })
  })

  const countdown = () => {
    const otpCountDown = document.getElementById('otp-cuntdown');
    let timeLeft = 120;
    const timerInterval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
      const seconds = (timeLeft % 60).toString().padStart(2, '0');
      otpCountDown.innerText =
        `${minutes}:${seconds}`;
      if (timeLeft-- <= 0) {
        clearInterval(timerInterval);

        const resendOtp = document.getElementById('resend-otp');
        resendOtp.classList.remove("hidden");

        resendOtp.addEventListener("click", e => {
          e.preventDefault();

          console.log("resend OTP")

          axios.get("/api/v1/auth/resend-otp").then(res => {
            console.log(res);
          }).catch(err => {
            alert(err.message)
          })
        })
      }
    }, 1000);
  }
  countdown();
}


const userAvatar = document.querySelector('.user-avatar');
userAvatar && userAvatar.addEventListener("click", e => {
  document.getElementById('userDropdown').classList.toggle('hidden');
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

    formValidate(loginForm, fields, (data, errorEl) => {
      axios.post("/api/v1/auth/login", data).then(res => {
        if (res.status === 200) {
          location.replace("/");
        }
      }).catch(err => {
        console.log(err);
      })
    });
  });
