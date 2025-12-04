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
    inv_id,
  })
}

//Returns management view when /inv/ is accessed
invCont.deliverManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classification = await utilities.getClassifications()
  res.render("./inventory/management", {
    title : "Vehicle Management",
    nav,
    classification,
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

//Updates inventory
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id  
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classification = await utilities.getClassifications()
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classification,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

//Return inventory by classification as JSON
invCont.getInventoryJSON = async (req, res, next) => {
  const classificationId = parseInt(req.params.classification_id)
  const inv_data = await invModel.getInventoryByClassificationId(classificationId)
  if (inv_data[0].inv_id) {
    return res.json(inv_data)
  } else {
    next(newError("No data returned"))
  }
}

//Return edit inventory view
invCont.getEditView = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.buildVehicleByInvId(inventory_id)
  let classification = await utilities.getClassifications()
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classification,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

// Returns view to confirm if delete is wanted
invCont.getDeleteView = async function(req, res, next) {
  const inventory_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.buildVehicleByInvId(inventory_id)
  let classification = await utilities.getClassifications()
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    classification,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
}

//Deletes inventory
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id, inv_model, inv_make } = req.body
  const deleteResult = await invModel.deleteInventory(inv_id)
  if (deleteResult) {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classification = await utilities.getClassifications()
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    classification,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}


module.exports = invCont