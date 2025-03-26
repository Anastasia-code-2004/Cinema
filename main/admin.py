from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import *


class ContactInline(admin.TabularInline):
    model = contact


class EmployeeInline(admin.StackedInline):
    model = Employee
    can_delete = False
    verbose_name_plural = 'employee'
    extra = 0


class UserAdmin(BaseUserAdmin):
    inlines = (ContactInline, EmployeeInline)


class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('user', 'job_description', 'photo')
    list_display_links = ('user', 'job_description')
    search_fields = ('user', 'job_description')
    list_filter = ('user', 'job_description', 'user__is_staff')
    list_per_page = 25


admin.site.unregister(User)
admin.site.register(User, UserAdmin)

admin.site.register(news_item)
admin.site.register(promo_coupon)
admin.site.register(review)
admin.site.register(vacancy)
admin.site.register(faq)
admin.site.register(about_company)
admin.site.register(contact)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Client)
admin.site.register(history_of_company)
admin.site.register(company_partner)

