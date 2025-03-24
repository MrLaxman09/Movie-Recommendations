const API_KEY = '4d182e89';
const SEARCH_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=`;
const moviesContainer = document.getElementById('movies');
const searchInput = document.getElementById('search');
const form = document.getElementById('form')
const favoritesButton = document.getElementById('favorites');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

async function fetchMovies(query) {
    moviesContainer.innerHTML = '<p>Loading...</p>'; // UX ke liye loading text

    let moviesWithDetails = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 5) { // 3 pages tak data fetch karega
        const res = await fetch(`${SEARCH_URL}${query}&page=${page}`);
        const data = await res.json();

        if (data.Search) {
            const moviesBatch = await Promise.all(
                data.Search.map(async (movie) => {
                    const detailsRes = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
                    const details = await detailsRes.json();
                    return { ...movie, imdbRating: details.imdbRating || 'N/A' };
                })
            );
            moviesWithDetails.push(...moviesBatch);
        } else {
            hasMore = false;
        }
        page++;
    }

    if (moviesWithDetails.length > 0) {
        displayMovies(moviesWithDetails);
    } else {
        moviesContainer.innerHTML = '<p>No movies found!</p>';
    }
}

async function fetchDefaultMovies() {
    moviesContainer.innerHTML = '<p>Loading movies...</p>'; // UX ke liye loading text

    let defaultQuery = "tech"; // Default movies ka keyword
    let moviesWithDetails = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 20) { // 4 pages tak data fetch karega (40 movies)
        const res = await fetch(`${SEARCH_URL}${defaultQuery}&page=${page}`);
        const data = await res.json();

        if (data.Search) {
            const moviesBatch = await Promise.all(
                data.Search.map(async (movie) => {
                    const detailsRes = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
                    const details = await detailsRes.json();
                    return { ...movie, imdbRating: details.imdbRating || 'N/A' };
                })
            );
            moviesWithDetails.push(...moviesBatch);
        } else {
            hasMore = false;
        }
        page++;
    }

    if (moviesWithDetails.length > 0) {
        displayMovies(moviesWithDetails);
    } else {
        moviesContainer.innerHTML = '<p>No movies found!</p>';
    }
}

// Page load hone par movies show karega
window.addEventListener("load", fetchDefaultMovies);

function displayMovies(movies) {
    moviesContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>⭐ ${movie.imdbRating}</p>
            <button class="fav-btn" onclick="toggleFavorite('${movie.imdbID}', '${movie.Title}', '${movie.Poster}', '${movie.imdbRating}')">⭐</button>
        `;
        
        // Movie pe click karne se naye page pe le jayega
        movieCard.addEventListener("click", () => {
            localStorage.setItem("selectedMovie", JSON.stringify(movie));
            window.location.reload();
        });
        
        moviesContainer.appendChild(movieCard);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = search.value

    if(searchTerm && searchTerm !== '') {
        fetchMovies(searchTerm)

        search.value = ''
    } else {
        window.location.reload()
    }

})


function toggleFavorite(id, title, poster, rating) {
    const index = favorites.findIndex(movie => movie.id === id);
    if (index === -1) {
        favorites.push({ id, title, poster, rating });
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
//remove favorites
function removeFavorite(id) {
    const index = favorites.findIndex(movie => movie.id === id);
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}



favoritesButton.addEventListener('click', () => {
    moviesContainer.innerHTML = '';
    if (favorites.length === 0) {
        moviesContainer.innerHTML = '<p>No favorites added yet!</p>';
        return;
    }
    favorites.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.rating}</p>
            
            <button class="fav-btn" onclick="removeFavorite('${movie.id}')">❌</button>
        `;
        moviesContainer.appendChild(movieCard);
        
    });
});
