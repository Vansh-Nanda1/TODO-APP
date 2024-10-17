const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  updateUserDetails,
  updateUserPassword,
  deleteUserProfile,
  fetchAllUsers,
  fetchSingleUser,
  deleteUser,
  updateUserRole,
} = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/multer.middleware");
const router = Router();
//! User Functionality
router.post(
  "/register",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ])
);
router.post("/register", upload.single("profilePicture"), registerUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.patch("/update", authenticate, updateUserDetails);
router.patch("/update-password", authenticate, updateUserPassword);
router.delete("/delete-user", authenticate, deleteUserProfile);

//!  admin functionality
router.get("/all", authenticate, authorize, fetchAllUsers);
router.get("/fetch-one/:id", authenticate, authorize, fetchSingleUser);
router.delete("/delete/:id", authenticate, authorize, deleteUser);
router.patch("/:id", authenticate, authorize, updateUserRole);
module.exports = router;
