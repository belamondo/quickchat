const cors = require('cors');

/**
 * Third party modules
 */
const app = express();
const axios = require('axios')
const bodyParser = require('body-parser');
const express = require('express');
const firebase = require('firebase');
const formidable = require('formidable');
const functions = require('firebase-functions');

/* Find address by zip code */
exports.findByZipCode = functions.https.onRequest((req, res) => {
    app.post('/user-type', (req, res) => {
        console.log()
    })
    /*app.get('http://cep.republicavirtual.com.br/web_cep.php?cep='+ req.body.zipCode +'&formato=json', (childReq, childRes) => {
    app.get('http://cep.republicavirtual.com.br/web_cep.php?cep=57046367&formato=json', (childReq, childRes) => {
        console.log(childRes);
        res.send(childRes);
    })
    */

    axios.get('http://apps.widenet.com.br/busca-cep/api/cep.json?code=06233-030')
        .then(snap => {
            console.log(snap.data)
            console.log(snap.data.url)
            console.log(snap.data.explanation)
            res.send('Chegou aqui')
            return true
        })
        .catch(err => {
            console.log(err)
            res.send(err)
            return false
        })

})