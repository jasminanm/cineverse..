document.getElementById('generate-movie').addEventListener('click', function() {
  const tipo = document.getElementById('tipo').value.toLowerCase();
  const genero = document.getElementById('genero').value;
  const ano = document.getElementById('ano').value;

  const apiKey = 'ed7096a6838c6fc301d4307e2994b3b5';
  const baseURL = 'https://api.themoviedb.org/3';

  const tipoMap = {
      'live action': 'movie',
      'animado': 'movie'
  };

  const tipoParam = tipoMap[tipo] || 'movie';

  const queryParams = new URLSearchParams({
      api_key: apiKey,
      with_genres: genero,
      primary_release_year: ano,
      page: 1
  });

  fetch(`${baseURL}/discover/${tipoParam}?${queryParams}`)
      .then(response => response.json())
      .then(data => {
          if (data.results && data.results.length > 0) {
              const topMovies = data.results.slice(0, 10);
              localStorage.setItem('movies', JSON.stringify(topMovies));
              window.location.href = 'recomendation.html';
          } else {
              alert('Desculpe, não encontramos nenhum filme com esses critérios.');
          }
      })
      .catch(error => {
          console.error('Erro ao buscar filme:', error);
          alert('Ocorreu um erro ao buscar o filme. Por favor, tente novamente mais tarde.');
      });
});
document.addEventListener('DOMContentLoaded', function() {
  const movies = JSON.parse(localStorage.getItem('movies'));
  const movieList = document.getElementById('movie-list');
  const featuredContent = document.getElementById('featured-content');

  function getRandomMovie(movies) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      return movies[randomIndex];
  }

  if (movies && movies.length > 0) {
      // Seleciona um filme aleatório e exibe no contêiner destacado
      const randomMovie = getRandomMovie(movies);
      featuredContent.innerHTML = `
          <div class="movie-container">
              <img src="https://image.tmdb.org/t/p/w500${randomMovie.poster_path}" alt="${randomMovie.title}">
              <h2>${randomMovie.title}</h2>
              <p>${movie.overview}</p>
              <p>Avaliação: ${movie.vote_average}</p>

          </div>
      `;

      // Exibe os filmes na lista
      movies.forEach(movie => {
          const movieItem = document.createElement('li');
          movieItem.classList.add('movie-item');
          movieItem.innerHTML = `
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
              <h2>${movie.title}</h2>
              <p>${movie.overview}</p>
              <p>Avaliação: ${movie.vote_average}</p>
          `;
          movieList.appendChild(movieItem);
      });
  } else {
      movieList.innerHTML = '<p>Desculpe, não encontramos nenhum filme com esses critérios.</p>';
  }
});
document.addEventListener('DOMContentLoaded', function() {
  const movies = JSON.parse(localStorage.getItem('movies'));
  const movieList = document.getElementById('movie-list');
  const featuredContent = document.getElementById('featured-content');

  function getRandomMovie(movies) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      return movies[randomIndex];
  }

  if (movies && movies.length > 0) {
      
      const randomMovie = getRandomMovie(movies);
      featuredContent.innerHTML = `
          <div class="movie-container">
              <img src="https://image.tmdb.org/t/p/w500${randomMovie.poster_path}" alt="${randomMovie.title}">
              <h2>${randomMovie.title}</h2>
              <p>${randomMovie.overview}</p>
              <p>Avaliação: ${randomMovie.vote_average}</p>
          </div>
      `;
      
      movies.forEach(movie => {
          const movieItem = document.createElement('li');
          movieItem.classList.add('movie-item');
          movieItem.innerHTML = `
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
              <div>
                  <h2>${movie.title}</h2>
                  <p>${movie.overview}</p>
                  <p>Avaliação: ${movie.vote_average}</p>
              </div>
          `;
          movieList.appendChild(movieItem);
      });
  } else {
      movieList.innerHTML = '<p>Desculpe, não encontramos nenhum filme com esses critérios.</p>';
  }
});
//Fetch and Display Movies Data with Charts
async function initMovieDataAndCharts() {
  const apiKey = 'ed7096a6838c6fc301d4307e2994b3b5';
  const genres = {
    28: 'Ação',
    35: 'Comédia',
    18: 'Drama',
    27: 'Terror',
    10749: 'Romance'
  };

  const genreCounts = await fetchMoviesByGenre();
  const movies = await fetchMovies();

  const genreLabels = Object.keys(genreCounts);
  const genreData = Object.values(genreCounts);
  const totalMovies = genreData.reduce((sum, value) => sum + value, 0);

  renderBarChart(genreLabels, genreData);
  renderPieChart(genreLabels, genreData, totalMovies);
  displayMovieRatings(movies);

  async function fetchMoviesByGenre() {
    let genreCounts = { 'Ação': 0, 'Comédia': 0, 'Drama': 0, 'Terror': 0, 'Romance': 0 };

    for (const genreId in genres) {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&year=2023`);
      const data = await response.json();
      genreCounts[genres[genreId]] = data.total_results;
    }

    return genreCounts;
  }

  async function fetchMovies() {
    const movieIds = [550, 551, 552, 553, 554]; // Example movie IDs
    const movies = [];

    for (const movieId of movieIds) {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
      const data = await response.json();
      movies.push({ title: data.title, rating: data.vote_average });
    }

    return movies;
  }

  function renderBarChart(labels, data) {
    const ctxBar = document.getElementById('barChart').getContext('2d');
    new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Movies',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  function renderPieChart(labels, data, totalMovies) {
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    new Chart(ctxPie, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Número de filmes',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              generateLabels: (chart) => {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    const percentage = ((value / totalMovies) * 100).toFixed(2) + '%';
                    return {
                      text: `${label}: ${percentage}`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      strokeStyle: data.datasets[0].borderColor[i],
                      lineWidth: data.datasets[0].borderWidth,
                      hidden: !chart.getDataVisibility(i),
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          },
          title: {
            display: true,
            text: 'Percentagem de géneros de filmes em 2023'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw;
                const percentage = ((value / totalMovies) * 100).toFixed(2);
                return `${context.label}: ${percentage}%`;
              }
            }
          }
        }
      }
    });
  }

  function displayMovieRatings(movies) {
    const ratings = movies.map(movie => movie.rating);
    const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
    const bestRating = Math.max(...ratings);
    const worstRating = Math.min(...ratings);

    const movieList = document.getElementById('movieList');
    movies.forEach(movie => {
      const listItem = document.createElement('li');
      listItem.textContent = `${movie.title}: ${movie.rating}`;
      movieList.appendChild(listItem);
    });

    document.getElementById('avgRating').textContent = avgRating;
    document.getElementById('bestRating').textContent = bestRating;
    document.getElementById('worstRating').textContent = worstRating;
  }
}
document.addEventListener('DOMContentLoaded', async function() {
  const apiKey = 'ed7096a6838c6fc301d4307e2994b3b5';
  const genres = {
    28: 'Ação',
    35: 'Comédia',
    18: 'Drama',
    27: 'Terror',
    10749: 'Romance'
  };

  // Buscar dados na Api
  async function fetchMoviesByGenre() {
    let genreCounts = { 'Ação': 0, 'Comédia': 0, 'Drama': 0, 'Terror': 0, 'Romance': 0 };

    for (const genreId in genres) {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&year=2023`);
      const data = await response.json();
      genreCounts[genres[genreId]] = data.total_results;
    }

    return genreCounts;
  }

  // Buscar na Api
  async function fetchMovies() {
    const movieIds = [550, 551, 552, 553, 554]; 
    const movies = [];

    for (const movieId of movieIds) {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
      const data = await response.json();
      movies.push({ title: data.title, rating: data.vote_average });
    }

    return movies;
  }

  const genreCounts = await fetchMoviesByGenre();
  const movies = await fetchMovies();

  
  const genreLabels = Object.keys(genreCounts);
  const genreData = Object.values(genreCounts);
  const totalMovies = genreData.reduce((sum, value) => sum + value, 0);

  //Gráfico de barra
  const ctxBar = document.getElementById('barChart').getContext('2d');
  new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: genreLabels,
      datasets: [{
        label: 'Number of Movies',
        data: genreData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Circular
  const ctxPie = document.getElementById('pieChart').getContext('2d');
  new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: genreLabels,
      datasets: [{
        label: 'Número de filmes',
        data: genreData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            generateLabels: (chart) => {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i];
                  const percentage = ((value / totalMovies) * 100).toFixed(2) + '%';
                  return {
                    text: `${label}: ${percentage}`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    strokeStyle: data.datasets[0].borderColor[i],
                    lineWidth: data.datasets[0].borderWidth,
                    hidden: !chart.getDataVisibility(i),
                    index: i
                  };
                });
              }
              return [];
            }
          }
        },
        title: {
          display: true,
          text: 'Percentagem de géneros de filmes em 2023'
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw;
              const percentage = ((value / totalMovies) * 100).toFixed(2);
              return `${context.label}: ${percentage}%`;
            }
          }
        }
      }
    }
  });

  // Fórmula
  const ratings = movies.map(movie => movie.rating);
  const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  const bestRating = Math.max(...ratings);
  const worstRating = Math.min(...ratings);

  // Nome e avaliação
  const movieList = document.getElementById('movieList');
  movies.forEach(movie => {
    const listItem = document.createElement('li');
    listItem.textContent = `${movie.title}: ${movie.rating}`;
    movieList.appendChild(listItem);
  });

  //média
  document.getElementById('avgRating').textContent = avgRating;
  document.getElementById('bestRating').textContent = bestRating;
  document.getElementById('worstRating').textContent = worstRating;
});
