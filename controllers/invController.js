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

module.exports = invCont