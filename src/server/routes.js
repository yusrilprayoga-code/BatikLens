const {
  registerHandler,
  loginHandler,
  // postPredictHandler,
  homeHandler,
  logoutHandler,
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
      payload: {
        allow: "application/json",
      }
    }
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
    path: "/logout",
    handler: logoutHandler,
    options: {
      auth: 'jwt',
    }
  },
  {
    method: "GET",
    path: "/{any*}",
    handler: (_request, h) => {
      return h
        .response({
          status: "fail",
          message: "Page not found",
        })
        .code(404);
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
