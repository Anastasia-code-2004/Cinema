from django.contrib.auth.models import User
from django.test import TestCase
from main.forms import CustomUserCreationForm
from main.forms import EmployeeCreationForm
from datetime import date, timedelta
from django.core.files.uploadedfile import SimpleUploadedFile

from main.models import review, contact, promo_coupon


class TestCustomUserCreationForm(TestCase):
    def test_form_with_valid_data(self):
        form = CustomUserCreationForm({
            'username': 'testuser',
            'password1': 'testpassword123',
            'password2': 'testpassword123',
            'email': 'testuser@example.com',
            'phone': '+375291234567',
            'date_of_birth': date.today() - timedelta(days=365 * 20),  # 20 years ago
        })
        self.assertTrue(form.is_valid())

    def test_form_with_invalid_data(self):
        form = CustomUserCreationForm({
            'username': 'testuser',
            'password1': 'testpassword123',
            'password2': 'testpassword123',
            'email': 'testuser@example.com',
            'phone': '+375291234567',
            'date_of_birth': date.today() - timedelta(days=365 * 15),  # 15 years ago
        })
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['date_of_birth'], ['You must be at least 18 years old to register.'])


class TestEmployeeCreationForm(TestCase):
    def test_form_with_valid_data(self):
        with open('media/images/kinozal.jpg', 'rb') as file:
            photo_file = SimpleUploadedFile(file.name, file.read(), content_type='image/jpeg')

        form = EmployeeCreationForm({
            'username': 'testuser',
            'password1': 'testpassword123',
            'password2': 'testpassword123',
            'email': 'testuser@example.com',
            'phone': '+375291234567',
            'date_of_birth': date.today() - timedelta(days=365 * 20),  # 20 years ago
            'job_description': 'Test job description',
        }, {
            'photo': photo_file,
        })
        self.assertTrue(form.is_valid())

    def test_form_with_invalid_data(self):
        form = EmployeeCreationForm({
            'username': 'testuser',
            'password1': 'testpassword123',
            'password2': 'testpassword123',
            'email': 'testuser@example.com',
            'phone': '+375291234567',
            'date_of_birth': date.today() - timedelta(days=365 * 15),  # 15 years ago
            'job_description': 'Test job description',
        })
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['date_of_birth'], ['You must be at least 18 years old to register.'])


class TestReviewModel(TestCase):
    def setUp(self):
        self.review1 = review.objects.create(
            name='Test Review',
            rating=5,
            text='This is a test review',
            date=date.today(),
        )

    def test_review_creation(self):
        self.assertEqual(self.review1.name, 'Test Review')
        self.assertEqual(self.review1.rating, 5)
        self.assertEqual(self.review1.text, 'This is a test review')
        self.assertEqual(self.review1.date, date.today())


class TestContactModel(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser', password='testpassword123')
        self.contact1 = contact.objects.create(
            user=self.user1,
            phone='+375291234567',
            email='testuser@example.com',
            date_of_birth=date.today() - timedelta(days=365 * 20),  # 20 years ago
        )

    def test_contact_creation(self):
        self.assertEqual(self.contact1.user, self.user1)
        self.assertEqual(self.contact1.phone, '+375291234567')
        self.assertEqual(self.contact1.email, 'testuser@example.com')
        self.assertEqual(self.contact1.date_of_birth, date.today() - timedelta(days=365 * 20))


class TestPromoCouponModel(TestCase):
    def setUp(self):
        self.promo_coupon1 = promo_coupon.objects.create(
            code='TESTCODE',
            is_active=True,
            discount_in_percents=10,
        )

    def test_promo_coupon_str(self):
        self.assertEqual(str(self.promo_coupon1), 'TESTCODE')


