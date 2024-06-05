const { searchPredictions } = require("./handler");

const routes = [
    {
        method: "GET",
        path: "/search/{name}",
        handler: searchPredictions,
    },
]

module.exports = routes;