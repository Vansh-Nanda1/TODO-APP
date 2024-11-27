const uSerSchema = require("../models/usermodels");
const asyncHandler = require("express-async-handler");
const { ErrorHandler } = require("../utils/Errorhandler");
const { generateToken } = require("../utils/jwt");
const {
  uploadOnCloudinary,
  deleteProfilePicture,
} = require("../utils/cloudinary");

//? User Functionality
//! ================================ register user ===============================================================================

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { email, name, password, role } = req.body;
  const profilePicture = req?.files?.profilePicture?.[0] || req?.file;
  const signatureFile = req?.files?.signature?.[0] || req?.file;
  const uploadProfilePicture = await uploadOnCloudinary(profilePicture?.path);
  const uploadSignature = await uploadOnCloudinary(signatureFile?.path);
  let existingUser = await uSerSchema.findOne({ email });
  if (existingUser) {
    return next(
      new ErrorHandler("User already exists please use another email", 409)
    );
  }

  let newUser = await uSerSchema.create({
    name,
    email,
    password,
    role,
    profilePicture:
      uploadProfilePicture?.url ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    signature:
      uploadSignature?.url ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  });
  res
    .status(201)
    .json({
      sucess: true,
      message: "User Created Sucessfully with image and signature",
      data: newUser,
    });
});

//! ================================ login user ===========================================================

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser = await uSerSchema.findOne({ email });
  if (!existingUser) {
    return next(new ErrorHandler("User not found", 404));
  }
  let isPasswordMatched = await existingUser.matchPassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Password", 409));
  }

  let token = generateToken(existingUser._id);

  res.cookie("cookie", token, {
    httpOnly: true, //? http=only network mai cokkie ko update nhi krne dega
    maxAge: 24 * 60 * 60 * 1000,
  });
  res
    .status(201)
    .json({ sucess: true, message: "user login successfully", token: token });
});
//! ================================ logout user ============================================================

exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("cookie", "", {
    maxAge: Date.now(),
  });
  res.status(200).json({
    success: true,
    message: "user logged out Successfully",
  });
});

//! ================================ update user profile ===================================================

exports.UpadteUserDetails = asyncHandler(async (req, res) => {
  let id = req.foundUser._id;
  let { name, email } = req.body;
  let updateUser = await uSerSchema.updateOne(
    { _id: id },
    { $set: { name, email } }
  );
  res.status(200).json({
    sucess: true,
    message: "user updated successfully",
    data: updateUser,
  });
});
//! ================================ forgot user password ==================================================

exports.forgotpassword = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;
  let findUser = await uSerSchema.findOne({ email });
  if (!findUser) {
    return next(new ErrorHandler("email is not valid", 401));
  }
  findUser.password = password;
  await findUser.save();
  res.status(200).json({
    sucess: true,
    message: "Password Changed Sucessfully",
  });
});

//! ================================ update user password ===================================================

exports.UpadteUserPassword = asyncHandler(async (req, res, next) => {
  let id = req.foundUser._id;
  let findUser = await uSerSchema.findOne({ _id: id });
  let { newPassword, oldPassword } = req.body;

  if (!newPassword || !oldPassword) {
    return next(
      new ErrorHandler("please enter new password and old password", 401)
    );
  }

  let isPasswordMatched = await findUser.matchPassword(oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is incorrect", 401));
  }

  findUser.password = newPassword;
  await findUser.save();

  res.status(200).json({
    success: true,
    message: "user password updated successfully",
  });
});

//! =============================== updateuserDetailswithPassword  ===================================================================

exports.UpadteUserDetailswithPassword = asyncHandler(async (req, res, next) => {
  let id = req.foundUser._id;
  let { name, email, password } = req.body;
  let findUser = await uSerSchema.findOne({ _id: id });
  if (!findUser) {
    return next(new ErrorHandler("no user found", 401));
  }
  if (!password) {
    return next(new ErrorHandler("please enter password", 401));
  }
  findUser.password = password;
  findUser.name = name;
  findUser.email = email;
  await findUser.save();
  res
    .status(200)
    .json({
      sucess: true,
      message: "user updated successfully",
      data: findUser,
    });
});

//! ============================================ deleteUserProfile =====================================================================

exports.deleteUserProfile = async (req, res, next) => {
  let id = req.foundUser._id;
  let findUser = await uSerSchema.findOne({ _id: id });
  if (!findUser) {
    return next(new ErrorHandler("user not found", 400));
  }
  let deleteuser = await uSerSchema.findByIdAndDelete({ _id: id });
  res.status(200).json({
    success: true,
    message: "user deleted successfully",
    data: deleteuser,
  });
};

//!=================================================== update user profile picture ==========================================

exports.updateProfilePicture = asyncHandler(async (req, res, next) => {
  let id = req.foundUser._id;
  let findUser = await uSerSchema.findOne({ _id: id });
  if (!findUser) {
    return next(new ErrorHandler("user not found", 401));
  }
  if (findUser.profilePicture && findUser.profilePicture.includes("http")) {
    let publicID = findUser.profilePicture.split("/").pop().split(".")[0];
    await deleteProfilePicture(publicID);
  }
  let newProfilePicturePath = req?.file?.path;
  let uploadPath = await uploadOnCloudinary(newProfilePicturePath);
  findUser.profilePicture = uploadPath?.url;
  await findUser.save();
  res.status(200).json({
    success: true,
    message: "profile picture updated successfully",
    data: findUser,
  });
});

//! =================================================== remove user profile picture ==========================================

exports.removeProfilePicture = asyncHandler(async (req, res, next) => {
  let id = req.foundUser._id;
  let findUser = await uSerSchema.findOne({ _id: id });
  if (!findUser) {
    return next(new ErrorHandler("user not found", 401));
  }
  if (findUser.profilePicture) {
    let publicID = findUser.profilePicture.split("/").pop().split(".")[0];
    await deleteProfilePicture(publicID);
  }
  findUser.profilePicture =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  await findUser.save();
  res.status(200).json({
    success: true,
    message: "profile picture removed successfully",
    data: findUser,
  });
});

//? ==================================================admin functionality ==============================================================

//! =========================== FetchAllUsers ====================================

exports.fetchAllUsers = async (req, res, next) => {
  let users = await uSerSchema.find();
  if (users.length === 0) {
    return next(new ErrorHandler("no user found", 404));
  }
  res
    .status(200)
    .json({ success: true, message: "all users fetched", users: users });
};

//! ========================= FetchSingleUser ======================================================

exports.FetchSingleUser = async (req, res, next) => {
  let id = req.params.id;
  let user = await uSerSchema.findOne({ _id: id });
  if (!user) {
    return next(new ErrorHandler("user not Found", 401));
  }
  res.status(200).json({
    sucess: true,
    message: "user details fetched Successfully",
    data: user,
  });
};

//! ================================= deleteSingleUser ============================================================

exports.deleteUser = async (req, res) => {
  let id = req.params.id;
  let user = await uSerSchema.findOne({ _id: id });
  if (!user) {
    return next(new ErrorHandler("user not Found", 401));
  }
  await uSerSchema.deleteOne({ _id: id });
  res.status(200).json({
    sucess: false,
    message: "user deleted successfully",
  });
};

//! ======================================  update user role =================================================================

exports.UpdateUserRole = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let { role } = req.body;

  let findUser = await uSerSchema.findOne({ _id: id });
  if (!findUser) {
    return next(new ErrorHandler("user not Found", 401));
  }
  if (!role) {
    return next(new Errorhandler("please provide the role", 401));
  }
  findUser.role = role;
  await findUser.save();
  res
    .status(200)
    .json({
      sucess: true,
      message: "user role updated successfully",
      data: findUser,
    });
});
