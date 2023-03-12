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

  // Define a function named 'countdown'
  const countdown = () => {
    // Get the element with ID 'otp-cuntdown' to show left time
    const otpCountDown = document.getElementById('otp-cuntdown');

    // Set the initial time left to 120 seconds
    let timeLeft = 120;

    // Set an interval that updates the countdown every second
    const timerInterval = setInterval(() => {
      // Calculate the minutes and seconds remaining and format them with leading zeros
      const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
      const seconds = (timeLeft % 60).toString().padStart(2, '0');

      // Update the text of the countdown element with the formatted time
      otpCountDown.innerText = `${minutes}:${seconds}`;

      // Decrement the time left by one second
      if (timeLeft-- <= 0) {
        // If the time has run out, clear the interval to stop the countdown
        clearInterval(timerInterval);

        // Show the 'resend-otp' button and disable the submit button
        const resendOtp = document.getElementById('resend-otp');
        resendOtp.classList.remove("hidden");
        otpVerificationForm.querySelector("button[type='submit']").disabled = true;

        // Add a click event listener to the 'resend-otp' button that sends a new OTP and restarts the countdown
        resendOtp.addEventListener("click", e => {
          e.preventDefault();

          axios.get("/api/v1/auth/resend-otp").then(res => {
            if (res.status === 201) {
              // If the OTP was successfully sent, show a success notification, hide the 'resend-otp' button, enable the submit button, and restart the countdown
              ShowNoty().success("OTP successfully send");
              resendOtp.classList.add("hidden");
              otpVerificationForm.querySelector("button[type='submit']").disabled = false;
              countdown();
            }
          }).catch(err => {
            // If there was an error sending the OTP, display an error message and disable the submit button
            addError(document.querySelector(".errorDiv"), err.message);
            otpVerificationForm.querySelector("button[type='submit']").disabled = true;
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
          ShowNoty().success("User Login successfully.")
          setTimeout(() => {
            location.replace("/");
          }, 1000)
        }
      }).catch(err => {
        // console.log(err);
        addError(errorEl, err.response.data.message);
        // ShowNoty().error(err.response.data.message);
      })
    });
  });
