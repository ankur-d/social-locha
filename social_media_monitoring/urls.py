from django.conf.urls import patterns, include, url
import facebook
from django.contrib import admin
from django.views.generic import TemplateView

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'social_media_monitoring.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^home/', TemplateView.as_view(template_name="home.html")),
    url(r'^fbactivity/', include('facebook.urls')),
)
