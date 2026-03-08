async function fetchWithRetry(url, retries = 3, delay = 800) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Попытка ${attempt}...`);
            
            const response = await fetch(url);
            
            if (response.status >= 500 && attempt < retries) {
                console.log(`Серверная ошибка ${response.status}, повтор через ${delay * attempt}мс`);
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
                continue;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.products) {
                console.log(`Успех! Получено продуктов: ${data.products.length}`);
            } else {
                console.log('Успех!', data);
            }
            
            return data;
            
        } catch (error) {
            console.log(`Ошибка: ${error.message}`);
            
            if (attempt < retries) {
                console.log(`Повтор через ${delay * attempt}мс...`);
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            } else {
                console.log('Все попытки исчерпаны');
                throw error;
            }
        }
    }
}

fetchWithRetry('https://dummyjson.com/products?delay=1500&limit=3', 3, 800);