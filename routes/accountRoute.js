// Needed resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Returns log in view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Returns register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Returns account management view
router.get("/", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(accountController.deliverManagement))
//Logs out and returns logout view
router.get("/logout/", utilities.handleErrors(accountController.logout))

//Returns the update account info view
router.get("/update/:id", utilities.handleErrors(accountController.deliverUpdate))

// Updates user info (no password)
router.post("/update/info/",
    regValidate.updateRules(),
    regValidate.checkUpdData,
    utilities.handleErrors(accountController.accountUpdate)
)

// Updates user password
router.post("/update/password/", 
    regValidate.passwordUpdateRules(),
    regValidate.checkPasData,
    utilities.handleErrors(accountController.passwordUpdate)
)

/// Registers user
router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount))
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;