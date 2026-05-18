from django.urls import path, include
from django.views.generic import TemplateView
from django.http import HttpResponse
from datetime import date

def robots_txt(request):
    content = """User-agent: *
Allow: /
Sitemap: https://rahil-koshti.vercel.app/sitemap.xml"""
    return HttpResponse(content, content_type="text/plain")

def sitemap_xml(request):
    today = date.today().isoformat()
    content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://rahil-koshti.vercel.app/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>"""
    return HttpResponse(content, content_type="application/xml")

urlpatterns = [
    path('api/', include('portfolio_project.portfolio.urls')),
    path('robots.txt', robots_txt),
    path('sitemap.xml', sitemap_xml),
    path('', TemplateView.as_view(template_name='portfolio/index.html')),
]