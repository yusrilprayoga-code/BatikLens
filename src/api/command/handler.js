const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore();

const searchPredictions = async (request, h) => {
    const { name } = request.params;
    const predictCollection = db.collection('predictions');
    const snapshot = await predictCollection.where('Name', '==', name).get();
    const predictions = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
        id: doc.id,
        prediction: {
            Name: data.Name,
            originName: data.originName,
            filosofi: data.filosofi,
            shortInsight: data.shortInsight,
            manufacturingMethod: data.manufacturingMethod,
            suggestion: data.suggestion,
            confidenceScore: data.confidenceScore,
            createdAt: data.createdAt,
        },
        };
    });
    
    const response = h.response({
        status: 'success',
        data: predictions,
    });
    response.code(200);
    return response;
};

module.exports = { searchPredictions };
