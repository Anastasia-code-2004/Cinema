from django.core.files.uploadedfile import SimpleUploadedFile

from movies.models import Genre, Movie
from django.test import TestCase


class TestGenreModel(TestCase):
    def setUp(self):
        self.genre1 = Genre.objects.create(
            name='Test Genre',
            description='Test Description',
        )

    def test_genre_creation(self):
        self.assertEqual(self.genre1.name, 'Test Genre')
        self.assertEqual(self.genre1.description, 'Test Description')

    def test_genre_str(self):
        self.assertEqual(str(self.genre1), 'Test Genre')


class TestMovieModel(TestCase):
    def setUp(self):
        self.genre1 = Genre.objects.create(name='Test Genre', description='Test Description')
        # Create a simple image file for the 'poster' field
        with open('media/images/kinozal.jpg', 'rb') as file:
            poster_file = SimpleUploadedFile(file.name, file.read(), content_type='image/jpeg')
        self.movie1 = Movie.objects.create(
            title='Test Movie',
            title_eng='Test Movie Eng',
            description='Test Description',
            duration=120,
            poster=poster_file,
            date='2022-01-01',
            country='Test Country',
            rating=5,
            budget=1000000,
        )
        self.movie1.genres.set([self.genre1])

    def test_movie_creation(self):
        self.assertEqual(self.movie1.title, 'Test Movie')
        self.assertEqual(self.movie1.title_eng, 'Test Movie Eng')
        self.assertEqual(self.movie1.description, 'Test Description')
        self.assertEqual(self.movie1.duration, 120)
        self.assertEqual(self.movie1.date, '2022-01-01')
        self.assertEqual(self.movie1.country, 'Test Country')
        self.assertEqual(self.movie1.rating, 5)
        self.assertEqual(self.movie1.budget, 1000000)
        self.assertTrue(self.movie1.poster)
        self.assertEqual(list(self.movie1.genres.all()), [self.genre1])

    def test_movie_str(self):
        self.assertEqual(str(self.movie1), 'Test Movie')
