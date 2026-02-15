import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';
import addRecipeView from './views/addRecipeView.js';
import recipeView from './views/recipeView.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    cookingTime: +recipe.cooking_time,
    image: recipe.image_url,
    title: recipe.title,
    sourceUrl: recipe.source_url,
    servings: +recipe.servings,
    publisher: recipe.publisher,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    // console.log(data);
    // let { recipe } = data.data;
    state.recipe = createRecipeObject(data);
    console.log(state.recipe);
    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
  //   console.log(state.recipe);
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        publisher: rec.publisher,
        image: rec.image_url,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    // console.log(state.search.results);
  } catch (err) {
    throw err;
  }
};

// loadSearchResults('burger');

const persistBookmarks = function () {
  localStorage.setItem('Bookmarks', JSON.stringify(state.bookmarks));
};

export const searchResultsPerPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * 10;
  const end = page * 10;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // console.log('Hi 🐣🐥');
  const index = state.bookmarks.find(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(ing => ing[0].startsWith('ingredient') && ing[1] !== '')
      .map(ing => {
        const ingArr = ([quantity, unit, description] = ing[1]
          .replaceAll(' ', '')
          .split(','));
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient format. Please use the correct format'
          );
        }
        return { quantity: quantity ? +quantity : '', unit, description };
      });

    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      servings: +newRecipe.servings,
      publisher: newRecipe.publisher,
      ingredients: ingredients,
      key: API_KEY,
    };

    // console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    // create recipe object
    state.recipe = createRecipeObject(data);

    // add bookmark
    addBookmark(state.recipe);

    // renderthe uploaded recipe
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('Bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
