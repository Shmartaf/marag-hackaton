const Item = require('../models/item');
const { logger } = require('../logger');

const getAllItems = async () => {
  const items = await Item.find();
  logger.info(items.length ? `Fetched ${items.length} items.` : 'No items found.');
  return items;
};

const getItemByName = async (name) => {
  const item = await Item.findOne({ item_name: name });
  logger.info(`looking for item: ${name}`)
  if (item) {
    logger.info(`item found: ${name}`);
  } else {
    logger.info(`item could not be found: ${name}`);
  }
  return item;
};

const createItem = async (itemData) => {
  const newItem = new Item(itemData);
  await newItem.save();
  if (newItem) {
    logger.info(`Item created: ${newItem.item_name}`);
  }
  else {
    logger.info('Item could not be created');
  }
  return newitem;
};

const updateItem = async (name, itemData) => {
  const updatedItem = await Item.findOneAndUpdate({ item_name: name }, itemData, { new: true, runValidators: true });
  if (updatedItem) {
    logger.info(`Item updated: ${name}`);
  }
  else {
    logger.info('Item could not be updated');
  }
  return updatedItem;
};

const deleteItem = async (name) => {
  const deletedItem = await Item.findOneAndDelete({ item_name: name });
  if (deletedItem) {
    logger.info(`Item deleted: ${name}`);
  }
  else {
    logger.info('Item could not be deleted');
  }
  return deletedItem;
};

module.exports = {
  getAllItems,
  getItemByName,
  createItem,
  updateItem,
  deleteItem
};