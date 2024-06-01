const postPredictHandler = require("./handler");

const routes = [
  {
    path: "/predict",
    method: "POST",
    handler: postPredictHandler,
    options: {
      auth: "jwt",
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 1000000,
      },
    },
  },
];

module.exports = routes;
