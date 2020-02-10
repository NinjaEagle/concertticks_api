const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const concertSchema = new Schema ({
    name: {
        type: String,
        require: true
    },
    time:{
        type: String,
        require: true,
    },
    location:{
        type: String,
        require: true,
    }
    {timestamps:true,}

});

const Concert = mongoose.model('Concert', concertSchema);

module.exports = Concert;