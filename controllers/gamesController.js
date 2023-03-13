const Game = require('../models/Game');
const asyncHandler = require('express-async-handler');

// @desc Get game by id
// @route GET /games/id
const getGameById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const data = await Game.find({ _id: id }).lean();
  if (!data?.length) {
    return res.status(400).json({ error: true, message: 'No game found' });
  }
  res.json(data[0]);
});

// @desc Get all games
// @route GET /games
const getAllGames = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 7;
  const search = req.query.search || '';

  const data = await Game.find({
    $or: [
      { gameName: { $regex: search, $options: 'i' } },
      { gameCategory: { $regex: search, $options: 'i' } },
    ],
    $and: [
      { updatedAt: { $gte: req.query.startDate, $lt: req.query.endDate } },
    ],
  })
    .skip(page * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  if (!data?.length) {
    return res.status(400).json({ error: true, message: 'No game found' });
  }

  const total = await Game.countDocuments({
    gameName: { $regex: search, $options: 'i' },
    gameCategory: { $regex: search, $options: 'i' },
  });

  const response = {
    error: false,
    total,
    page: page + 1,
    limit,
    data,
  };

  res.json(response);
});

// @desc create new game
// @route POST /games
const createNewGame = asyncHandler(async (req, res) => {
  const { gameName, gameCategory, releaseYear, publisher } = req.body;
  if (!gameName || !gameCategory) {
    return res.status(400).json({
      error: true,
      message: 'game name and game category fields are required',
    });
  }
  const duplicate = await Game.findOne({ gameName }).lean().exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ error: true, message: 'Duplicate game name' });
  }
  const gameObject = { gameName, gameCategory, releaseYear, publisher };
  const user = await Game.create(gameObject);

  if (user) {
    res.status(201).json({ message: `New game ${gameName} created` });
  } else {
    res
      .status(400)
      .json({ error: true, message: `Invalid game data received.` });
  }
});

// @desc update a game
// @route PATCH /games
const editGame = asyncHandler(async (req, res) => {
  const { id, gameName, gameCategory, releaseYear, publisher } = req.body;

  if (!id || !gameName || !gameCategory) {
    return res.status(400).json({
      error: true,
      message: 'game name and game category fields are required',
    });
  }

  const game = await Game.findById(id).exec();
  if (!game) {
    return res.status(400).json({ error: true, message: 'Game not found' });
  }
  const duplicate = await Game.findOne({ gameName }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res
      .status(409)
      .json({ error: true, message: 'Duplicate game name' });
  }

  game.gameName = gameName;
  game.gameCategory = gameCategory;
  game.releaseYear = releaseYear;
  game.publisher = publisher;

  const updatedGame = await game.save();
  res.status(202).json({ message: `${updatedGame.gameName} updated` });
});

// @desc delete a game
// @route DELETE /games
const deleteGame = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: true, message: `Game ID required.` });
  }
  const game = await Game.findById(id).exec();
  if (!game) {
    return res.status(400).json({ error: true, message: `Game not found.` });
  }
  const result = await Game.deleteOne({ _id: id });
  const reply = `${result.gameName} with ID ${result._id} deleted`;
  res.json({ message: reply });
});

module.exports = {
  getGameById,
  getAllGames,
  createNewGame,
  editGame,
  deleteGame,
};
