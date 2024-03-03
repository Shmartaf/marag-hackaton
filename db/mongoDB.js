const mongoose = require('mongoose');

const {logger} = require('../logger');

const connectDB = async () => {
  try {
    await mongoose.connect(//still need to edit this: xq0yhmm.mongodb.net 
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.xq0yhmm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );

    logger.info('MongoDB connected successfully.');

  } catch (error) {
    logger.error('Error connecting to MongoDB', error);
  }
};

module.exports = {connectDB};