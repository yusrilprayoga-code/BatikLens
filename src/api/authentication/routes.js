const { 
    getRegisterData,
    registerHandler,
    loginHandler,
    getLoginData,
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
    method: "GET",
    path: "/register:{id}",
    handler: getRegisterData,
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
    path: "/login:{id}",
    handler: getLoginData,
  },
  {
    method: "GET",
    path: "/logout",
    handler: logoutHandler,
    options: {
      auth: "jwt",
    },
  }
];

module.exports = routes;
