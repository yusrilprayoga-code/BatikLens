const {
  registerHandler,
  loginHandler,
  // postPredictHandler,
  homeHandler,
} = require("./handler");

const routes = [
  {
    method: "GET",
    path: "/",
    handler: homeHandler,
  },
  {
    method: "POST",
    path: "/register",
    handler: registerHandler,
    options: {
      auth: false,
      payload: {
        allow: "application/json",
      },
    },
  },
  {
    method: "POST",
    path: "/login",
    handler: loginHandler,
    options: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/protected",
    handler: (request, h) => {
      return h
        .response({
          status: "success",
          message: "You have accessed a protected route!",
          user: request.auth.credentials.user,
        })
        .code(200);
    },
    options: {
      auth: 'jwt',
    }
  },
  {
    method: "GET",
    path: "/set-cookie",
    handler: async (request, h) => {
      h.state("auth", "your_cookie_value", {
        ttl: 24 * 60 * 60 * 1000,
        isSecure: false,
        path: "/",
      });

      return h
        .response({
          status: "success",
          message: "Cookie set successfully",
        })
        .code(200);
    },
    options: {
      auth: 'jwt',
    },
  },
  // {
  //   path: "/predict",
  //   method: "POST",
  //   handler: postPredictHandler,
  //   options: {
  //     payload: {
  //       allow: 'multipart/form-data',
  //       multipart: true,
  //       maxBytes: 1000000,
  //     },
  //   },
  // },
];

module.exports = routes;
