from django.contrib import admin

from movies.models import Genre
from movies.models import Movie


admin.site.register(Genre)
admin.site.register(Movie)


