const API_KEY = '4d182e89';
        const SEARCH_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=`;
        const moviesContainer = document.getElementById('movies');
        const searchInput = document.getElementById('search');
        const favoritesButton = document.getElementById('favorites');
        
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        async function fetchMovies(query) {
            const res = await fetch(`${SEARCH_URL}${query}`);
            const data = await res.json();
            if (data.Search) {
                displayMovies(data.Search);
            } else {
                moviesContainer.innerHTML = '<p>No movies found!</p>';
            }
        }
        
        console.log(API_KEY)
        function displayMovies(movies) {
            moviesContainer.innerHTML = '';
            movies.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.innerHTML = `
                    <img src="${movie.Poster}" alt="${movie.Title}">
                    <h3>${movie.Title}</h3>
                    <p>⭐ ${movie.imdbRating || 'N/A'}</p>
                    <button class="fav-btn" onclick="toggleFavorite('${movie.imdbID}', '${movie.Title}', '${movie.Poster}', '${movie.imdbRating || 'N/A'}')">⭐</button>
                `;
                moviesContainer.appendChild(movieCard);
            });
        }
        
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value;
            if (searchTerm && searchTerm.trim() !== '') {
                fetchMovies(searchTerm);
            } else {
                moviesContainer.innerHTML = '<p>Type a movie name to search...</p>';
            }
        });
        
        function toggleFavorite(id, title, poster, rating) {
            const index = favorites.findIndex(movie => movie.id === id);
            if (index === -1) {
                favorites.push({ id, title, poster, rating });
            } else {
                favorites.splice(index, 1);
            }
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
                `;
                moviesContainer.appendChild(movieCard);
            });
        });