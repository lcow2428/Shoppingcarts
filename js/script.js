const taxRate = 0.07; // Example tax rate
let cart = [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    } else {
        cart = [];
    }
}

// Add this function to handle checkout
function handleCheckout() {
    // Display a confirmation message
    alert('Order placed successfully');
    // Optionally, you might want to clear the cart after checkout
    cart = [];
    saveCart();
    updateCartDisplay();
}

async function fetchProducts() {
    try {
        const response = await fetch('json/data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function displayProducts(products) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ''; // Clear existing products

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(productElement);
    });
}

function addToCart(productId) {
    fetchProducts().then(products => {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.product.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ product, quantity: 1 });
        }
        saveCart();
        updateCartDisplay();
    });
}

function updateCartDisplay() {
    const cartTableBody = document.querySelector('#cart-table tbody');
    cartTableBody.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        document.getElementById('cart').style.display = 'none';
    } else {
        document.getElementById('cart').style.display = 'block';
        cart.forEach(cartItem => {
            const subtotal = cartItem.product.price * cartItem.quantity;
            total += subtotal;
            const cartRow = document.createElement('tr');
            cartRow.innerHTML = `
                <td>${cartItem.product.name}</td>
                <td>${cartItem.quantity}</td>
                <td>$${cartItem.product.price.toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td><button class="delete-item-btn" onclick="deleteCartItem(${cartItem.product.id})">Delete</button></td>
            `;
            cartTableBody.appendChild(cartRow);
        });
    }
    const totalPriceElement = document.getElementById('total-price');
    const totalPriceWithTax = total * (1 + taxRate);
    totalPriceElement.textContent = totalPriceWithTax.toFixed(2);
}

function deleteCartItem(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    saveCart();
    updateCartDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    fetchProducts().then(products => {
        if (products) {
            displayProducts(products);
        }
    });
    updateCartDisplay();
	
	// Get the checkout button and add click event listener
    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
});
