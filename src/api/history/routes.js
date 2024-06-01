const postHandlerHistories = require("./handler");

const routes = [
    {
        method: "GET",
        path: "/predict/histories",
        handler: postHandlerHistories,
    }
]

module.exports = routes;