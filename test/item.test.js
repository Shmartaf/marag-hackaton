const request = require('supertest');
const lostFound = require("../repository/lostFoundRep");
const app = require('../index'); 
const { describe, expect, it, jest } = require('../');
const ServerError = require('../errors/ServerError');

jest.mock("../repository/lostFoundRep");

describe('Items API Endpoints', () => {
  describe('GET /items', () => {
    it('returns all items', async () => {
      const mockItems = [{ item_name: 'Water', category: 'Core', unit_price: 2.80, supplier: "Sami", location: "Israel", quantity: 100 }, { item_name: 'Bandage', category: 'Medic', unit_price: 3.80, supplier: "Shimi", location: "Israel", quantity: 10 }];
      lostFound.getAllItems.mockResolvedValue(mockItems);
      const response = await request(app).get('/items');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockItems);
      expect(lostFound.getAllItems).toHaveBeenCalledTimes(1);
    });

    it('returns 404 when no items are found', async () => {
      lostFound.getAllItems.mockResolvedValue([]);
      const response = await request(app).get('/items');
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe('No items found.');
    });

    it('returns 500 when an error occurs', async () => {
      lostFound.getAllItems.mockRejectedValue(new ServerError());
      const response = await request(app).get('/items');
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Internal Server Error'); 
    });
  });

  describe('GET /items/:itemName', () => {
    it('returns a item by itemName', async () => {
      const mockItem = { item_name: 'Water', category: 'Core', unit_price: 2.80, supplier: "Sami", location: "Israel", quantity: 100 };
      lostFound.getItemByName.mockResolvedValue(mockItem);
      const response = await request(app).get('/items/Water');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockItem);
      expect(lostFound.getItemByName).toHaveBeenCalledWith('Water');
    });

    it('returns 404 if the item not found', async () => {
      lostFound.getItemByName.mockResolvedValue(null);
      const response = await request(app).get('/items/Water');
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe('Item not found');
    });

    it('returns 400 if itemName is not provided', async () => {
      const response = await request(app).get('/items/');
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Item name is required');
    });

    it('returns 500 when an error occurs', async () => {
      lostFound.getItemByName.mockRejectedValue(new ServerError());
      const response = await request(app).get('/items/Water');
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });

  describe('POST /items', () => {
    it('creates a new item', async () => {
      const mockItem = { item_name: 'Water', category: 'Core', unit_price: 2.80, supplier: "Sami", location: "Israel", quantity: 100 };
      lostFound.getItemByName.mockResolvedValue(null); 
      lostFound.createItem.mockResolvedValue(mockItem); 
            
      const response = await request(app).post('/items').send(mockItem);
            
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(mockItem);
      expect(lostFound.getItemByName).toHaveBeenCalledWith(mockItem.item_name);
      expect(lostFound.createItem).toHaveBeenCalledWith(mockItem);
      expect(lostFound.createItem).toHaveBeenCalledTimes(1);
    });

    it('returns 400 if item info is not provided', async () => {
      const response = await request(app).post('/items').send({});
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Missing data, make sure you fill all the required fields.');
    });

    it('returns 409 if conflict on itemName', async () => {
      const mockItem = { item_name: 'Water', category: 'Core', unit_price: 2.80, supplier: "Sami", location: 'Israel', quantity: 100 };
      lostFound.getItemByName.mockResolvedValue(mockItem);
      const response = await request(app).post('/items').send(mockItem);
      expect(response.statusCode).toBe(409);
      expect(response.text).toBe('A item with this name already exists.'); 
    });

    it('returns 500 when an error occurs', async () => {
      const mockItem = { item_name: 'Water', category: 'Core', unit_price: 2.80, supplier: "Sami", location: 'Israel', quantity: 100 };
      lostFound.getItemByName.mockRejectedValue(new ServerError());
      const response = await request(app).post('/items').send(mockItem);
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });

  describe('PUT /items/:itemName', () => {
    it('updates a item', async () => {
      const originalItem = { item_name: 'Water', category: 'Core', unit_price: 2.80, supplier: "Sami", location: 'Israel', quantity: 100 };
      const updatedItemData = { item_name: 'Water', unit_price: 22.80, supplier: "Sami2", location: 'Israel2', quantity: 1002 };
      lostFound.getItemByName.mockResolvedValue(originalItem);
      lostFound.updateItem.mockResolvedValue({ ...originalItem, ...updatedItemData });
            
      const response = await request(app).put(`/items/${originalItem.item_name}`).send(updatedItemData);
            
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(updatedItemData);
      expect(lostFound.updateItem).toHaveBeenCalledWith(originalItem.item_name, updatedItemData);
      expect(lostFound.updateItem).toHaveBeenCalledTimes(1);
    });

    it('returns 400 if item invalid data', async () => {
      const invalidData = {};
      const response = await request(app).put('/items/Water').send(invalidData);
      expect(response.statusCode).toBe(400);
      expect(response.text).toContain('Incomplete data for update.');
    });

    it('returns 409 if conflict on itemName', async () => {
      const existingItem = { item_name: 'ExistingWater', category: 'Core', unit_price: 2.80, supplier: "Sami", location: "Israel", quantity: 100 };
      const itemToUpdate = { item_name: 'ToBeUpdatedWater', category: 'Medical', unit_price: 3.50, supplier: "Danny", location: "USA", quantity: 50 };
        
      lostFound.createItem.mockResolvedValue(existingItem);
      lostFound.createItem.mockResolvedValue(itemToUpdate);
        

      const response = await request(app).put(`/items/${itemToUpdate.item_name}`).send(existingItem);
      
      await expect(response.statusCode).toBe(409);
      await expect(response.text).toContain('Item with the updated name already exists.');
    });

    it('returns 404 if item not found', async () => {
      const nonExistingItemName = 'NonExistingWater';
      const updateData = { item_name: 'NonExistingWaterUpdated', category: 'Core', unit_price: 2.80, supplier: "Sami", location: "Israel" };
        
      lostFound.getItemByName.mockResolvedValue(null); 
      lostFound.updateItem.mockResolvedValue(null); 
        
      const response = await request(app).put(`/items/${nonExistingItemName}`).send(updateData);
        
      expect(response.statusCode).toBe(404);
      expect(response.text).toContain('Item to update not found.');
    });      

    it('returns 500 when an error occurs', async () => {
      lostFound.getAllItems.mockRejectedValue(new ServerError());
      const response = await request(app).get('/items');
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
      
  });

  describe('DELETE /items/:itemName', () => {
    it('deletes a item', async () => {
      const itemNameToDelete = 'Water';
      lostFound.deleteItem.mockResolvedValue({ item_name: itemNameToDelete });
        
      const response = await request(app).delete(`/items/${itemNameToDelete}`);
        
      expect(response.statusCode).toBe(204); 
      expect(lostFound.deleteItem).toHaveBeenCalledWith(itemNameToDelete);
    });

    it('returns 404 if item not found', async () => {
      const nonExistingItemName = 'NonExistingWater';
      lostFound.deleteItem.mockResolvedValue(null);
        
      const response = await request(app).delete(`/items/${nonExistingItemName}`);
        
      expect(response.statusCode).toBe(404);
      expect(response.text).toContain('Item to delete not found');
      expect(lostFound.deleteItem).toHaveBeenCalledWith(nonExistingItemName);
    });

    it('returns 500 when an error occurs', async () => {
      const itemNameWithError = 'ErrorItem';
      lostFound.deleteItem.mockRejectedValue(new ServerError());
        
      const response = await request(app).delete(`/items/${itemNameWithError}`);
        
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
      expect(lostFound.deleteItem).toHaveBeenCalledWith(itemNameWithError);
    });
  });
});
