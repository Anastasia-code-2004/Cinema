from django.contrib import admin

from movies_tickets.models import Hall, Showtime, Schedule, Ticket, CartItem

admin.site.register(Hall)
admin.site.register(Showtime)
admin.site.register(Schedule)
admin.site.register(Ticket)
admin.site.register(CartItem)
