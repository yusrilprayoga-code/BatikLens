const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const Cookie = require("@hapi/cookie");
const loadModel = require("../services/loadModel");

// error handling
const InputError = require("../exceptions/InputError");

// authentikasi
const authentication = require("../api/authentication");

// predict
const predict = require("../api/predict");

// get Histories
const histories = require("../api/history");

// Load environment variables
require("dotenv").config();

(async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  server.ext("onPreResponse", function (request, h) {
    const response = request.response;

    if (response instanceof InputError) {
      const newResponse = h.response({
        status: "fail",
        message: `${response.message}`,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response.isBoom && response.output.statusCode === 413) {
      const newResponse = h.response({
        status: "fail",
        message: "Payload content length greater than maximum allowed: 1000000",
      });
      newResponse.code(413);
      return newResponse;
    }

    return h.continue;
  });

  await server.register([Jwt, Cookie]);

  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400,
    },
    validate: (artifacts, _request, _h) => {
      if (!artifacts.decoded.payload.user) {
        return { isValid: false };
      }
      return {
        isValid: true,
        credentials: { user: artifacts.decoded.payload.user },
      };
    },
  });

  await server.register(authentication);
  await server.register(predict);
  await server.register(histories);

  server.auth.default("jwt");

  await server.start();
  console.log(`Server started at: ${server.info.uri}`);
})();
