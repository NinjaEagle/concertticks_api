const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const concertSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required:true
    },
    location:{
        type: String,
        required: true,
    }},
    {timestamps:true});

const Concert = mongoose.model('Concert', concertSchema);

module.exports = Concert;