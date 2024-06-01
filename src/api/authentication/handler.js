const Joi = require("joi");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore();

const registerHandler = async (request, h) => {
  const { email, password, confirmPassword } = request.payload;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.ref("password"),
  });

  const { error } = schema.validate({ email, password, confirmPassword });

  if (error) {
    return h.response({
      status: "fail",
      message: error.details[0].message,
    }).code(400);
  }

  const userSnapshot = await db.collection("users").where("email", "==", email).get();
  if (!userSnapshot.empty) {
    return h.response({
      status: "fail",
      message: "Email already registered",
    }).code(400);
  }

  const id = crypto.randomUUID();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id,
    email,
    password: hashedPassword,
  };

  await db.collection("users").doc(id).set(newUser);

  return h.response({
    status: "success",
    message: "User created successfully",
    user: {
      id,
      email
    }
  }).code(201);
};

const getRegisterData = async (request, h) => {
  const id = request.params.id;
  const userSnapshot = await db.collection("users").doc(id).get();
  if (!userSnapshot.exists) {
    return h.response({
      status: "fail",
      message: "User not found",
    }).code(404);
  }
  const user = userSnapshot.data();
  return h.response({
    status: "success",
    user,
  }).code(200);
};

const loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  const userSnapshot = await db.collection("users").where("email", "==", email).get();
  if (userSnapshot.empty) {
    return h.response({
      status: "fail",
      message: "Email not registered",
    }).code(400);
  }

  const user = userSnapshot.docs[0].data();
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return h.response({
      status: "fail",
      message: "Password is incorrect",
    }).code(400);
  }

  const token = jwt.sign(
    { user: { id: user.id, email: user.email } },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return h.response({
    status: "success",
    message: "Login successful",
    user: {
      email,
      expiresIn: "1h",
      token,
    },
  }).state("token", token, {
    ttl: 30 * 60 * 1000,
    isSecure: process.env.NODE_ENV === "production",
    isHttpOnly: true,
    encoding: "none",
    clearInvalid: false,
    path: "/",
    strictHeader: true,
  }).code(200);
};

const getLoginData = async (request, h) => {
  const id = request.params.id;
  const userSnapshot = await db.collection("users").doc(id).get();
  if (!userSnapshot.exists) {
    return h.response({
      status: "fail",
      message: "User not found",
    }).code(404);
  }
  const user = userSnapshot.data();
  return h.response({
    status: "success",
    user,
  }).code(200);
};

const logoutHandler = (_request, h) => {
  return h.response({
    status: "success",
    message: "Logout successfully",
  }).unstate("token").code(200);
};

module.exports = { registerHandler, getRegisterData, loginHandler, getLoginData, logoutHandler };
