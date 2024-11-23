var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
    return res.json("Express Js");
});

module.exports = router;
