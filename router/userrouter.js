const { Router } = require("express");
const {
  loginUser,
  logoutUser,
  UpadteUserDetails,
  UpadteUserPassword,
  deleteUserProfile,
  fetchAllUsers,
  FetchSingleUser,
  deleteUser,
  UpdateUserRole,
  registerUser,
  updateProfilePicture,
  removeProfilePicture,
  forgotpassword,
  UpadteUserDetailswithPassword,
} = require("../controllers/usercontroller");
const { authorize, authenticate } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/multer.middleware");
const router = Router();

//?  ====================================== user Router ================================================================
router.post(
  "/add",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  registerUser
);
// router.post("/add",upload.single("profilePicture"),registerUser)
router.post("/add",registerUser)
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.patch("/update", authenticate, UpadteUserDetails);
router.put("/forgot-password",authenticate,forgotpassword)
router.patch("/update-password", authenticate, UpadteUserPassword);
router.patch("/update-userdetails", authenticate, UpadteUserDetailswithPassword);
router.delete("/delete", authenticate, deleteUserProfile);
router.patch("/update-profile-picture",authenticate,upload.single("profilePicture"),updateProfilePicture);
router.patch("/remove-profile-picture",authenticate,removeProfilePicture)


//? =================================== admin router  ============================================================
router.get("/all", authenticate, authorize, fetchAllUsers);
router.get("/one/:id", authenticate, authorize, FetchSingleUser);
router.delete("/:id", authenticate, authorize, deleteUser);
router.patch("/:id", authenticate, authorize, UpdateUserRole);
module.exports = router;
