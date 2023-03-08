import { createHmac, randomInt } from "crypto";
import env from "../../config";

class OtpService {
  #key;
  #ttl;
  #algorithm;

  constructor() {
    this.#algorithm = "sha256";
    this.#key = env.OTP_SECRET;
    this.#ttl = 1000 * 60 * 2; // 2 minutes OTP time to live
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
    
    const exIn = Date.now() + this.#ttl;

    const OTP = randomInt(1000, 9999);
    const dataToBeHash = `${userData}.${OTP}.${exIn}`;

    const hash = createHmac(this.#algorithm, this.#key)
      .update(dataToBeHash)
      .digest("hex");

    return { hash, OTP, exIn };
  }

  /**
   * Verifies the given OTP with the hash and user data.
   *
   * @param {{exIn: number, hash: string}} hashData - The hash data to verify.
   * @param {string} userData - The user data which was used for generating OTP.
   * @param {number} otp - The OTP to verify.
   * @returns {{isValid: boolean, reason: string}} - An object with the properties `isValid` and `reason`.
   * - `isValid`: A boolean indicating whether the OTP is valid or not.
   * - `reason`: A string explaining the reason if the OTP is not valid.
   */
  verifyOtp(hashData, userData, otp) {

    const dataToBeHash = `${userData}.${otp}.${hashData.exIn}`;
    const hash = createHmac(this.#algorithm, this.#key)
      .update(dataToBeHash)
      .digest("hex");
    
    console.log(hash, hashData.hash);

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
