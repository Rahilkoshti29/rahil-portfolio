import json, logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def contact(request):
    if request.method == "OPTIONS":
        r = JsonResponse({})
        r["Access-Control-Allow-Origin"]  = "*"
        r["Access-Control-Allow-Headers"] = "Content-Type"
        return r
    try:
        d = json.loads(request.body)
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    name    = d.get("name", "").strip()
    email   = d.get("email", "").strip()
    message = d.get("message", "").strip()

    if not (name and email and message):
        return JsonResponse({"error": "All fields are required."}, status=400)

    sent = False
    if settings.EMAIL_HOST_USER and settings.EMAIL_HOST_PASSWORD:
        try:
            send_mail(
                subject=f"[Portfolio] New message from {name}",
                message=(
                    f"Name    : {name}\n"
                    f"Email   : {email}\n"
                    f"────────────────────────\n\n"
                    f"{message}\n\n"
                    f"────────────────────────\n"
                    f"Reply to: {email}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=["rahilkoshti29@gmail.com"],
                fail_silently=False,
            )
            sent = True
            logger.info(f"Email sent from {email}")
        except Exception as ex:
            logger.error(f"Email failed: {ex}")

    print(f"\n📩  {name} <{email}>\n{message}\n")
    return JsonResponse({"success": True, "email_sent": sent})
