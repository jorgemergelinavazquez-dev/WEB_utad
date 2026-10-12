import { fetchMeals } from './api.js';
import { transformMealsData } from './transform.js';
import { renderMeals, toggleVisibility, showError } from './ui.js';

const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const query = input.value.trim();
    if (!query) return;

    toggleVisibility('error', false);
    toggleVisibility('loading', true);
    document.getElementById('results').innerHTML = '';

    try {
        const rawMeals = await fetchMeals(query);
        const processedMeals = transformMealsData(rawMeals);
        renderMeals(processedMeals, 'results');
    } catch (error) {
        showError('Hubo un problema al comunicar con el servidor.');
    } finally {
        toggleVisibility('loading', false);
    }
});