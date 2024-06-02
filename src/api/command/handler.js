const searchPredictions = async (request, h) => {
    const { query } = request.query;
    const predictions = await searchPredictions(query);
    return h.response(predictions).code(200);
}

module.exports = { searchPredictions };