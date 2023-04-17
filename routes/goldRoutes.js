import express  from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()

import GoldRate from '../models/goldModel.js'

const router = express.Router();

router.get('/:currency', async (req, res) => {
  try {
    const { currency } = req.params;
    const apiKey = process.env.GOLD_API_KEY;
    const apiUrl = `https://www.goldapi.io/api/XAU/${currency}`;

    const { data } = await axios.get(apiUrl, { headers: { 'x-access-token': apiKey } });

    if (data.error) {
      // Handle error response from Gold API
      const errorMessage = `Gold API returned an error: ${data.error}`;
      console.error(errorMessage);
      return res.status(500).json({ message: errorMessage });
    }

    const goldRate = new GoldRate({
      currency: data.currency,
      rate: data.price,
      date: new Date(),
    });
    await goldRate.save();
    console.log('Data fetched from API');
    res.json({ data, goldRate });
  } catch (error) {
    // Handle error thrown by axios or MongoDB
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/rate/calculate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const goldData = await GoldRate.findById(id);

    if (!goldData) {
      return res.status(404).json({ message: `No gold data found with ID ${id}` });
    }

    const { weight, karat } = req.body;
    const actualPrice = weight * karat;
    const making = (actualPrice * 15) / 100;
    const gst = ((actualPrice + making) * 3) / 100;
    const goldPrice = actualPrice + making + gst;

    goldData.actualPrice = actualPrice;
    goldData.makingCharges = making;
    goldData.gst = gst;
    goldData.goldPrice = goldPrice;

    await goldData.save();

    res.json({ message: 'Gold rate updated successfully', goldData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const goldData = await GoldRate.findByIdAndDelete(id);
    if (!goldData) {
      return res.status(404).json({ message: `No gold data found with ID ${id}` });
    }
    res.json({ message: 'Gold data deleted successfully', goldData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


export default router;
