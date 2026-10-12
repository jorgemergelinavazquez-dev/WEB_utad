const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

export async function fetchMeals(query) {
    try {
        const response = await fetch(`${API_URL}${query}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.meals) {
            return [];
        }

        return data.meals;
    } catch (error) {
        throw error;
    }
}