from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from datetime import date

from django.forms import ModelForm

from main.models import contact, review, Employee, Client


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    phone_regex = r'^(?:\+375\s?\(?\d{2}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}|8\s?\(?0(29|33|25|44|17)\)?\s?\d{3}[\s\-]?\d{2}[\s\-]?\d{2})$'
    date_of_birth = forms.DateField(widget=forms.SelectDateWidget(years=range(1900, date.today().year)))
    phone = forms.CharField(
        validators=[RegexValidator(phone_regex, 'Phone is invalid')])

    class Meta(UserCreationForm.Meta):
        fields = UserCreationForm.Meta.fields + ('email', 'phone', 'date_of_birth')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if Client.objects.filter(user__email=email).exists():
            raise ValidationError("A user with this email already exists.")
        return email

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if contact.objects.filter(phone=phone).exists():
            raise ValidationError("A user with this phone number already exists.")
        return phone

    def clean_date_of_birth(self):
        dob = self.cleaned_data['date_of_birth']
        today = date.today()
        if (today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))) < 18:
            raise ValidationError('You must be at least 18 years old to register.')
        return dob

    def save_contact(self, user):
        contact.objects.create(
            user=user,
            phone=self.cleaned_data['phone'],
            email=self.cleaned_data['email'],
            date_of_birth=self.cleaned_data['date_of_birth'],
        )

    def save(self, commit=True):
        user = super().save(commit=False)
        user.save()
        Client.objects.create(user=user)
        self.save_contact(user)
        return user


class EmployeeCreationForm(CustomUserCreationForm):
    job_description = forms.CharField(widget=forms.Textarea)
    photo = forms.ImageField()

    class Meta(CustomUserCreationForm.Meta):
        fields = CustomUserCreationForm.Meta.fields + ('job_description', 'photo')

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()  # Сохраняем пользователя, если это указано

            # Проверяем, если ли уже контактная информация для этого пользователя
        if not contact.objects.filter(user=user).exists():
            self.save_contact(user)

        Employee.objects.create(
            user=user,
            job_description=self.cleaned_data['job_description'],
            photo=self.cleaned_data['photo'],
        )

        return user


class ReviewForm(ModelForm):
    RATING_CHOICES = [(i, str(i)) for i in range(1, 11)]

    # Добавляем CSS-класс form-input для каждого поля через атрибут widget
    name = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Тема отзыва'})
    )
    rating = forms.ChoiceField(
        choices=RATING_CHOICES,
        widget=forms.Select(attrs={'class': 'form-input'})
    )
    text = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'form-input', 'placeholder': 'Ваш отзыв'})
    )

    class Meta:
        model = review
        fields = ['name', 'rating', 'text']

    def clean_rating(self):
        rating = self.cleaned_data.get('rating')
        if int(rating) < 1 or int(rating) > 5:
            raise ValidationError('Оценка должна быть в диапазоне от 1 до 5.')
        return rating
