import { Schema, model } from "mongoose";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { isValidEmail } from "../../utils/utils";

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

userSchema.pre("save", async function (next) {
  const encryptedPassword = await hash(this.password, 12);
  this.password = encryptedPassword;

  this.confirmPassword = undefined;
  next();
});

userSchema.methods.getJwtToken = function () {
  const token = sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: 1000 * 5 }
  );

  return token;
};

const User = model("User", userSchema);
export default User;
