import logging
from datetime import datetime

from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.utils import timezone
from django.utils.timezone import get_current_timezone

from main.models import Client, promo_coupon
from movies.models import Genre
from .models import Schedule, Showtime, Ticket, CartItem


def scheduleView(request):
    all_schedules = Schedule.objects.all().order_by('date')
    all_genres = Genre.objects.all()
    all_showtimes = Showtime.objects.all()

    price = request.GET.get('price')
    if price:
        all_showtimes = all_showtimes.filter(price__lte=price, schedule__isnull=False)

    genre = request.GET.get('genre')
    if genre:
        all_showtimes = all_showtimes.filter(movie__genres__name=genre, schedule__isnull=False)

    date = request.GET.get('date')
    if date:
        all_schedules = all_schedules.filter(date=date)
    movie_title = request.GET.get('movie')
    if movie_title:
        all_showtimes = all_showtimes.filter(movie__title__icontains=movie_title, schedule__isnull=False)

    return render(request, 'movie_showings/schedules.html', {'all_schedules': all_schedules,
                                                             'all_genres': all_genres,
                                                             'all_showtimes': all_showtimes})


def bookingView(request, showtime_id):
    showtime = get_object_or_404(Showtime, id=showtime_id)
    return render(request, 'movie_showings/booking.html', {'showtime': showtime})


@login_required
def buy_ticket(request, showtime_id):
    if request.user.is_staff or request.user.is_superuser:
        logging.error('Staff and superusers cannot buy tickets.')
        return redirect('%s?next=%s' % (reverse('login'), request.path))
    showtime = get_object_or_404(Showtime, id=showtime_id)
    client = get_object_or_404(Client, user=request.user)
    ticket_price = showtime.price  # Use the showtime price as the initial ticket price
    if showtime.available_seats > 0:
        promo_code = request.POST.get('promo_code', None)
        if promo_code:
            try:
                coupon = promo_coupon.objects.get(code=promo_code)
                if coupon.is_active:
                    discount = coupon.discount_in_percents
                    ticket_price = showtime.price - showtime.price * discount / 100
                    messages.success(request, 'Промокод успешно применен.')
                else:
                    messages.error(request, 'Промокод не активен.')
            except promo_coupon.DoesNotExist:
                messages.error(request, 'Промокод не найден.')
        tz = get_current_timezone()
        stored_date = datetime.now()
        desired_date = stored_date + tz.utcoffset(stored_date)
        Ticket.objects.create(user=client, showtime=showtime, price=ticket_price, purchase_time=desired_date)
        showtime.available_seats -= 1
        showtime.save()
    return redirect('client_profile')


@login_required
def add_to_cart(request, showtime_id):
    if request.method == 'POST':
        if request.user.is_staff or request.user.is_superuser:
            logging.error('Staff and superusers cannot buy tickets.')
            return redirect('%s?next=%s' % (reverse('login'), request.path))
        showtime = get_object_or_404(Showtime, id=showtime_id)
        client = get_object_or_404(Client, user=request.user)
        price = showtime.price  # Use the showtime price as the initial ticket price
        if showtime.available_seats > 0:
            cartitem = CartItem.objects.filter(client=client, showtime=showtime).first()
            if cartitem:
                cartitem.quantity += 1
                cartitem.price += price
                cartitem.save()
            else:
                CartItem.objects.create(client=client, showtime=showtime, price=price)
            showtime.available_seats -= 1
            showtime.save()
        return redirect('cart')
    else:
        return redirect('booking', showtime_id=showtime_id)

def update_cartitem_quantity(request, cartitem_id):
    cartitem = get_object_or_404(CartItem, id=cartitem_id)
    showtime = get_object_or_404(Showtime, id=cartitem.showtime.id)
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'increase' and cartitem.showtime.available_seats > 0:
            cartitem.quantity += 1
            cartitem.price += cartitem.showtime.price
            showtime.available_seats -= 1
        elif action == 'decrease' and cartitem.quantity > 1:
            cartitem.quantity -= 1
            cartitem.price -= cartitem.showtime.price
            showtime.available_seats += 1
        showtime.save()
        cartitem.save()
    return redirect('cart')


def remove_from_cart(request, cartitem_id):
    cartitem = get_object_or_404(CartItem, id=cartitem_id)
    showtime = get_object_or_404(Showtime, id=cartitem.showtime.id)
    showtime.available_seats += cartitem.quantity
    showtime.save()
    cartitem.delete()
    return redirect('cart')


def checkout_cartitem(request, cartitem_id):
    return redirect('payment', cartitem_id=cartitem_id)


def paymentView(request, cartitem_id):
    cartitem = get_object_or_404(CartItem, id=cartitem_id)
    return render(request, 'payment.html', {'cartitem': cartitem})


def pay(request, cartitem_id):
    cartitem = get_object_or_404(CartItem, id=cartitem_id)
    for i in range(cartitem.quantity):
        buy_ticket(request, cartitem.showtime.id)
    cartitem.delete()
    return redirect('client_profile')



