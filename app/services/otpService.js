import { createHmac, randomInt } from "crypto";
import env from "../../config";

class OtpService {
  #key;
  #ttl;
  #expireIn;
  #algorithm;

  constructor() {
    this.#algorithm = "sha256";
    this.#key = env.OTP_SECRET;
    this.#ttl = 1000 * 60 * 2; // 2 minutes OTP time to live
    this.#expireIn = Date.now() + this.#ttl;
  }

  /**
   * Generates a one-time password (OTP) for the given user data.
   *
   * @param {string} userData - The user data to generate the OTP for.
   * @returns {{hash: string, OTP: number, exIn: number}} An object containing the hash of the OTP and user data, the OTP itself, and the expiration time of the OTP.
   * @throws {TypeError} If the userData parameter is not a string.
   * @throws {Error} If the userData parameter is  null.
   */
  genOtp(userData) {
    if (typeof userData !== "string" || !userData.trim())
      throw new TypeError(" The userData must be a non-empty string");

    const OTP = randomInt(1000, 9999);
    const dataToBeHash = `${userData}.${OTP}.${this.#expireIn}`;

    const hash = createHmac(this.#algorithm, this.#key)
      .update(dataToBeHash)
      .digest("hex");

    return { hash, OTP, exIn: this.#expireIn };
  }

  /**
   * Verifies the given OTP with the hash and user data.
   *
   * @param {string} hashData - The hashData hash to verify.
   * @param {string} userData - The same user data which use for generating OTP.
   * @param {number} otp - The OTP to verify.
   * @returns {{isValid, reason}} True if the OTP is valid, false otherwise and reason.
   * @throws {TypeError} If the hashData parameter is not an object, the userData parameter is not a string, or the otp parameter is not a number.
   */
  verifyOtp(hashData, userData, otp) {
    if (!otp) throw new Error("otp must have value");

    if (typeof hashData !== "string" || !hashData.trim())
      throw new TypeError("The hashData must have a non-empty string");

    if (typeof userData !== "string" || !userData.trim())
      throw new TypeError("The userData must have a non-empty string");

    if (typeof otp !== "number") throw new TypeError("OTP must be a number");

    const currentTimestamp = Date.now();

    if (currentTimestamp > hashData.exIn) {
      // OTP has expired
      return { isValid: false, reason: "OTP has expired" };
    }

    const dataToBeHash = `${userData}.${otp}.${hashData.exIn}`;
    const hash = createHmac(this.#algorithm, this.#key)
      .update(dataToBeHash)
      .digest("hex");

    if (hash !== hashData.hash) {
      // OTP is valid
      return { isValid: false, reason: "Invalid OTP" };
    }

    // OTP is not valid
    return { isValid: true, reason: "" };
  }
}

const Otp = new OtpService();

export default Otp;
