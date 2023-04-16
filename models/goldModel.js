import mongoose from "mongoose";

const goldRateSchema = new mongoose.Schema({
    currency: String,
    rate:Number,
    actualGoldPrice: Number,
    makingCharges: Number,
    GST: Number,
    goldPrice: Number,
    date: Date,
});

const GoldRate = mongoose.model('GoldRate', goldRateSchema);

export default GoldRate;