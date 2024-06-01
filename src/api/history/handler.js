const { Firestore } = require('@google-cloud/firestore');

const getHistoriesHandler = async (request, h) => {
    const db = new Firestore();
    const predictCollection = db.collection('predictions');
  
    try {
      const snapshot = await predictCollection.get();
      const histories = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          history: {
            result: data.result,
            createdAt: data.createdAt,
            suggestion: data.suggestion,
            id: data.id 
          }
        };
      });
  
      const response = h.response({
        status: 'success',
        data: histories 
      });
      response.code(200);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'error',
        message: error.message
      });
      response.code(500);
      return response;
    }
  };

  module.exports = getHistoriesHandler;