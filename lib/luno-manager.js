var https = require('https');
var http = require('http');
var async = require('async');
var usdToZarRate = 12.5;

module.exports = {
    getExchangePrices: function (callback) {
        var exchnagePrices = [];
        async.series([
            function (cb) {
                var body = "";
                http.get('http://api.fixer.io/latest?base=USD', function (res) {

                    res.on("data", function (data) {
                        body += data;
                    });
                    res.on("end", function () {
                        body = JSON.parse(body);

                        try {
                            usdToZarRate = body.rates.ZAR;
                        } catch (err) {
                            if (err) console.error(err);
                        }

                        cb();

                    });
                });
            },
            function (cb) {
                var body = "";
                https.get('https://www.luno.com/ajax/1/display_ticker', function (res) {

                    res.on("data", function (data) {
                        body += data;
                    });
                    res.on("end", function () {
                        body = JSON.parse(body);
                        exchnagePrices.push(parseLunoExchnagePrice(body));
                        cb();

                    });
                });
            },
            function (cb) {
                var body = "";
                https.get('https://public-api.lykke.com/api/AssetPairs/rate', function (res) {

                    res.on("data", function (data) {
                        body += data;
                    });
                    res.on("end", function () {
                        body = JSON.parse(body);
                        exchnagePrices.push(parseLykkeExchnagePrice(body));
                        cb();

                    });
                });
            },
            function (cb) {
                cb();
            }
        ], function (err) {
            if (err) return callback(err);

            callback(null, exchnagePrices);
        });
    },
    getTicker: function(callback) {
        var body = "";
        https.get('https://api.mybitx.com/api/1/ticker?pair=XBTZAR', function (res) {

            res.on("data", function (data) {
                body += data;
            });
            res.on("end", function () {
                body = JSON.parse(body);
                callback(null, body);
            });
        });
    },
    getOrderBookSummary: function (callback) {
        var body = "";
        https.get('https://api.mybitx.com/api/1/orderbook?pair=XBTZAR', function (res) {

            res.on("data", function (data) {
                body += data;
            });
            res.on("end", function () {
                body = JSON.parse(body);
                body.asks = [body.asks[0]];
                body.bids = [body.bids[0]];
                callback(null, body);
            });
        });
    },
    getBalances: function (options, callback) {//todo finish this
        var body = "";
        https.get('https://api.mybitx.com/api/1/balance', function (res) {

            res.on("data", function (data) {
                body += data;
            });
            res.on("end", function () {
                body = JSON.parse(body);
                callback(null, body);
            });
        });
    }
};