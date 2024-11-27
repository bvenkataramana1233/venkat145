let products = [];
const itemsPerPage = 4;
let currentPage = 1;
let selectedCategories = [];
let searchTerm = '';

const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

async function fetchProducts() {
    document.getElementById('loader').style.display = 'flex';
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        products = await response.json();
        displayProducts(currentPage);
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        document.getElementById('loader').style.display = 'none';
    }
}

function filterProducts() {
    let filteredProducts = products;

    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category)
        );
    }

    return filteredProducts;
}

function displayProducts(page, sortBy = 'default') {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    let filteredProducts = filterProducts();

    if (sortBy === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    paginatedProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}" style="width:100%; height:auto;">
            <h3>${truncateTitle(product.title, 30)}</h3>
            <p>$${product.price.toFixed(2)}</p>
        `;
        productList.appendChild(productDiv);
    });

    document.getElementById('page-info').innerText = ` ${page} of ${Math.ceil(filteredProducts.length / itemsPerPage)}`;
    
    document.getElementById('prev').disabled = page === 1;
    document.getElementById('next').disabled = page === Math.ceil(filteredProducts.length / itemsPerPage);
}

function truncateTitle(title, maxChars) {
    return title.length > maxChars ? title.slice(0, maxChars) + '...' : title;
}

document.getElementById('sort').addEventListener('change', function() {
    const sortValue = this.value;
    currentPage = 1;
    displayProducts(currentPage, sortValue);
});

const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            selectedCategories.push(this.value);
        } else {
            selectedCategories = selectedCategories.filter(category => category !== this.value);
        }
        currentPage = 1;
        displayProducts(currentPage, document.getElementById('sort').value);
    });
});

document.getElementById('searchInput').addEventListener('input', function() {
    searchTerm = this.value;
    currentPage = 1;
    displayProducts(currentPage, document.getElementById('sort').value);
});

document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayProducts(currentPage, document.getElementById('sort').value);
    }
});

document.getElementById('next').addEventListener('click', () => {
    const totalPages = Math.ceil(filterProducts().length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayProducts(currentPage, document.getElementById('sort').value);
    }
});
function updateBannerImage() {
    const bannerImage = document.getElementById('bannerImage');
    if (selectedCategories.length === 0) {
        bannerImage.src = 'mens-clothing-banner.jpg'; // Default banner image
    } else {
        if (selectedCategories.includes('electronics')) {
            bannerImage.src = 'electronics-banner.jpg';
        } else if (selectedCategories.includes('jewelery')) {
            bannerImage.src = 'jewelery-banner.jpg';
        } else if (selectedCategories.includes('men\'s clothing')) {
            bannerImage.src = 'mens-clothing-banner.jpg';
        } else if (selectedCategories.includes('women\'s clothing')) {
            bannerImage.src = 'womens-clothing-banner.jpg';
        }
    }
}

fetchProducts();
