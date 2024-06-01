const routes = require('./routes');

module.exports = {
    name: 'history',
    version: '1.0.0',
    register: async (server) => {
        server.route(routes);
    },
};