const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

export async function fetchMeals(query) {
    const cacheKey = `busqueda_${query}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    try {
        const response = await fetch(`${API_URL}${query}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.meals) {
            return [];
        }

        localStorage.setItem(cacheKey, JSON.stringify(data.meals));

        return data.meals;
    } catch (error) {
        throw error;
    }
}