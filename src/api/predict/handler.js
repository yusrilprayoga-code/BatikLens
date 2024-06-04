const crypto = require('crypto');
const storeData = require('../../services/storeData');
const predictClassification = require('../../services/inferenceService');

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

        const { confidenceScore, label, origin, filosofi, shortInsight, manufacturingMethod, suggestion } = await predictClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            Name: label,
            originName: origin,
            filosofi: filosofi,
            shortInsight: shortInsight,
            manufacturingMethod: manufacturingMethod,
            suggestion,
            confidenceScore,
            createdAt
        };

        await storeData(id, data);

        const response = h.response({
            status: 'success',
            message: confidenceScore > 0.5 ? 'Prediksi berhasil' : 'Prediksi gagal',
            data
        });
        response.code(201);
        return response;

    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: `Terjadi kesalahan dalam melakukan prediksi`
        });
        response.code(500);
        return response;
    }
}

module.exports = postPredictHandler;
