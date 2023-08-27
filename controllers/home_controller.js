const Company = require("../models/company");
const User = require("../models/user");

module.exports.homePage = function (req, res) {
  if (req.user) {
    return res.redirect("/user/profile/" + req.user.id);
  }
  return res.render("home", {
    title: "Home",
  });
};

module.exports.signInPage = async function (req, res) {
  let companies = await Company.find({});
  if (companies.length > 0) {
    if (req.isAuthenticated()) {
      return res.redirect("/user/profile/" + req.user.id);
    }
    return res.render("sign_in", {
      title: "Sign In",
    });
  }
  return res.redirect("back");
};

module.exports.signUpPage = async function (req, res) {
  let companies = await Company.find({});
  if (companies.length > 0) {
    if (req.isAuthenticated()) {
      return res.redirect("/user/profile/" + req.user.id);
    }
    return res.render("sign_up", {
      companies: companies,
      title: "Sign Up",
    });
  }
  return res.redirect("back");
};

module.exports.addCompanyPage = function (req, res) {
  return res.render("add_company", {
    title: "Add Company",
  });
};

module.exports.createCompany = async function (req, res) {
  try {
    let checkCompany = await Company.findOne({ name: req.body.companyName });
    if (checkCompany) {
      req.flash(
        "error",
        `Company with ${req.body.companyName} name already exists. Try with another name`
      );
      return res.redirect("back");
    }
    if (req.body.password !== req.body.confirmPassword) {
      req.flash("error", "Password and Confirm Password does not match");
      return res.redirect("back");
    }
    let checkUser = await User.findOne({ emailId: req.body.emailId });
    if (checkUser) {
      req.flash(
        "error",
        "Email Id is already taken, try with different email id"
      );
      return res.redirect("back");
    }
    let company = await Company.create({
      name: req.body.companyName,
    });

    let user = await User.create({
      name: req.body.name,
      emailId: req.body.emailId,
      password: req.body.password,
      level: 1,
      type: "admin",
      company: company.id,
    });

    await Company.findByIdAndUpdate(company._id, {
      $push: { employees: user.id },
    });
    req.flash("success", "Company created successfully");

    return res.redirect("/signin");
  } catch (err) {
    req.flash("error", "Error in creating company or admin user");
    return res.redirect("back");
  }
};

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
      return;
    }
    req.flash("success", "logged out successfully");
    return res.redirect("/");
  });
};
