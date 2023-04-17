import mongoose from 'mongoose';

const goldRateSchema = new mongoose.Schema({
  currency: String,
  rate: Number,
  actualPrice: Number,
  makingCharges: Number,
  gst: Number,
  goldPrice: Number,
  date: { type: Date, index: true },
});

const GoldRate = mongoose.model('GoldRate', goldRateSchema);

export default GoldRate;