var express = require("express");
var router = express.Router();
const Currency = require('../models/currency.model');

let Freecurrency;
let freecurrencyapi;


(async () => {
    Freecurrency = (await import('@everapi/freecurrencyapi-js')).default;
    freecurrencyapi = new Freecurrency(process.env.API_KEY);
})();


router.post("/convert", async (req, res, next) => {
    try {
        const { baseCurrency = 'USD', targetCurrency = 'INR', amount } = req.body;

        // Fetch conversion data from freecurrencyapi
        const response = await freecurrencyapi.latest({
            base_currency: baseCurrency,
            currencies: targetCurrency
        });

        var createNewRecord = await Currency.create({
            baseCurrency,
            targetCurrency,
            amount,
            conversionRate: response.data[targetCurrency]
        });

        if (response && response.data) {
            return res.json(createNewRecord);
        } else {
            return res.status(400).json({
                status: "error",
                message: "Failed to retrieve conversion data."
            });
        }

    } catch (error) {
        console.error("Error during conversion:", error);
        return res.status(500).json({
            status: "error",
            message: "An error occurred during the currency conversion.",
        });
    }
});

router.get("/getAvailableCurrencies", async (req, res, next) => {
    try {
        const response = await freecurrencyapi.currencies();
        return res.json(response.data);
    } catch (error) {
        console.error("Error during currency fetching list", error);
        return res.status(500).json({
            status: "error",
            message: "An error occurred during the currency fetching.",
        });
    }
});

router.get("/getHistory", async (req, res, next) => {
    try {
            var records = await Currency.find();
            return res.json({data: records});
    } catch (error) {
        console.error("Error during conversion:", error);
        return res.status(500).json({
            status: "error",
            message: "An error occurred during the currency records.",
        });
    }
});

module.exports = router;
