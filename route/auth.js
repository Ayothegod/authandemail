import express from 'express';
const router = express.Router();
import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt  from 'jsonwebtoken';
import { registerValidation, loginValidation } from '../validation.js';

router.post('/register', async (req, res) => {
  //validate using joi
  const { error } = registerValidation(req.body);
  if (error) return res.send(error.details[0].message);

  //check if user already exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(404).send('Email already exist');

  //hash our password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: savedUser._id });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

//LOGIN
router.post('/login', async (req, res) => {
  //validate using joi
  const { error } = loginValidation(req.body);
  if (error) return res.send(error.details[0].message);

  //check if useremail already exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send('Email does not exist');
  //check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(404).send('Invalid Password');

  const token = jwt.sign({_id : user._id}, process.env.TOKEN_SECRET)
  res.header('auth-token', token).send(token)

//   res.send('successful login');
});
export default router;
