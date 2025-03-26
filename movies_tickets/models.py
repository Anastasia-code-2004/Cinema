from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from main.models import Client


class Hall(models.Model):
    name = models.CharField(max_length=50)
    capacity = models.IntegerField(validators=[MaxValueValidator(200)])

    def __str__(self):
        return f'Зал {self.name}'

    class Meta:
        verbose_name = 'Зал'
        verbose_name_plural = 'Залы'


class Showtime(models.Model):
    movie = models.ForeignKey('movies.Movie', on_delete=models.CASCADE, null=False, blank=False)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE, null=False, blank=False)
    start_time = models.DateTimeField(null=False, blank=False)
    available_seats = models.IntegerField(validators=[MaxValueValidator(200)], null=False, blank=False)
    price = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)], null=False,
                                blank=False, default=0)

    def __str__(self):
        return f'{self.movie.title} - {self.start_time.strftime("%d.%m.%Y %H:%M")}'

    class Meta:
        verbose_name = 'Сеанс'
        verbose_name_plural = 'Сеансы'


class Schedule(models.Model):
    date = models.DateField(null=False, blank=False)
    showtimes = models.ManyToManyField(Showtime, blank=False)

    def __str__(self):
        return f'Расписание на {self.date}'

    class Meta:
        verbose_name = 'Расписание'
        verbose_name_plural = 'Расписания'


class CartItem(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, default=None)
    showtime = models.ForeignKey(Showtime, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)], null=False,
                                blank=False)

    def __str__(self):
        return f'Билет(-ы) в корзине клиента {self.client.user.username}'

    class Meta:
        verbose_name = 'Билет в корзине'
        verbose_name_plural = 'Билеты в корзине'


class Ticket(models.Model):
    showtime = models.ForeignKey(Showtime, on_delete=models.CASCADE)
    user = models.ForeignKey(Client, on_delete=models.CASCADE)
    purchase_time = models.DateTimeField()
    price = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)], null=False,
                                blank=False)

    def __str__(self):
        return f'Билет клиента {self.user.user.username} на {self.showtime.movie.title} ({self.showtime.start_time.
                                    strftime("%d.%m.%Y %H:%M")})'

    class Meta:
        verbose_name = 'Билет'
        verbose_name_plural = 'Билеты'



