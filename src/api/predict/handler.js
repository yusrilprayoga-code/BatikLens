const crypto = require('crypto');
const storeData = require('../../services/storeData');
const predictClassification = require('../../services/inferenceService');

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

        const { confidenceScore, label, suggestion } = await predictClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: label,
            suggestion,
            confidenceScore,
            createdAt
        };

        await storeData(id, data);

        const response = h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data
        });
        response.code(201);
        return response;

    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: `Terjadi kesalahan dalam melakukan prediksi: ${error.message}`
        });
        response.code(500);
        return response;
    }
}

module.exports = postPredictHandler;
