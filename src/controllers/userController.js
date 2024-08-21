
const { redisCache } = require('../config/redis');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Create a new user
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email }); 

    if (user) return res.status(400).json({ msg: 'USER_ALREADY_EXISTS' });

    // Hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password using the salt

    // Create the new user with the hashed password
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(200).send({ message: "CREATE_USER_SUCCESS" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {

    // check user in redis
    const userData = await redisCache.get(`USER:${req.body.id}`);
    const users = JSON.parse(userData)
    if (users) return res.json(users)

    // find user 
    const user = await User.findById(req.body.id);
    if (!user) return res.status(404).json({ msg: 'USER_NOT_FOUND' });

    await redisCache.set(`USER:${user._id}`, JSON.stringify(user), 'EX', 3600);

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// get users
exports.getUsers = async (req, res) => {
  try {

    // find user 
    const user = await User.find();
    if (!user) return res.status(404).json({ msg: 'USER_NOT_FOUND' });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deletedUsers = async (req, res) => {
  try {
    
    // find user 
    const data = await redisCache.get(`USER:${req.body.id}`);
    if (!data) return res.status(404).json({ msg: "USER_NOT_FOUND_IN_REDIS" });

    // delete user in redis
    await redisCache.del(`USER:${req.body.id}`);

    return res.json({ message: "deleted user success" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

