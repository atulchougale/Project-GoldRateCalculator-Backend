// const express = require('express');
// const router = express.Router();
// const GoldRate = require('../models/GoldRate');

// // Get all gold rates
// router.get('/', async (req, res) => {
//   try {
//     const goldRates = await GoldRate.find();
//     res.json(goldRates);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get a specific gold rate by ID
// router.get('/:id', getGoldRate, (req, res) => {
//   res.json(res.goldRate);
// });

// // Create a new gold rate
// router.post('/', async (req, res) => {
//   const goldRate = new GoldRate({
//     date: req.body.date,
//     rate: req.body.rate,
//   });

//   try {
//     const newGoldRate = await goldRate.save();
//     res.status(201).json(newGoldRate);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Update a gold rate by ID
// router.patch('/:id', getGoldRate, async (req, res) => {
//   if (req.body.date != null) {
//     res.goldRate.date = req.body.date;
//   }

//   if (req.body.rate != null) {
//     res.goldRate.rate = req.body.rate;
//   }

//   try {
//     const updatedGoldRate = await res.goldRate.save();
//     res.json(updatedGoldRate);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Delete a gold rate by ID
// router.delete('/:id', getGoldRate, async (req, res) => {
//   try {
//     await res.goldRate.remove();
//     res.json({ message: 'Gold rate deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Middleware to get a gold rate by ID
// async function getGoldRate(req, res, next) {
//   let goldRate;

//   try {
//     goldRate = await GoldRate.findById(req.params.id);

//     if (goldRate == null) {
//       return res.status(404).json({ message: 'Gold rate not found' });
//     }
//   } catch (err) {
//     return res.status
// }

// res.goldRate = goldRate;
// next();
// }

// module.exports = router;