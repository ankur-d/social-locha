'''
Created on 22-Jul-2014

@author: Ankur Dulwani
'''
from django.conf.urls import patterns, include, url
from facebook import views
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'social_media_monitoring.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^go/', views.fbactivity,name='fbactivity'),
)
