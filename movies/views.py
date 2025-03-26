from django.shortcuts import render, get_object_or_404
from .models import Movie, Genre
from tmdbv3api import TMDb, Movie as MovieAPI
import logging


def moviesView(request):
    genre_filter = request.GET.get('genre')
    all_movies = Movie.objects.all()
    all_genres = Genre.objects.all()

    if genre_filter:
        all_movies = all_movies.filter(genres__name=genre_filter)

    return render(request, 'movies/movies.html', {'all_movies': all_movies, 'all_genres': all_genres})


def movieDetailsView(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    tmdb = TMDb()
    tmdb.api_key = '337738dace298ccef130288cd6fcf52c'
    movie_API = MovieAPI()
    tmdb_movie = movie_API.search(movie.title)
    if tmdb_movie:
        tmdb_movie = tmdb_movie[0]
    else:
        tmdb_movie = None
        logging.error(f"Movie {movie.title} not found on TMDB.")
    return render(request, 'movies/movie_details.html', {'movie': movie, 'tmdb_movie': tmdb_movie})

