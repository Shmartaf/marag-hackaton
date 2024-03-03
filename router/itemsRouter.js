const express = require('express');

const router = express.Router();
const itemsController = require('../controllers/itemController');

router.get('/', itemsController.getAllitems);

router.get('/:itemName', itemsController.getItemByName);

router.post('/', itemsController.createItem);

router.put('/:itemName', itemsController.updateItem);

router.delete('/:itemName', itemsController.deleteItem);

module.exports = router;
