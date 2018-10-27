
const os = require("os");
const _ = require("lodash");
const { TraceUser } = require("../model/trace.model");
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyB5xFQL7-Cy90I-RzAAJRjU-IxUtKSb-is', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

const trace = (req, res) => {
    geocoder.reverse(req.body)
        .then(function (resp) {
            var tracedData = new TraceUser({
                username: resp[0].formattedAddress,
                details: resp[0]
            })
            if (tracedData) {
                tracedData.save().then(success => {
                    res.send(success);
                })
            } else
                return res.status(400).send('Username not found')
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

const getuser = (req, res) => {
    TraceUser.find({}).then(resp => {
        if (!resp) {
            return res.send('NO user found')
        }
        res.send(resp)
    })
}


module.exports = {
    trace,
    getuser
}