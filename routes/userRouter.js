const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user_controller");

router.post("/create", userController.createEmployee);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/signin" }),
  userController.createSession
);
router.get(
  "/profile/:id",
  passport.checkAuthentication,
  userController.profilePage
);
router.get(
  "/adminpage",
  passport.checkAuthentication,
  userController.adminPage
);

router.post("/:employeeId/makeadmin", userController.makeAdmin);
router.post("/:employeeId/makeemployee", userController.makeEmployee);
router.post("/:employeeId/remove", userController.removeEmployee);
router.get("/addEmployeePage", userController.addEmployeePage);
router.post("/add", userController.addEmployee);
router.get("/:employeeId", userController.employeeReviewPage);
router.post("/:receiverId/setReviewer/:reviewerId", userController.setReviewer);
router.post(
  "/:receiverId/removeReviewer/:reviewerId",
  userController.removeReviewer
);

router.post("/:receiverId/savefeedback", userController.submitReview);

module.exports = router;
