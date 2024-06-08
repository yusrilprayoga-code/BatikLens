const crypto = require('crypto');
const { Storage } = require('@google-cloud/storage');
const storeData = require('../../services/storeData');
const predictClassification = require('../../services/inferenceService');

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

        const { confidenceScore, label, origin, filosofi, shortInsight, manufacturingMethod, suggestion } = await predictClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const storage = new Storage();
        const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
        const file = bucket.file(`images/${id}.png`);

        const stream = file.createWriteStream({
            metadata: {
                contentType: ['image/png', 'image/jpeg']
            }
        });

        stream.end(image);

        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        const data = {
            id,
            name: label,
            originName: origin,
            filosofi,
            shortInsight,
            manufacturingMethod,
            suggestion,
            confidenceScore,
            imageUrl,
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
        console.error('Prediction error:', error);
        const response = h.response({
            status: 'fail',
            message: `Terjadi kesalahan dalam melakukan prediksi`
        });
        response.code(500);
        return response;
    }
}

module.exports = postPredictHandler;
