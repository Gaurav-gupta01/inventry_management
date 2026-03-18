const API_URL = '/api/products';
let editId = null; 

async function loadInventory() {
    try {
        const response = await fetch(`${API_URL}/all`);
        if (!response.ok) throw new Error('Could not fetch data');
        
        const products = await response.json();
        const tableBody = document.getElementById('inventoryBody');
        tableBody.innerHTML = '';

        if (products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Your inventory is empty.</td></tr>';
            return;
        }

        products.forEach(p => {
            const productJson = JSON.stringify(p).replace(/"/g, '&quot;');
            
            tableBody.innerHTML += `
                <tr>
                    <td><strong>#${p.id}</strong></td>
                    <td>${p.name}</td>
                    <td><span class="badge bg-info text-dark">${p.category}</span></td>
                    <td>₹${p.price.toFixed(2)}</td>
                    <td>${p.stockQuantity}</td>
                    <td class="text-center">
                        <button class="btn btn-outline-warning btn-sm me-2" onclick="editItem(${productJson})">Edit</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteItem(${p.id})">Delete</button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        console.error("Load Error:", error);
    }
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const product = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        price: parseFloat(document.getElementById('price').value),
        stockQuantity: parseInt(document.getElementById('stock').value)
    };

    const url = editId ? `${API_URL}/update/${editId}` : `${API_URL}/add`;
    const method = editId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            // alert(editId ? "Product Updated!" : "Product Added!");
            cancelEdit(); 
            loadInventory();
        } else {
            // alert("Action failed. Check backend logs.");
        }
    } catch (error) {
        console.error("Submit Error:", error);
    }
});

function editItem(product) {
    editId = product.id; 
    document.getElementById('name').value = product.name;
    document.getElementById('category').value = product.category;
    document.getElementById('price').value = product.price;
    document.getElementById('stock').value = product.stockQuantity;

    const submitBtn = document.querySelector('#productForm button');
    submitBtn.innerText = "Update Item";
    submitBtn.classList.replace('btn-success', 'btn-warning');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    editId = null;
    document.getElementById('productForm').reset();
    
    const submitBtn = document.querySelector('#productForm button');
    submitBtn.innerText = "Add Item";
    submitBtn.classList.replace('btn-warning', 'btn-success');
}

async function deleteItem(id) {
    if (confirm("Are you sure you want to delete this item?")) {
        try {
            const response = await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' });
            if (response.ok) {
                loadInventory();
            }
        } catch (error) {
            console.error("Delete Error:", error);
        }
    }
}
loadInventory();