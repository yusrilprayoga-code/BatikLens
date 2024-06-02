const { searchPredictions } = require("./handler");

const routes = [
    {
        method: "GET",
        path: "/predict/{query}",
        handler: searchPredictions,
    },
]

module.exports = routes;