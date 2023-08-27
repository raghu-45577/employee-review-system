const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");

router.get("/", homeController.homePage);
router.get("/add-company", homeController.addCompanyPage);
router.get("/signin", homeController.signInPage);
router.get("/signup", homeController.signUpPage);
router.get("/logout", homeController.destroySession);
router.post("/save-company", homeController.createCompany);
router.use("/user", require("./userRouter"));

module.exports = router;
