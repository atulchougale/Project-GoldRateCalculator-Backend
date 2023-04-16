import mongoose from "mongoose";

const goldRateSchema = new mongoose.Schema({
    currency: String,
    rate:Number,
    date: Date,
});

const GoldRate = mongoose.model('GoldRate', goldRateSchema);

export default GoldRate;