from django.conf import settings
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models



class about_company(models.Model):
    content = models.TextField()

    def __str__(self):
        return 'О компании'

    class Meta:
        verbose_name = 'О компании'
        verbose_name_plural = 'О компании'

class history_of_company(models.Model):
    data = models.DateField(verbose_name='Дата')
    content = models.TextField(verbose_name='Содержание')

    def __str__(self):
        return 'История компании'

    class Meta:
        verbose_name = 'История компании'
        verbose_name_plural = 'История компании'


class faq(models.Model):
    question = models.CharField(max_length=200)
    answer = models.TextField()
    date_question = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.question

    class Meta:
        verbose_name = 'Вопрос-ответ'
        verbose_name_plural = 'Вопросы-ответы'


class news_item(models.Model):
    image = models.ImageField(upload_to='images', default='images/cinema.jpg')
    title = models.CharField(max_length=100, default='')
    content = models.TextField()

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'


class promo_coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    discount_in_percents = models.IntegerField(validators=[MaxValueValidator(100)], default=0)

    def __str__(self):
        return self.code

    class Meta:
        verbose_name = 'Промокод и купон'
        verbose_name_plural = 'Промокоды и купоны'


class vacancy(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Вакансия'
        verbose_name_plural = 'Вакансии'


class contact(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=13, unique=True)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField()

    def __str__(self):
        return f'Контакт {self.user.username}'

    class Meta:
        verbose_name = 'Контакт'
        verbose_name_plural = 'Контакты'


class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'Клиент {self.user.username}'

    class Meta:
        verbose_name = 'Клиент'
        verbose_name_plural = 'Клиенты'


class review(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, default=None)
    name = models.CharField(max_length=100)
    rating = models.IntegerField()
    text = models.TextField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    job_description = models.TextField()
    photo = models.ImageField(upload_to='employees', default='employees/employee.jpg')

    def __str__(self):
        return f'Сотрудник {self.user.username}'

    class Meta:
        verbose_name = 'Сотрудник'
        verbose_name_plural = 'Сотрудники'


class company_partner(models.Model):
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='partners', default='partners/partner.jpg')
    link = models.URLField()

    def __str__(self):
        return f'Компания-партнер {self.name}'

    class Meta:
        verbose_name = 'Компания-партнер'
        verbose_name_plural = 'Компании-партнеры'


