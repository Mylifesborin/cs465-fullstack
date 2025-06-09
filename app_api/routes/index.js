const express = require("express");
const router = express.Router();

const tripsController = require("../controllers/trips");

// define route for our trips endpoint
router.route("/trips").get(tripsController.tripsList); //GET Method routes tripList

router.route('/trips/:tripCode').get(tripsController.tripsFindByCode);

module.exports = router;