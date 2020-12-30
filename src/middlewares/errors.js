// Handle any errors that come up
exports.errorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ 'message': err.message });
  }
  else {
    console.error(err.message);
    res.status(500).send({ message: 'Internal server error' });
  }
}

// Handle case where user requests nonexistent endpoint
exports.nullRoute = (req, res, next) => {
  res.status(404).send({ message: 'Not found' });
}

// Create an error for the api error handler
exports.newHttpError = (status, message) => {
  let err;

  // Eliminates problem where a null message would get passed in and the final
  // error message would become 'null' (stringified null)
  // TODO fix this
  if (message == null) {
    err = new Error();
  }
  else {
    err = new Error(message);
  }

  err.status = status;
  return err;
}