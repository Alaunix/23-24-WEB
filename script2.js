async function fetchWithTimeout(url, timeoutMs = 5000) {
    const controller = new AbortController();
    const { signal } = controller;
    
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeoutMs);
    
    try {
        const response = await fetch(url, { signal });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.products && data.products.length > 0) {
            console.log(data.products[0].title);
        } else {
            console.log(data);
        }
        
        return data;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            console.log(`Таймаут: запрос не выполнился за ${timeoutMs}мс`);
        } else {
            console.log(error.message);
        }
        throw error;
    }
}

fetchWithTimeout('https://dummyjson.com/products?delay=2000&limit=2', 5000);

fetchWithTimeout('https://dummyjson.com/products?delay=6000&limit=2', 3000);