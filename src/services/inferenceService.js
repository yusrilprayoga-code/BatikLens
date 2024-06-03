const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([256, 256])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const isBatik = confidenceScore > 50;
        const classes = ['bukan batik', 'batik'];

        const label = classes[isBatik ? 1 : 0];

        let suggestion;

        if (isBatik) {
            suggestion = 'Batik ditemukan pada gambar yang Anda unggah';
        } else {
            suggestion = 'Batik tidak ditemukan pada gambar yang Anda unggah';
        }

        return {
            label,
            confidenceScore,
            suggestion
        };

    } catch (error) {
        throw new InputError(`Terjadi kesalahan dalam melakukan prediksi: ${error.message}`);
    }
}

module.exports = predictClassification;
