// Call the main functions the page is loaded
window.onload = () => {
    getOriginals()
    getTrendingNow()
    getTopRated()
  }
  
  // ** Helper function that makes dynamic API calls **
  // path_type 👉 (backdrop, poster)
  // dom_element 👉 (trending, top rated)
  // fetchMovies('https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1', 'top_rated', 'backdrop_path')
  function fetchMovies(url, dom_element, path_type) {
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('something went wrong')
        }
      })
      .then(data => {
        showMovies(data, dom_element, path_type)
      })
      .catch(error_data => {
        console.log(error_data)
      })
  }
  
  //  ** Function that displays the movies to the DOM **
  showMovies = (movies, dom_element, path_type) => {
    
    // Create a variable that grabs id or class
    var moviesEl = document.querySelector(dom_element)
  
    // Loop through object
    for (var movie of movies.results) {
  
      // Within loop create an img element
      var imageElement = document.createElement('img')
  
      // Set attribute
      imageElement.setAttribute('data-id', movie.id)
  
      // Set source
      imageElement.src = `https://image.tmdb.org/t/p/original${movie[path_type]}`
  
      // Add event listener to handleMovieSelection() onClick
      imageElement.addEventListener('click', e => {
        handleMovieSelection(e)
      })
      // Append the imageElement to the dom_element selected
      moviesEl.appendChild(imageElement)
    }
  }
  
  // ** Function that fetches Netflix Originals **
  function getOriginals() {
    var url =
      'https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213'
    fetchMovies(url, '.original__movies', 'poster_path')
  }
  // ** Function that fetches Trending Movies **
  function getTrendingNow() {
    var url =
      'https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045'
    fetchMovies(url, '#trending', 'backdrop_path')
  }
  // ** Function that fetches Top Rated Movies **
  function getTopRated() {
    var url =
      'https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1'
    fetchMovies(url, '#top_rated', 'backdrop_path')
  }
  
  // ** BONUS **
  
  async function getMovieTrailer(id) {
    var url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`
    return await fetch(url).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('something went wrong')
      }
    })
  }
  
  const setTrailer = trailers => {
    const iframe = document.getElementById('movieTrailer')
    const movieNotFound = document.querySelector('.movieNotFound')
    if (trailers.length > 0) {
      movieNotFound.classList.add('d-none')
      iframe.classList.remove('d-none')
      iframe.src = `https://www.youtube.com/embed/${trailers[0].key}`
    } else {
      iframe.classList.add('d-none')
      movieNotFound.classList.remove('d-none')
    }
  }
  
  const handleMovieSelection = e => {
    const id = e.target.getAttribute('data-id')
    const iframe = document.getElementById('movieTrailer')
    // here we need the id of the movie
    getMovieTrailer(id).then(data => {
      const results = data.results
      const youtubeTrailers = results.filter(result => {
        if (result.site == 'YouTube' && result.type == 'Trailer') {
          return true
        } else {
          return false
        }
      })
      setTrailer(youtubeTrailers)
    })
  
    // open modal
    $('#trailerModal').modal('show')
    // we need to call the api with the ID
  }
  