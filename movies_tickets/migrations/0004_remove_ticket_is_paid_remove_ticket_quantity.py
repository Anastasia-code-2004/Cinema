# Generated by Django 5.0.4 on 2024-09-14 07:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('movies_tickets', '0003_ticket_is_paid_ticket_quantity'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ticket',
            name='is_paid',
        ),
        migrations.RemoveField(
            model_name='ticket',
            name='quantity',
        ),
    ]
