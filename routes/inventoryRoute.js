// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const regValidateInv = require('../utilities/inv-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to deliver vehicle information
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildVehicle));

// Route to deliver Vehicle Management view
router.get("/", utilities.handleErrors(invController.deliverManagement));

// Route to deliver Classification form view
router.get("/classification/", utilities.handleErrors(invController.deliverClassification));

// Route to store new classification data
router.post("/classification/", 
    regValidateInv.registationRules(),
    regValidateInv.checkRegData, 
    utilities.handleErrors(invController.registerClassification));

//Route to deliver inventory form view
router.get("/inventory", utilities.handleErrors(invController.deliverInventory));

//Route to register new vehicle in inventory
router.post("/inventory",
    regValidateInv.vehicleRegistationRules(),
    regValidateInv.checkVehRegData,
    utilities.handleErrors(invController.registerInventory)
);

//Route to deliver inventory cars by classification id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Route to deliver edit view based on inventory car id
router.get("/edit/:inventory_id", utilities.handleErrors(invController.getEditView))

//Route to update vehicle
router.post("/update/",
    regValidateInv.vehicleUpdateRules(),
    regValidateInv.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

module.exports = router;