const User = require("../models/user");
const Company = require("../models/company");
const Review = require("../models/review");

module.exports.createEmployee = async function (req, res) {
  try {
    let checkUser = await User.findOne({ emaildId: req.body.emailId });
    if (checkUser) {
      req.flash("error", "Email Id already exists.");
      return res.redirect("back");
    }
    let company = await Company.findOne({ name: req.body.companyName });
    if (!company) {
      req.flash(
        "error",
        `Cannot find the company with the name ${req.body.companyName}`
      );
      return res.redirect("back");
    }
    let employee = await User.create({
      name: req.body.name,
      emailId: req.body.emailId,
      password: req.body.password,
      type: "employee",
      company: company.id,
    });

    await Company.findByIdAndUpdate(company._id, {
      $push: { employees: employee.id },
    });
    req.flash("success", "Employee Created Successfully");
    return res.redirect("/signin");
  } catch (err) {
    req.flash("error", "Error in creating Employee");
    console.log("Error in creating employee ", err);
    return res.redirect("back");
  }
};

module.exports.createSession = function (req, res) {
  req.flash("success", "logged in successfully");
  return res.redirect("/");
};

module.exports.profilePage = async function (req, res) {
  if (req.isAuthenticated()) {
    let user = await User.find({ _id: req.params.id })
      .populate("company")
      .populate("reviewPending");
    return res.render("profile", {
      profile_user: user,
      title: "Profile",
    });
  }
  return res.redirect("back");
};

module.exports.adminPage = async function (req, res) {
  if (req.user.type === "employee") {
    return res.redirect("back");
  }
  let companyId = req.user.company;
  let companyInfo = await Company.findById(companyId).populate("employees");
  let employees = companyInfo.employees;

  employees = employees.filter((employee) => {
    return req.user.level < employee.level;
  });

  return res.render("adminView", {
    employees: employees,
    title: "Admin View",
  });
};

module.exports.makeAdmin = async function (req, res) {
  try {
    let employeeId = req.params.employeeId;
    let user = req.user;

    let employee = await User.findById(employeeId);

    if (user.type !== "admin" || user.level >= employee.level) {
      return res.redirect("back");
    }

    await User.findByIdAndUpdate(employeeId, {
      type: "admin",
      level: user.level + 1,
    });
    req.flash("success", "Promoted To Admin");
    return res.redirect("back");
  } catch (err) {
    req.flash("error", "error in updating to admin");
    console.log("Error in updating to admin ", err);
    return res.redirect("back");
  }
};
module.exports.makeEmployee = async function (req, res) {
  try {
    let employeeId = req.params.employeeId;
    let user = req.user;

    let employee = await User.findById(employeeId);

    if (user.type !== "admin" || user.level >= employee.level) {
      return res.redirect("back");
    }

    await User.findByIdAndUpdate(employeeId, {
      type: "employee",
      level: Number.MAX_VALUE,
    });
    req.flash("success", "Updated from Admin to Employee");
    return res.redirect("back");
  } catch (err) {
    req.flash("error", "Error in updating to Employee");
    console.log("Error in updating to admin ", err);
    return res.redirect("back");
  }
};

module.exports.removeEmployee = async function (req, res) {
  try {
    let employeeId = req.params.employeeId;
    let user = req.user;
    let employee = await User.findById(employeeId);

    if (user.type !== "admin" && user.level >= employee.level) {
      return res.redirect("back");
    }

    await User.findByIdAndDelete(employeeId);
    req.flash("success", "Employee Removed");
    return res.redirect("back");
  } catch (err) {
    req.flash("error", "Error in removing Employee");
    console.log("Error in removing employee ", err);
    return res.redirect("back");
  }
};

module.exports.addEmployeePage = function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user.type === "admin") {
      return res.render("add_employee", {
        title: "Add Employee",
      });
    }
  }
  return res.redirect("/signin");
};

module.exports.addEmployee = async function (req, res) {
  try {
    if (req.user.type !== "admin") {
      return res.redirect("back");
    }
    let companyId = req.user.company;
    let employee = await User.create({
      name: req.body.name,
      emailId: req.body.emailId,
      password: req.body.password,
      type: "employee",
      company: companyId,
    });

    await Company.findByIdAndUpdate(companyId, {
      $push: { employees: employee.id },
    });
    req.flash("success", "Employee Created Successfully");
    return res.redirect("/user/adminpage");
  } catch (err) {
    req.flash("error", "Error in creating employee");
    console.log("Error in creating employee ", err);
    return res.redirect("back");
  }
};

module.exports.employeeReviewPage = async function (req, res) {
  let employeeId = req.params.employeeId;
  let employee = await User.findById(employeeId)
    .populate({ path: "company", populate: { path: "employees" } })
    .populate({
      path: "reviewReceived",
      populate: { path: "reviewedBy", select: "name" },
    });

  if (req.isAuthenticated()) {
    if (req.user.type === "admin") {
      if (req.user.level >= employee.level) {
        return res.redirect("back");
      }
      let employees = employee.company.employees.filter((emp) => {
        if (emp.emailId !== employee.emailId && req.user.level < emp.level) {
          return true;
        }
        return false;
      });
      return res.render("employee_review", {
        employee,
        employees,
        title: "Employee View",
      });
    }
  }
  return res.redirect("/signin");
};

module.exports.setReviewer = async function (req, res) {
  try {
    let receiverId = req.params.receiverId;
    let reviewerId = req.params.reviewerId;

    let receiver = await User.findById(receiverId);
    let reviewer = await User.findById(reviewerId);

    await User.findByIdAndUpdate(reviewerId, {
      $push: { reviewPending: receiverId },
    });
    return res.redirect("back");
  } catch (err) {
    console.log("Unable to set reviewer ", err);
    return res.redirect("back");
  }
};

module.exports.removeReviewer = async function (req, res) {
  try {
    let receiverId = req.params.receiverId;
    let reviewerId = req.params.reviewerId;

    let receiver = await User.findById(receiverId);
    let reviewer = await User.findById(reviewerId);

    await User.findByIdAndUpdate(reviewerId, {
      $pull: { reviewPending: receiverId },
    });
    return res.redirect("back");
  } catch (err) {
    console.log("Error in removing reviewer ", err);
    return res.redirect("back");
  }
};

module.exports.submitReview = async function (req, res) {
  try {
    let receiverId = req.params.receiverId;

    let receiver = await User.findById(receiverId);

    let review = await Review.create({
      description: req.body.description,
      reviewedBy: req.user._id,
      reviewedFor: receiverId,
    });

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { reviewPending: receiverId },
    });

    await User.findByIdAndUpdate(receiverId, {
      $push: { reviewReceived: review.id },
    });
    req.flash("success", "Feedback Submitted");
    return res.redirect("back");
  } catch (err) {
    req.flash("error", "Error in submitting feedback");
    console.log("Error in submitting review ", err);
    return res.redirect("back");
  }
};
