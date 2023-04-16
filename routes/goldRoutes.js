import express  from 'express';
import axios from 'axios';

import GoldRate from '../models/goldModel.js'

const router = express.Router();

router.get('/gold/:currency', async (req, res) => {
  try {
    const { currency } = req.params;
    const apiKey = 'goldapi-3spkzrrlg15pbzv-io';
    const apiUrl = `https://www.goldapi.io/api/XAU/${currency}`;

      // Get today's date
      const today = new Date();
      today.setHours(0,0,0,0); // Set hours to 0 to get midnight of the current day
    console.log(today)
      // Check if data for the current day exists in the database
      const existingData = await GoldRate.findOne({ currency: currency, date: today });
      if (existingData) {
        console.log('Data found in database');
        return res.json(existingData);
      }

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

router.put('/gold/:id', async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    const rate = await GoldRate.findByIdAndUpdate(id, updates);
    res.send(rate);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});




// Delete a gold rate by ID
router.delete('/gold/:id', async (req, res) => {
  try {
    await GoldRate.remove();
    res.json({ message: 'Gold rate deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
