let controller = null;

async function searchProducts(query) {
    if (controller) {
        controller.abort();
    }
    
    controller = new AbortController();
    
    try {
        const response = await fetch(
            `https://dummyjson.com/products/search?q=${query}&limit=5`,
            {
                signal: controller.signal
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }
        
        const data = await response.json();
        const titles = data.products.map(p => p.title);
        console.log(titles);
        
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Запрос отменён');
        } else {
            console.error('Ошибка:', error.message);
        }
    }
}

function debounce(func, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const debouncedSearch = debounce(searchProducts, 700);

debouncedSearch('phone');

setTimeout(() => {
    debouncedSearch('smart');
}, 200);

setTimeout(() => {
    debouncedSearch('laptop');
}, 400);

setTimeout(() => {
    debouncedSearch('headphones');
}, 1200);