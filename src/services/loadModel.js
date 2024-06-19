const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    // return tf.loadLayersModel(
    //     `file://${process.cwd()}/src/rekomendasi/model.json`
    // );
    return tf.loadLayersModel(process.env.MODEL_URL);
}
 
module.exports = loadModel;