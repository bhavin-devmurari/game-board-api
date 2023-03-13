const User = require('../models/User');
const Game = require('../models/Game');
// const EmptyDb = require('../models/EmptyDb');
const asyncHandler = require('express-async-handler');

// @desc Get dashboard data
// @route GET /dashboard
const getDashboardData = asyncHandler(async (req, res) => {
  let game = await Game.find().limit(3).sort({ createdAt: -1 }).lean();
  let user = await User.find().limit(3).sort({ createdAt: -1 }).lean();

  const totalGames = await Game.countDocuments();
  const totalUsers = await User.countDocuments();

  // if (!game?.length) {
  //   return res.status(400).json({ error: true, message: 'No game found' });
  // }

  // if (!user?.length) {
  //   return res.status(400).json({ error: true, message: 'No game found' });
  // }
  // const data = { totalUsers, totalGames, user, game };
  const data = { totalUsers, totalGames, user, game };

  res.json(data);
});

// @desc Get dashboard data
// @route GET /dashboard
const getDashboardDataTest = asyncHandler(async (req, res) => {
  let game = await Game.find().limit(3).sort({ createdAt: -1 }).lean();
  let user = await EmptyDb.find().limit(3).sort({ createdAt: -1 }).lean();

  const totalGames = await Game.countDocuments();
  const totalUsers = await EmptyDb.countDocuments();

  // if (!game?.length) {
  //   return res.status(400).json({ error: true, message: 'No game found' });
  // }

  // if (!user?.length) {
  //   return res.status(400).json({ error: true, message: 'No game found' });
  // }
  // const data = { totalUsers, totalGames, user, game };
  const data = { totalUsers, totalGames, user, game };

  res.json(data);
});

module.exports = {
  getDashboardData,
};
