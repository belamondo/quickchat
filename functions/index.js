const functions = require('firebase-functions');
const cors = require('cors');
const axios = require('axios')

/* Find address by zip code */
exports.findByZipCode = functions.https.onRequest((req, res) => {
    
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