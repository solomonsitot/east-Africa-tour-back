require('dotenv').config();
const mongoose = require("mongoose");

const DBconnection = mongoose.connect(process.env.URI).then(() => {
    console.log('connected to MongoDB');
}).catch((err) => { console.error('error connecting to MongoDB', err) })

module.exports = DBconnection;