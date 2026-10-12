export function transformMealsData(meals) {
    return meals
        .filter(meal => meal.strMealThumb && meal.strCategory)
        .map(meal => ({
            id: meal.idMeal,
            name: meal.strMeal,
            image: meal.strMealThumb,
            category: meal.strCategory,
            origin: meal.strArea
        }));
}