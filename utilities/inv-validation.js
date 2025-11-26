const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

//Sanitize classification registration
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Please provide a valid name."), // on error this message is sent.
  ]
}

//Validate classification registration
validate.checkRegData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add classfication form",
      nav,
      classification_name,
    })
    return
  }
  next()
}

//Sanatize new vehicle registration
validate.vehicleRegistationRules = () => {
  return [
    // Classification id is required
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Error in classification."),

    // Maker is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .isAlpha()
      .withMessage("Please provide a maker"), 

    // Model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .isAlpha()
      .withMessage("Please provide a model"), 

    // Description is required and must be a string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a description"),

    // Image path is required and must be a string
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide an image path"),

    // Thumbnail path is required and must be a string
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a thumbnail path"),

    // Year is required and must be a string
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min : 4 }, { max : 4 })
      .isNumeric()
      .withMessage("Please provide a year"),

    // Price is required and must be a string
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a price"),
    
    // Miles is required and must be a string
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide the miles"),

  // Color is required and must be a string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isAlpha()
      .withMessage("Please provide a year"),
  ]
}

//Validate new vehicle registration
validate.checkVehRegData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_year, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  let classification = await utilities.getClassifications()
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add classfication form",
      nav,
      classification,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image, 
      inv_thumbnail,
      inv_year,
      inv_price,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

module.exports = validate