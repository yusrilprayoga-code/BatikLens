const homeHandler = (_request, h) => {
  return h
    .response({
      status: "success",
      message: "Home route",
    })
    .code(200);
};


module.exports = { homeHandler,};
