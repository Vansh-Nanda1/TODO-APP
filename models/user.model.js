const { Schema, model } = require("mongoose");
const brcypt = require("bcrypt");
const USER_SCHEMA = new Schema(
  {
    profilePicture: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    signature:{
      type : String
    },
    name: {
      type: String,
      required: [true, "Name is Required"],
      trim: true,
      minlength: 6,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      trim: true,
      minlength: 6,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password Is Required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);
USER_SCHEMA.pre("save", async function (next) {
  if (!this.isModified("password")) {
     next();
  }
  //  "If the password has not been modified, there is no need to hash it again."
  let salt = await brcypt.genSalt(10);
  let hashedPassword = await brcypt.hash(this.password, salt);
  this.password = hashedPassword;
});

USER_SCHEMA.methods.matchPassword = async function (enterPassword) {
  return await brcypt.compare(enterPassword, this.password);
};
module.exports = model("User", USER_SCHEMA);
