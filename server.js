require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const conDB = require('./config/db');
const jwt = require("jsonwebtoken");
const userModel = require('./userModel');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/home', (req, res) => {
  res.status(200).json('You are welcome');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
conDB();
app.post('/register', async (req, res) => {
  const { fullname, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({
    fullname,
    email,
    password: hashedPassword
  });

  try {
    const userCreated = await newUser.save();
    console.log("User has been created in the database");
    return res.status(200).send("User has been created in the database");
  } catch (error) {
    console.log("User cannot be created", error);
    return res.status(500).send("User cannot be created");
  }
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).send('Invalid email or password');
  }

  const mysecretkey = process.env.SECRET_CODE;

  const payload = {
    fullname: user.fullname,
    email: user.email,
  };

  const token = jwt.sign(payload, mysecretkey, { expiresIn: '5d' });

  res.status(200).json({
    msg: "User is logged in",
    token: token
  });
});