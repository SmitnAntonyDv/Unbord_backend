const { Router } = require('express');
const { toJWT, emailToken, validatingEmail } = require('../auth/jwt');
const authMiddleware = require('../auth/middleware');
const bcrypt = require('bcrypt');
const {
  SALT_ROUNDS,
  BACKEND_API,
  API_URL,
  AUTH_USER,
  AUTH_PASS,
} = require('../config/constants');
const nodemailer = require('nodemailer');
const User = require('../models').user;

const router = new Router();

// login logic
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === ' ' || password === ' ') {
      res
        .status(400)
        .send({ message: 'Please supply a valid email and password' });
    }

    const user = await User.findOne({
      where: { email },
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: 'User with that email not found or password incorrect',
      });
    }
    if (!user.verified) {
      return res.status(403).send({
        message:
          'You must verify your account before logging in. Please check your email.',
      });
    }
    delete user.dataValues['password']; // don't send back the password hash
    const token = toJWT({ userId: user.id });
    res.send({ token, ...user.dataValues });
  } catch (e) {
    next(e);
  }
});

// CREATE a new user
router.post('/signup', async (req, res, next) => {
  const {
    email,
    password,
    firstName,
    lastName,
    userName,
  } = req.body.signUpData;
  console.log('what this?', req.body);
  if (!email || !password || !firstName || !lastName || !userName) {
    return res.status(400).send('Please fillout all required fields');
  }
  try {
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      userName,
      password: bcrypt.hashSync(password, SALT_ROUNDS),
      verified: false,
    });

    // const eToken = emailToken({ id: newUser.id });
    // // created encrypted email link
    // const url = `${BACKEND_API}/auth/confirmation/${eToken}`;

    // const transporter = nodemailer.createTransport({
    //   service: "outlook",
    //   auth: {
    //     user: `${AUTH_USER}`,
    //     pass: `${AUTH_PASS}`,
    //   },
    // });

    // const confirmationEmailTemplate = {
    //   from: `${AUTH_USER}`, // sender address
    //   to: `${email}`, // list of receivers
    //   subject: `Hello, ${firstName}`, // Subject line
    //   text: `Thank you for registering an account with space travel agency.
    //     Please confirm your email by clicking the following link:${url}`, // plain text body
    //   html: `
    //     <div
    //       style=
    //       padding: 5px 5px 5px 5px;
    //       line-spacing: 2rem;
    //       border="0";
    //       width="600";
    //     >
    //       <h2>Dear ${firstName}, thank you for joining the Traveler's Diary community!</h2>
    //       <h3>IMPORTANT:</h3>
    //       <p>Please confirm your email by clicking the following link:<a href=${url}>${url}</a></p>
    //     </div>

    //     `, // html body
    // };

    // transporter.sendMail(confirmationEmailTemplate, function (err, data) {
    //   if (err) {
    //     console.log("Error Occurs", err);
    //   } else {
    //     console.log("Email sent!!!");
    //   }
    // });

    res.status(201).send(newUser);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(400)
        .send({ message: 'There is an existing account with this email' });
    }

    return res.status(400).send({ message: 'Something went wrong, sorry' });
  }
});

// don't send back the password hash
router.get('/me', authMiddleware, async (req, res) => {
  delete req.user.dataValues['password'];
  res.status(200).send({ ...req.user.dataValues });
});

router.get('/confirmation/:token', async (req, res) => {
  try {
    const { id } = validatingEmail(req.params.token);
    const updatedUser = await User.update(
      { verified: true },
      { where: { id } }
    );
  } catch (e) {
    res.send('error');
  }

  return res.redirect(API_URL);
});

module.exports = router;
