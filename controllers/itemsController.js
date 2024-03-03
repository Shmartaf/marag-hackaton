const lostFoundRepository = require('../repository/lostFoundRep');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const { logger } = require('../logger');

// Validate input for create
const validateItemData = (data) => data.category && data.unit_price && data.quantity && data.supplier && data.location && data.item_name;
// Validate input for update
const validateUpdateItemData = (data) => data.category || data.unit_price || data.quantity || data.supplier || data.location || data.expiration_date || data.item_name;

const getAllItems = async (req, res, next) => {
  try {
    const allItems = await lostFoundRepository.getAllItems();
    if (allItems.length === 0) {
      logger.info('No items found.');
      return res.status(404).send('No items found.');
    }
    res.status(200).json(allItems);
  } catch (error) {
    next(error);
  }
};

const getItemByName = async (req, res, next) => {
  try {
    if (!req.params.itemName || req.params.itemName.trim() === '' || req.params.itemName === undefined || req.params.itemName === null) {
      throw new BadRequestError('Item name is required.');
    }
    const item = await lostFoundRepository.getItemByName(req.params.itemName);
    if (!item) {
      throw new NotFoundError('Item not found');
    }
    res.status(200).json(item);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).send(error.message);
    }
    if (error instanceof BadRequestError) {
      return res.status(400).send(error.message);
    }
    next(error);
  }
};

const createItem = async (req, res, next) => {
  if (!validateItemData(req.body)) {
    return res.status(400).send('Missing data, make sure you fill all the required fields.');
  }
  try {
    const existingItem = await lostFoundRepository.getItemByName(req.body.item_name);
    if (existingItem) {
      logger.info('A item with this name already exists.');
      throw new ConflictError('A item with this name already exists.');
    }y
    const newItem = await lostFoundRepository.createItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    if (error instanceof ConflictError) {
      return res.status(409).send(error.message);
    }
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  if (!validateUpdateItemData(req.body)) {
    return res.status(400).send('Incomplete data for update.');
  }
  if (((typeof req.body.quantity !== 'undefined') && (req.body.quantity < 0 || isNaN(req.body.quantity))) || 
    ((typeof req.body.unit_price !== 'undefined') && (req.body.unit_price < 0 || isNaN(req.body.unit_price)))) {
    logger.info('Quantity and unit price must be positive numbers.');
    return res.status(400).send('Quantity and unit price must be positive numbers.');
  }
  if (req.paramitemName) {
    const findItem = await lostFoundRepository.getItemByName(req.params.itemName);
    if(!findItem) {
      logger.info('Item to update not found.');
      return res.status(404).send('Item to update not found.');
    }
  }
  if (req.body.item_name) {
    const exsist = await lostFoundRepository.getItemByName(req.body.item_name);
    if (exsist) {
      if (exsist.item_name !== req.params.itemName) {
        logger.info('Item with the updated name already exists.');
        return res.status(409).send('Item with the updated name already exists.');
      }
    }
  }
  try {
    const updatedItem = await lostFoundRepository.updateItem(req.params.itemName, req.body);
    res.status(200).json(updatedItem);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).send(error.message);
    } if (error instanceof ConflictError) {
      return res.status(409).send(error.message);   
    } if (error instanceof BadRequestError) {
      return res.status(400).send(error.message);
    }
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const deletedItem = await lostFoundRepository.deleteItem(req.params.itemName);
    if (!deletedItem) {
      throw new NotFoundError('Item to delete not found.');
    }
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).send(error.message);
    }
    next(error);
  }
};

module.exports = {
  getAllItems,
  getItemByName,
  createItem,
  updateItem,
  deleteItem
};
