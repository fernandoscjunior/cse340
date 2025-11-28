const invModel = require("../models/inventory-model") //Connecting to model(database)
const Util = {} //creates an Util object/array
const jwt = require("jsonwebtoken")
require("dotenv").config()

const USDollar = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

// Get classifications and returns it as am <option> tag
Util.getClassifications = async function(req, res, next) {
  let data = await invModel.getClassifications()
  let option = ""
  data.rows.forEach((row) => {
    option += "<option value=\""
    option += row.classification_id
    option += '\">'
    option += row.classification_name
    option += "</option>"
  })
  return option
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
      grid += '<hr />'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

//  Build the vehicle view
Util.buildVehicleCard = async function(data){
  let card
  if(data.length > 0){
    card = '<div class="vehicle">'
      data.forEach(vehicle => {
      card += '<div>'
        card += '<h2>' + vehicle.inv_make + '</h2>'
        card += '<img src="' + vehicle.inv_image + '" alt="An image of the ' + vehicle.inv_model + ' car">'
      card += '</div>'
      card += '<div class="info">'
        card += '<p>' + vehicle.inv_description + '</p>'
        card += '<p> Year: ' + vehicle.inv_year + '</p>'
        card += '<p> Price: ' + USDollar.format(vehicle.inv_price) + '</p>'
        card += '<p> Miles: ' + vehicle.inv_miles + '</p>'
        card += '<p> Color: ' + vehicle.inv_color + '</p>'
      card += '</div>'
      })
    card += '</div>'
  } else {
    card += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return card
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util