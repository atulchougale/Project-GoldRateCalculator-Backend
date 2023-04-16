import express  from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()

import GoldRate from '../models/goldModel.js'

const router = express.Router();

router.get('/gold/:currency', async (req, res) => {
  try {
    const { currency } = req.params;
    const apiKey = 'goldapi-3spkzrrlg15pbzv-io';
    const apiUrl = `https://www.goldapi.io/api/XAU/${currency}`;

    

    const { data } = await axios.get(apiUrl, { headers: { 'x-access-token': apiKey } });

    const goldRate = new GoldRate({
      currency: data.currency,
      rate: data.price,
      date: new Date(),
    });
    await goldRate.save();
    console.log('Data fetched from API');
    res.json({data,goldRate});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});



export default router;
