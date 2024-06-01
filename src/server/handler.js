
// const { Firestore } = require("@google-cloud/firestore");
// const db = new Firestore();


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
  return h
    .response({
      status: "success",
      message: "Home route",
    })
    .code(200);
};


module.exports = { homeHandler,};
