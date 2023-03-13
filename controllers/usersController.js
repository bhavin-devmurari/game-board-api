const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const data = await User.find({ _id: id }).lean();
  if (!data?.length) {
    return res.status(400).json({ error: true, message: 'No user found' });
  }
  res.json(data[0]);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 7;
  const search = req.query.search || '';

  const data = await User.find({
    $or: [
      { firstName: { $regex: search, $options: 'i' } },
      { userName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      // { _id: search },
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
    return res.status(400).json({ error: true, message: 'No user found' });
  }

  const total = await User.countDocuments({
    firstName: { $regex: search, $options: 'i' },
    userName: { $regex: search, $options: 'i' },
    email: { $regex: search, $options: 'i' },
  });

  // find total current pages = users?.length
  const response = {
    error: false,
    total,
    page: page + 1,
    limit,
    data,
  };

  res.json(response);
});

// @desc create new user
// @route POST /users
const createNewUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, userName, email } = req.body;

  //confirm the data
  if (!firstName || !userName || !email) {
    return res.status(400).json({
      error: true,
      message: 'firstname, username and email fields are required',
    });
  }

  //check for duplicate
  const duplicate = await User.findOne({ userName }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ error: true, message: 'Duplicate username' });
  }
  const userObject = { firstName, lastName, userName, email };
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${userName} created` });
  } else {
    res
      .status(400)
      .json({ error: true, message: `Invalid user data received.` });
  }
});

// @desc update a user
// @route PATCH /users
const editUser = asyncHandler(async (req, res) => {
  const { id, firstName, lastName, userName, email, active } = req.body;

  if (!id || !firstName || !userName || !email) {
    return res.status(400).json({
      error: true,
      message: 'firstname, username and email fields are required',
    });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ error: true, message: 'User not found' });
  }

  //check for duplicate
  const duplicate = await User.findOne({ userName }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ error: true, message: 'Duplicate username' });
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.userName = userName;
  user.email = email;
  user.active = active;

  const updatedUser = await user.save();
  res
    .status(202)
    .json({ error: false, message: `${updatedUser.userName} updated` });
});

// @desc delete a user
// @route DELETE /users
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: true, message: `User ID required.` });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ error: true, message: `User not found.` });
  }
  const result = await User.deleteOne({ _id: id });
  const reply = `${result.userName} with ID ${result._id} deleted`;
  res.json({ message: reply });
});

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  editUser,
  deleteUser,
};
