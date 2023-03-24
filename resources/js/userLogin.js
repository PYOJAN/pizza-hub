import axios from "axios";
import { isValidEmail } from "../../utils/utils";
import { formValidate } from "./formValidator";
import ShowNoty from "./notyfy";
import { addError } from "./utils";

const userLogin = () => {
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
          console.log(err);
          addError(errorEl, err.response.data.message);
          // ShowNoty().error(err.response.data.message);
        })
      });
    });


  // User profile dropdown
  const userAvatar = document.querySelector('.user-avatar');
  userAvatar && userAvatar.addEventListener("click", e => {
    document.getElementById('userDropdown').classList.toggle('hidden');
  });
}


export default userLogin();