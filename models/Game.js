const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    gameName: {
      type: String,
      required: true,
      unique: true,
    },
    gameCategory: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: String,
    },
    publisher: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Game', gameSchema);
