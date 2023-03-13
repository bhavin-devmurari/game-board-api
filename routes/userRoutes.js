const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.route('/id').post(usersController.getUserById);
router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.editUser)
  .delete(usersController.deleteUser);

module.exports = router;
