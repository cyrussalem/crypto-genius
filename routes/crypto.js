var express = require('express');
var router = express.Router();
var Twit = require('twit');
var config = require('../config');
var exchangeManager = require('../lib/exchange-manager.js');

// instantiate Twit module
var twitter = new Twit(config.twitter);

/**
 * GET tweets json.
 */
router.get('/exchange-prices', function (req, res) {
    exchangeManager.getExchangePrices(function (err, data) {
        if (err) return res.status(404).send('Failed to retrieve exchange prices');
        res.send(data);
    })
});

router.post('/connect-to-user-wallet', function (req, res) {
    res.send({});
});

router.post('/disconnect-from-wallet', function (req, res) {
    res.send({});
});

router.post('/initiate-force-buy', function (req, res) {
    res.send({});
});

router.post('/stop-force-buy', function (req, res) {
    res.send({});
});

router.post('/initiate-force-sell', function (req, res) {
    res.send({});
});

router.post('/stop-force-sell', function (req, res) {
    res.send({});
});

router.get('/system-and-prediction-statuses', function (req, res) {
    res.send({
        systemStatus: 'Idle',
        predictionLogs: [{
            message: 'something',
            time: new Date()
        }],
        systemLogs: [
            {
                message: 'something2',
                time: new Date()
            }
        ]
    });
});


module.exports = router;
