# Generated by Django 5.0.4 on 2024-09-14 08:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0020_remove_cart_created_at'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cart',
            name='client',
        ),
    ]
