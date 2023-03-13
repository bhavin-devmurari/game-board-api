const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');

router.route('/id').post(gamesController.getGameById);
router
  .route('/')
  .get(gamesController.getAllGames)
  .post(gamesController.createNewGame)
  .patch(gamesController.editGame)
  .delete(gamesController.deleteGame);

module.exports = router;
