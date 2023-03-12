import axios from "axios";
import { formValidate } from "../formValidator";
import { isValidEmail } from "../../../utils/utils";
// import './otpVerification';


const handleUserRegistration = () => {

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
  // Handling otp verification
  require('./otpVerification')
}

export default handleUserRegistration();