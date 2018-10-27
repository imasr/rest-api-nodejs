
const os = require("os");
const _ = require("lodash");
const { TraceUser } = require("../model/trace.model");
var axios = require('axios');


const trace = (req, res) => {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.body.lat},${req.body.lng}&key=AIzaSyB5xFQL7-Cy90I-RzAAJRjU-IxUtKSb-is`)
        .then(function (resp) {
            var tracedData = new TraceUser({
                username: resp.data.results[0].formatted_address,
                details: resp.data.results[0]
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