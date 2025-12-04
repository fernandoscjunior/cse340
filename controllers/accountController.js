const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken") 
const Util = require("../utilities/")
require("dotenv").config()

const accountCont = {}

/*****************************************
*  Deliver login view
*****************************************/
accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

// Deliver Register view
accountCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

// Deliver management view
accountCont.deliverManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title : "Account manager",
    nav,
    errors: null
  })
}

// Deliver update view
accountCont.deliverUpdate = async function (req, res, next) {
  let nav = await utilities.getNav()
  const user_id = req.params.id
  const test = await accountModel.getAccountById(user_id)
  res.render("account/edit-account", {
    title : "Account update",
    nav,
    user_id,
    user_firstname : test.account_firstname,
    user_lastname : test.account_lastname,
    user_email : test.account_email,
    user_password : test.account_password,
    errors : null
  })
}

//Delivers cart view
accountCont.deliverCart = async function (req, res, next) {
  let nav = await utilities.getNav()
  const user_id = res.locals.id
  const cart = await accountModel.getCart(user_id)
  const classification_grid = await utilities.buildCart(cart)
  if (classification_grid) {
    res.render("account/cart", {
    title : "Your cart",
    nav,
    errors : null,
    classification_grid
  })
  } else {
    req.flash("notice", "Your cart is empty")
    res.render("account/cart", {
    title : "Your cart",
    nav,
    errors : null,
    classification_grid
  })
  }

}

// Adds vehicle to the cart if user is logged in
accountCont.deliverAddCart = async function (req, res, next) {
  let nav = await utilities.getNav()
  if (res.locals.loggedin) {
    const id = res.locals.id
    const inv_id = req.params.inv_id
    const result = await accountModel.addCart(id, inv_id)
    if (result) {
      req.flash("notice", "The car was added to your cart")
      res.render("account/management", {
      title : "Account Manager",
      nav, 
      errors : null
    })
    } else {
      req.flash("notice", "The insert failed")
    }

  } else {
    req.flash("notice", "You have to login to add cars to the cart")
    res.render("account/login", {
    title : "Login",
    nav, 
    errors : null
  })
  }
}

// Deletes selected car from cart
accountCont.deleteCart = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = req.params.inv_id
  const id = res.locals.id
  const cart = await accountModel.getCart(id)
  const classification_grid = await utilities.buildCart(cart)

  const result = await accountModel.deleteCart(id, inv_id)
  if (result) {
    req.flash("notice", "The vehicle was removed from your cart")
    res.render("account/management", {
    title : "Account Manager",
    nav,
    errors : null,
    classification_grid
  })
  } else {
    req.flash("notice", "An error occured")
    res.render("account/cart", {
    title : "Your cart",
    nav,
    errors : null,
    classification_grid
    })
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

//Process account update
accountCont.accountUpdate = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const updResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
  if (updResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve updated your information`
    )
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      id : account_id,
      account_firstname,
      account_lastname,
      account_email,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/edit-account", {
      title: "Account Update",
      nav,
      errors: null,
    })
  }
}

// Update account password
accountCont.passwordUpdate = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the update.')
    res.status(500).render("account/edit-account", {
      title: "Account Update",
      nav,
      errors: null,
    })
  }

  const updResult = await accountModel.updatePassword(hashedPassword, account_id)

  if (updResult) {
    req.flash(
      "notice",
      `Congratulations, you have altered your password`
    )
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      id : account_id,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/edit-account", {
      title: "Account Update",
      nav,
      errors: null,
    })
  }
}

// Logout process
accountCont.logout = async function(req, res, render) {
  let nav = await utilities.getNav()
  res.clearCookie('jwt');
  res.clearCookie('sessionId');
  res.render("account/logout", {
    title : "You were logged out successfully",
    nav,
    errors: null
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

module.exports = accountCont