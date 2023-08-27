## Habit Tracker

- This Application is used to Review the employees in the Company.
- NodeJs, expressJs, mongoDB and ejs technologies are used in creation of this application.

### Usage:

-

### Folder Structure

```

Habit-Tracker
    |
    |
    |--->assets---->|--->css
    |
    |
    |               |--->middleware.js
    |--->config---->|--->mongoose.js
    |               |--->passport-local-strategy.js
    |
    |
    |--->controllers-->|-->home_controller.js
    |                  |-->user_controller.js
    |
    |
    |               |-->company.js
    |--->models---->|-->review.js
    |               |-->user.js
    |
    |
    |
    |--->routes---->|-->index.js
    |               |-->userRouter.js
    |
    |
    |
    |              |---> header.ejs
    |              |---> add_company.ejs
    |--->views---->|--->add_employee.ejs
    |              |--->adminView.ejs
    |              |--->employee_review.ejs
    |              |--->home.ejs
    |              |--->layout.ejs
    |              |--->profile.ejs
    |              |--->sign_in.ejs
    |              |--->sign_up.ejs
    |
    |-->.env
    |-->node_modules
    |-->.gitignore
    |--> index.js
    |--> package-lock.json
    |-->package.json

```

### How to setup the project on local system

- Clone this project into the system.
- Run the command **npm i** or **npm install** for installing all the required dependencies.
- Install the mongodb in the system if not already available.
- Now Run the command **npm start**.
- Open the browser and navigate to **http://localhost:8000/** to start the application.
