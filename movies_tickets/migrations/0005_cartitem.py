# Generated by Django 5.0.4 on 2024-09-14 08:30

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0019_cart'),
        ('movies_tickets', '0004_remove_ticket_is_paid_remove_ticket_quantity'),
    ]

    operations = [
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('price', models.DecimalField(decimal_places=2, max_digits=6, validators=[django.core.validators.MinValueValidator(0)])),
                ('cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.cart')),
                ('showtime', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='movies_tickets.showtime')),
            ],
            options={
                'verbose_name': 'Билет в корзине',
                'verbose_name_plural': 'Билеты в корзине',
            },
        ),
    ]
