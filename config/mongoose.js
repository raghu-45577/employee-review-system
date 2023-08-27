const mongoose = require("mongoose");
//connecting to local mogodb server
mongoose.connect(
  "mongodb+srv://vraghu45577:olgMTyGaGL4C5vKs@employee-review-system.08rjvqm.mongodb.net/employee-review-system?retryWrites=true&w=majority"
);

const dbConnection = mongoose.connection;
//if any issue in connecting to database
dbConnection.on(
  "error",
  console.error.bind(console, "Issue in connecting the database")
);
//if the database connection is successful
dbConnection.once("open", function () {
  console.log("Database connected successfully");
});
