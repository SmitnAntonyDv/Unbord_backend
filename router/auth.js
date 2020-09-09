const { Router } = require("express");
const User = require("../models").user;

const router = new Router();

router.post("/login", async (req, res, next) => {
  // login logic
  try {
    const { email, password } = req.body;
    if (!email || !password || email === " " || password === " ") {
      res
        .status(400)
        .send({ message: "Please supply a valid email and password" });
    }

    const user = await User.findOne({
      where: { email },
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect",
      });
    }
    if (!user.verified) {
      return res.status(403).send({
        message:
          "You must verify your account before logging in. Please check your email.",
      });
    }
    delete user.dataValues["password"]; // don't send back the password hash
    const token = toJWT({ userId: user.id });
    res.send({ token, ...user.dataValues });
  } catch (e) {
    next(e);
  }
});
