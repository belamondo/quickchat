const functions = require('firebase-functions');
const cors = require('cors')
const express = require('express');
const app = express();
const app2 = express();

getAddress = () => new Promise((resolve, reject) => {
    app2.get('http://cep.republicavirtual.com.br/web_cep.php?cep=57046367&formato=json', (req, res) =>  {
        resolve(res)
    });
})

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cors({ origins: true }));

app.post('/findByZipCode', (request, response) => {
    getAddress()
    .then(res => {
        response.send(res);
        return true;
    })
    .catch(err => {
        response.send(err);
        return false;
    })
})

const apiAddress = functions.https.onRequest((req, res) => {
    if (!req.path) {
        req.url = `/${request.url}` // prepend '/' to keep query params if any
    }
    return app(req, res);
})

module.exports = {
    apiAddress
}

/* Find address by zip code *
exports.findByZipCode = functions.https.onRequest((req, res) => {
    // Add headers
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });
    
    //app.get('http://cep.republicavirtual.com.br/web_cep.php?cep='+ req.body.zipCode +'&formato=json', (childReq, childRes) => {
    app.get('http://cep.republicavirtual.com.br/web_cep.php?cep=57046367&formato=json', (childReq, childRes) => {
        console.log(childRes);
        res.send(childRes);
    })
    
})*/
