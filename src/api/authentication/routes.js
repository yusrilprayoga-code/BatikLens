const {
  registerHandler,
  loginHandler,
  getUserDataById,
  logoutHandler,
} = require("./handler");

const routes = [
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
      },
    },
  },
  {
    method: "GET",
    path: "/user/{id}",
    handler: getUserDataById,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/logout",
    handler: logoutHandler,
    options: {
      auth: "jwt",
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
      auth: "jwt",
    },
  },
];

module.exports = routes;
