const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  item_name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
},{ versionKey: false});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;

// still need to add more keys depending on what we decide in database.