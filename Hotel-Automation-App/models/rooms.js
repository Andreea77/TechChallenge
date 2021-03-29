const { Int32 } = require("bson");
var mongoose=require("mongoose");
var roomsSchema=mongoose.Schema({
    roomId: {type: Number, required: true},
    roomNumber: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    facilities: { type: String, required: false }
}, { collection : 'rooms' });

module.exports=mongoose.model("Rooms", roomsSchema);