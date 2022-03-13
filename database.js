//Import the mongoose module
const config = require('config')
const mongoose = require('mongoose');

const username = config.get('mongodb.username')
const password = config.get('mongodb.password')
const clusterName = config.get('mongodb.cluster')
const databaseName = config.get('mongodb.database')
const options = config.get('mongodb.options')

serialize = function(obj) {
    var str = [];
    for (const [key, val] of Object.entries(obj))
        str.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
    return str.join("&");
}

//Set up default mongoose connection
var mongoDB = `mongodb+srv://${username}:${password}@${clusterName}.lvjel.mongodb.net/${databaseName}?${serialize(options)}`;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;