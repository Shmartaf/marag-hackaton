class ServerError extends Error {
  constructor(message = 'Internal Server Error') {
    super(message);
    this.status = 500;
    this.name = 'ServerError';
  }
}
  
module.exports = ServerError;
  