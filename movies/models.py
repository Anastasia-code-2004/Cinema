from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from datetime import date


class Genre(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Жанр'
        verbose_name_plural = 'Жанры'


class Movie(models.Model):
    title = models.CharField('Название', max_length=100)
    title_eng = models.CharField('Название на английском', max_length=100, default='')
    description = models.TextField('Описание')
    duration = models.PositiveIntegerField('Длительность', default=0, validators=[MinValueValidator(0),
                                                                                  MaxValueValidator(200)],
                                           help_text='указывать длительность в минутах')
    poster = models.ImageField('Постер', upload_to="movies/")
    date = models.DateField('Дата выхода', default=date(2024, 1, 1))
    country = models.CharField('Страна', max_length=30)
    genres = models.ManyToManyField(Genre, verbose_name='жанры')
    rating = models.PositiveSmallIntegerField('Значение рейтинга', default=0, validators=[MinValueValidator(0),
                                                                                          MaxValueValidator(10)])
    budget = models.PositiveIntegerField('Бюджет', default=0,
                                         help_text="указывать сумму в долларах USD")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Фильм'
        verbose_name_plural = 'Фильмы'
