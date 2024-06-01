const { homeHandler } = require("./handler");

const routes = [
  {
    method: "GET",
    path: "/",
    handler: homeHandler,
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
];

module.exports = routes;
