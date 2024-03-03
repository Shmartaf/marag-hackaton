class ConflictError extends Error {
  constructor(message = 'Conflict') {
    super(message);
    this.status = 409;
    this.name = 'ConflictError';
  }
}
  
module.exports = ConflictError;
  