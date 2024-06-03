const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    return tf.loadLayersModel(
        `file://${process.cwd()}/src/batikmodel/model.json`
    );
    // return tf.loadGraphModel(process.env.MODEL_URL);
}
 
module.exports = loadModel;