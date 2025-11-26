const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

//  Build vehicle information by *inventory view?
invCont.buildVehicle = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.buildVehicleByInvId(inv_id)
  const card = await utilities.buildVehicleCard(data)
  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_model
  res.render("./inventory/vehicle", {
    title : vehicleName,
    nav,
    card,
    errors: null,
  })
}

//Returns management view when /inv/ is accessed
invCont.deliverManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title : "Vehicle Management",
    nav,
    errors : null,
  })
}

//Returns add-classification view
invCont.deliverClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title : "Add classification form",
    nav,
    errors : null,
  })
}

//Registers classification
invCont.registerClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const regResult = await invModel.insertClassification(
    classification_name
  )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you have registered ${classification_name}. as a new classification.`
    )
    res.status(201).render("./inventory/add-classification", {
      title: "Add classification form",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add classification form",
      nav,
      errors: null,
    })
  }
}

// Delivers add-inventory view when url accessed
invCont.deliverInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classification = await utilities.getClassifications()
  res.render("./inventory/add-inventory", {
    title : "Add new vehicle",
    nav,
    classification,
    errors : null,
  })
}

//Registers inventory
invCont.registerInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_year, inv_price, inv_miles, inv_color } = req.body
  let classification = await utilities.getClassifications()
  const regResult = await invModel.insertInventory(
    classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_year, inv_price, inv_miles, inv_color
  )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you have registered a new vehicle successfully.`
    )
    res.status(201).render("./inventory/add-inventory", {
      title: "Add vehicle fom",
      nav,
      classification,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add vehicle form",
      nav,
      classification, 
      errors: null,
    })
  }
}

module.exports = invCont