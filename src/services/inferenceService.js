const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const isCancer = confidenceScore > 50;
        const classes = ['Non-cancer', 'Cancer'];

        const label = classes[isCancer ? 1 : 0];

        let suggestion;

        if (isCancer) {
            suggestion = 'Segera berkonsultasi dengan dokter spesialis kulit terdekat.';
        } else {
            suggestion = 'Tetap jaga kesehatan kulit Anda.';
        }

        return {
            label,
            confidenceScore,
            suggestion
        };

    } catch (error) {
        throw new InputError(`Terjadi kesalahan dalam melakukan prediksi`);
    }
}

module.exports = predictClassification;
