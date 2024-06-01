const { Firestore } = require('@google-cloud/firestore');

const storeData = async (id, data) => {
  const db = new Firestore();
  const predictCollection = db.collection('predictions');

  try {
    await predictCollection.doc(id).set(data);
    return {
      status: 'success',
      message: 'Data stored successfully'
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }

};

module.exports = storeData;
