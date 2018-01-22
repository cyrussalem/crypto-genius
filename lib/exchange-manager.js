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
    }
};

function parseLunoExchnagePrice(object) {
    var lunoData = {
        name: 'Luno',
        price: 'Unknown',
        unit: 'ZAR'
    };

    try {
        var priceString = object.btc_price;
        lunoData.price = parseInt(priceString.split(' ')[1].replace(',', ''));
    } catch (err) {
        console.error(err);
    }

    return lunoData;
}

function parseLykkeExchnagePrice(object) {
    var lykkeData = {
        name: 'Lykke',
        price: 'Unknown',
        unit: 'ZAR'
    };

    try {
        for (var i = 0; i < object.length; i++) {
            if (object[i].id === 'BTCUSD') {
                lykkeData.price = object[i].bid * usdToZarRate;
            }
        }
    } catch (err) {
        console.error(err);
    }

    return lykkeData;
}
