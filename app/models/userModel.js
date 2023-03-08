import { Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { isValidEmail } from "../../utils/utils";
import env from "../../config";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name must have a value"],
      trim: true,
      minlength: 4,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email must have a value"],
      unique: true,
      validate: {
        validator: isValidEmail,
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password must have a value"],
      maxlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      trim: true,
      required: [true, "Confirm password must have a value"],
      validate: {
        validator: function (v) {
          return v === this.password;
        },
        message: "Passwords do not match",
      },
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


/**
 * Middleware to hash the user password before saving to the database.
 * @param {Function} next - The next function to be called in the middleware chain.
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified
  if (!this.isModified('password')) return next();

  // Hash the password with bcryptjs
  const encryptedPassword = await hash(this.password, 12);
  this.password = encryptedPassword;

  // Remove confirmPassword field from the document
  this.confirmPassword = undefined;
  next();
});

/**
 * Generates a JWT token for the user.
 * @param {string} expIn - The token expiration time in seconds.
 * @returns {string} The JWT token.
 */
userSchema.methods.getJwtToken = function (expIn) {
  const ttl = expIn || "24h";
  const options = {
    expiresIn: ttl, // use the provided expiration time or default to 24h
  }

  const payload = {
    id: this._id,
    email: this.email,
    name: this.name
  }

  const token = sign(payload, env.JWT_SECRET, options);
  const H = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const expireIn = new Date(Number(new Date()) + H);
  return { token, expireIn: expIn || expireIn };
};


userSchema.methods.validatePassword = async function (password, encryPass) {
  // Use bcrypt to compare the plain text password with the hashed password
  const isMatch = await compare(password, encryPass);
  return isMatch;
};

const User = model("User", userSchema);
export default User;
