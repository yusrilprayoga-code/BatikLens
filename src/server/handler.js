const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore();
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// const storeData = require('../services/storeData');
 
// async function postPredictHandler(request, h) {
//   const { image } = request.payload;
//   const { model } = request.server.app;
 
//   const { confidenceScore, label, suggestion } = await predictClassification(model, image);
//   const id = crypto.randomUUID();
//   const createdAt = new Date().toISOString();
 
//   const data = {
//     "id": id,
//     "result": label,
//     "suggestion": suggestion,
//     "confidenceScore": confidenceScore,
//     "createdAt": createdAt
//   }

//     await storeData(id, data);

//   const response = h.response({
//     status: 'success',
//     message: confidenceScore > 100 ? 'Model is predicted successfully' : 'Model is predicted successfully',
//     data
//   })
//     response.code(201);
//     return response;
// }

const homeHandler = (request, h) => {
  return h.response({
    status: 'success',
    message: 'Home route'
  }).code(200);
}

const registerHandler = async (request, h) => {
  const { email, password, confirmPassword } = request.payload;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.ref('password')
  });

  const {error} = schema.validate({email, password, confirmPassword});

  if (error) {
    return h.response({
      status: 'fail',
      message: error.details[0].message
    }).code(400);
  }

  const userSnapshot = await db.collection('users').where('email', '==', email).get();
  if (!userSnapshot.empty) {
    return h.response({
      status: 'fail',
      message: 'Email already registered'
    }).code(400);
  }

  const id = crypto.randomUUID();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id,
    email,
    password: hashedPassword,
  };

  await db.collection('users').doc(id).set(newUser);

  return h.response({
    status: 'success',
    message: 'User created successfully'
  }).code(201);
};

const loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  const userSnapshot = await db.collection('users').where('email', '==', email).get();
  if (userSnapshot.empty) {
    return h.response({
      status: 'fail',
      message: 'Email not registered'
    }).code(400);
  }

  const user = userSnapshot.docs[0].data();
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return h.response({
      status: 'fail',
      message: 'Password is incorrect'
    }).code(400);
  }

  const token = jwt.sign({ user: { id: user.id, email: user.email } }, process.env.JWT_SECRET, { expiresIn: '4h' });

  return h.response({
    status: 'success',
    message: 'Login successful',
    token,
  }).code(200);
};

module.exports = {  registerHandler, loginHandler, homeHandler };