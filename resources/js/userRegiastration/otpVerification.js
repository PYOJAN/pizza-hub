import axios from "axios";
import { formValidate } from "../formValidator";

const otpVerificationHandl = () => {
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
        otpCountDown.innerText = `${minutes}:${seconds}`;
        if (timeLeft-- <= 0) {
          clearInterval(timerInterval);
          const resendOtp = document.getElementById('resend-otp');
          resendOtp.classList.remove("hidden");
          otpVerificationForm.querySelector("button[type='submit']").disabled = true;

          resendOtp.addEventListener("click", e => {
            e.preventDefault();
            axios.get("/api/v1/auth/resend-otp").then(res => {
              if (res.status === 201) {
                ShowNoty().success("OTP successfully send");
                resendOtp.classList.add("hidden");
                otpVerificationForm.querySelector("button[type='submit']").disabled = false;
                countdown();
              }
            }).catch(err => {
              addError(document.querySelector(".errorDiv"), err.message);
              otpVerificationForm.querySelector("button[type='submit']").disabled = true;
            })
          })
        }
      }, 1000);
    }

    // Start the countdown
    countdown();
  }

}

export default otpVerificationHandl();