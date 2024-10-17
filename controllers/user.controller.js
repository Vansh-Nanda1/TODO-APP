const asyncHandler = require("express-async-handler");
const USER_SCHEMA = require("../models/user.model");
const { ErrorHandler } = require("../utils/Errorhandler");
const { generateToken } = require("../utils/jwt");
const { uploadOnCloudinary } = require("../utils/cloudinary");

//! User Functionality


//! ================================ register User ===============================================================================
exports.registerUser = asyncHandler(async (req, res, next) => {
  let { name, email, password, role } = req.body;


  const profilePicture = req?.files?.profilePicture?.[0] || req?.file || null; 
  const signatureFile = req?.files?.signature?.[0] || req?.file || null;
  if (profilePicture) {
    uploadProfilePictureurl = (await uploadOnCloudinary(profilePicture.path))?.url;
  }
  if (signatureFile) {
    uploadsignatureUrl = (await uploadOnCloudinary(signatureFile.path))?.url;
  }

  let existingUser = await USER_SCHEMA.findOne({ email });
  if (existingUser) {
    return next(
      new ErrorHandler("User already exists please use another email", 409)
    );
  }
  let newUser = await USER_SCHEMA.create({
    name,
    email,
    password,
    role,
    profilePicture : uploadProfilePictureurl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    signature : uploadsignatureUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  });
  res.status(200).json({
    message: "user register successfully",
    sucess: true,
    data: newUser,
  });
});

//! ================================ login user ==================================================================================

exports.loginUser = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;
  let existingUser = await USER_SCHEMA.findOne({ email });
  if (!existingUser) {
    return next(new ErrorHandler("User with provided email not Found!", 409));
  }

  let isMatch = await existingUser.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("password did't match"));
  }

  const token = generateToken(existingUser._id);
  console.log(token);

  res.cookie("cookie", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  console.log("just check");
  res.status(200).json({
    message: "user login successfully",
    sucess: true,
  });
});

//! ================================ logout user =======================================================================================
exports.logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("cookie", "", {
    maxAge: Date.now(),
  });
  res.status(200).json({
    sucess: true,
    message: "user logout successfully",
  });
});


//! ================================ update user profile ================================================================================
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  let id = req.foundUser._id;
  let { name, email, password } = req.body;
  let existingUser = await USER_SCHEMA.findOne({ _id: id });
  if (!existingUser) {
    return next(new ErrorHandler("User not Found!", 409));
  }
  console.log("just check ");
  existingUser.name = name;
  existingUser.email = email;
  existingUser.password = password;
  await existingUser.save();
  res.status(200).json({
    sucess: true,
    message: "user updated successfully",
    data: existingUser,
  });
});
//! ================================ update user Password ===================================================================================
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  let id = req.foundUser._id;
  let findUser = await USER_SCHEMA.findOne({ _id: id });
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
    data : findUser
  });
});


//! ============================================================= delete user  ==================================================================
exports.deleteUserProfile = asyncHandler(async (req,res,next) => {
    let id = req.foundUser._id;
    let { name, email, password } = req.body;
    let existingUser = await USER_SCHEMA.findOne({ _id: id });
    if (!existingUser) {
      return next(new ErrorHandler("User not Found!", 409));
    }
    let deleteuser = await USER_SCHEMA.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      message: "user deleted successfully",
      data: deleteuser,
    });
})

//! ==================================================   admin functionality   ==================================================================

//! ===================================================== Fetch All users =======================================================================

exports.fetchAllUsers = asyncHandler(async (req,res,next) => {
    let allusers = await USER_SCHEMA.find()
    if(allusers.length === 0){
        return next(new ErrorHandler("no user found",404))
    }
    res
    .status(200)
    .json({ success: true, message: "all users fetched Successfully", users: allusers});
})


//! ===================================================== Fetch Single user =======================================================================

exports.fetchSingleUser = asyncHandler(async (req,res,next) => {
    let id = req.params.id;
    let user = await USER_SCHEMA.findOne({ _id: id });
    if (!user) {
      return next(new ErrorHandler("user not Found", 401));
    }
    res.status(200).json({
      sucess: true,
      message: "user details fetched Successfully",
      data: user,
    });
})



//! =========================================================== deleteSingleUser =====================================================================

exports.deleteUser = async (req, res) => {
    let id = req.params.id;
    let user = await USER_SCHEMA.findOne({ _id: id });
    if (!user) {
      return next(new ErrorHandler("user not Found", 401));
    }
  
   let deleted =  await USER_SCHEMA.findByIdAndDelete({ _id: id });
    res.status(200).json({
      sucess: false,
      message: "user deleted successfully",
      deleleduser : deleted
    });
  };




//! =============================================== update Role =======================================================================================
exports.updateUserRole  = asyncHandler(async (req,res,next) => {
  let id = req.params.id
  let {role} = req.body
  let findUser = await USER_SCHEMA.findOne({_id :id})
  if(!findUser){
    return next(new ErrorHandler("user not Found", 401));
  }
  if(!role){
    return next(new ErrorHandler("please provide the role",401))
  }
  findUser.role = role
  await findUser.save();
  res.status(200).json({
    sucess : true,
    message : "role updated successfully",
    data : findUser
  })
})