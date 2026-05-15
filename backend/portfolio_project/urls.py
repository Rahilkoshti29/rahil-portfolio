from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('api/', include('portfolio_project.portfolio.urls')),
    # Django renders portfolio/templates/portfolio/index.html
    # with {% load static %} working correctly
    path('', TemplateView.as_view(template_name='portfolio/index.html')),
]
