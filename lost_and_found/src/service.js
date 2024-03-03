// src/services/InventoryService.js
const API_BASE_URL = `https://marag-hackaton.onrender.com/items`;

export async function getAll() {
    const response = await fetch(`${API_BASE_URL}`);
    return await response.json();
}

export async function get(name) {
    const response = await fetch(`${API_BASE_URL}/${name}`);
    return await response.json();
}

export async function add(supply) {
    const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(supply),
    });
    return await response.json();
}

export async function update(name, supply) {
    const response = await fetch(`${API_BASE_URL}/${name}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(supply),
    });
    return await response.json();
}

export async function delet(name) {
    const response = await fetch(`${API_BASE_URL}/${name}`, {
        method: "DELETE",
    });
    return await response.json();
}


getAll();
console.log(getAll());