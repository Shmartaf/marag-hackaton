import React, { useState, useEffect } from "react";
import { update, add } from "../service";

const SupplyForm = ({ selectedSupply, onSave }) => {
  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    date: "",
    location: "",
    description: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedSupply) {
      setFormData({
        item_name: selectedSupply.item_name || "",
        category: selectedSupply.category || "",
        date: selectedSupply.date || "",
        location: selectedSupply.location || "",
        description: selectedSupply.description || "",
      });
    }
  }, [selectedSupply]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSupply && selectedSupply._id) {
        const res = await update(selectedSupply.item_name, formData);
        if (res.error) {
          setError(res.error);
          return;
        }
      } else {
        const res = await add(formData);
        if (res.error) {
          setError(res.error);
          return;
        }
      }
      onSave();
    } catch (error) {
      console.error("Failed to save supply:", error);
      setError(error.response?.data?.message || "An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 text-red-600">
          <p>{error}</p>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="item_name" className="block text-sm font-bold mb-2">
          Item Name
        </label>
        <input
          type="text"
          id="item_name"
          name="item_name"
          value={formData.item_name}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-bold mb-2">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-bold mb-2">
          Date
        </label>
        <input
          type="text"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-bold mb-2">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <button type="submit" className="p-2 bg-blue-600 text-white rounded">
        {selectedSupply && selectedSupply._id ? "Update Supply" : "Add Supply"}
      </button>
    </form>
  );
};

export default SupplyForm;
