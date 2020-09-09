const jwt = require("jsonwebtoken");

const secret =
  process.env.JWT_SECRET || "e9rp^&^*&@9sejg)DSUA)jpfds8394jdsfn,m";

const emailSecret =
  process.env.EMAIL_SECRET || "h6vs^&^*&@9sejg)DSUA)jpfds1234jdsfn,m";

function emailToken(data) {
  return jwt.sign(data, emailSecret, { expiresIn: "24h" });
}

function validatingEmail(emailToken) {
  console.log("my email secret", emailSecret);
  return jwt.verify(emailToken, emailSecret);
}

function toJWT(data) {
  return jwt.sign(data, secret, { expiresIn: "2h" });
}

function toData(token) {
  return jwt.verify(token, secret);
}

module.exports = { toJWT, toData, emailToken, validatingEmail };
