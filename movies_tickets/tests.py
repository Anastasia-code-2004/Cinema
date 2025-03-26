from django.test import TestCase


class TestHallModel(TestCase):
    def setUp(self):
        self.hall = Hall.objects.create(name='Test Hall', capacity=100)

    def test_hall_creation(self):
        self.assertEqual(self.hall.name, 'Test Hall')
        self.assertEqual(self.hall.capacity, 100)

    def test_hall_str(self):
        self.assertEqual(str(self.hall), 'Зал Test Hall')


from django.test import TestCase
from movies.models import Movie
from movies_tickets.models import Hall, Showtime
from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import datetime

class TestShowtimeModel(TestCase):
    def setUp(self):
        self.hall = Hall.objects.create(name='Test Hall', capacity=100)
        with open('media/images/cinema.jpg', 'rb') as file:
            poster_file = SimpleUploadedFile(file.name, file.read(), content_type='image/jpeg')
        self.movie = Movie.objects.create(
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
        self.showtime = Showtime.objects.create(
            movie=self.movie,
            hall=self.hall,
            start_time=datetime.strptime('2022-01-01T10:00:00Z', "%Y-%m-%dT%H:%M:%SZ"),
            available_seats=50,
            price=10.00
        )
    def test_showtime_creation(self):
        self.assertEqual(self.showtime.movie, self.movie)
        self.assertEqual(self.showtime.hall, self.hall)
        self.assertEqual(self.showtime.start_time.strftime("%Y-%m-%dT%H:%M:%SZ"), '2022-01-01T10:00:00Z')
        self.assertEqual(self.showtime.available_seats, 50)
        self.assertEqual(self.showtime.price, 10.00)

    def test_showtime_str(self):
        self.assertEqual(str(self.showtime), 'Test Movie - 01.01.2022 10:00')
