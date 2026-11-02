export function renderMeals(meals, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (meals.length === 0) {
        container.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    const htmlString = meals.reduce((acc, meal) => {
        return acc + `
            <article class="meal-card">
                <img src="${meal.image}" alt="${meal.name}" width="200">
                <h2>${meal.name}</h2>
                <p>Categoría: ${meal.category}</p>
                <p>Origen: ${meal.origin}</p>
            </article>
        `;
    }, '');

    container.innerHTML = htmlString;
}

export function toggleVisibility(elementId, show) {
    const element = document.getElementById(elementId);
    element.style.display = show ? 'block' : 'none';
}

export function showError(message) {
    const errorContainer = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorContainer.style.display = 'block';
}