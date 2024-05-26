require('dotenv').config();
 
const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
// const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');
const Jwt = require('@hapi/jwt');
 
(async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: 'localhost',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });
 
    // const model = await loadModel();
    // server.app.model = model;
 
    server.route(routes);

    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
 
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message}`
            })
            newResponse.code(response.statusCode)
            return newResponse;
        }

        if (response.isBoom && response.output.statusCode === 413) {
            const newResponse = h.response({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000'
            })
            newResponse.code(413)
            return newResponse;
        }
 
        return h.continue;
    });

    //make a register
    await server.register(Jwt);

    //define the strategy
    server.auth.strategy('jwt', 'jwt', {
        keys: process.env.JWT_SECRET,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400
        },
        validate: (artifacts, request, h) => {

            if (!artifacts.decoded.payload.user) {
                return {
                    isValid: false
                };
            }
            
            return {
                isValid: true,
                credentials: { user: artifacts.decoded.payload.user }
            };
        }
    });

    server.auth.default('jwt');

    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();