from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template.context import RequestContext

# Create your views here.

def fbactivity(request):
#     import pdb;pdb.set_trace()
    return render_to_response('facebook/fb_dashboard_temp.html',
                          {},
                           context_instance=RequestContext(request))