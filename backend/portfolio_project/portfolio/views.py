import json
import logging
import os
from groq import Groq
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

# ══════════════════════════════════════
#   CONTACT FORM VIEW
# ══════════════════════════════════════
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
        except Exception as ex:
            logger.error(f"Email failed: {ex}")

    print(f"\n📩  {name} <{email}>\n{message}\n")
    return JsonResponse({"success": True, "email_sent": sent})


# ══════════════════════════════════════
#   AI CHATBOT VIEW
# ══════════════════════════════════════

SYSTEM_PROMPT = """You are Rahil Koshti's personal AI assistant on his portfolio website.
Answer questions about Rahil professionally, helpfully, and concisely.

=== ABOUT RAHIL ===

Name: Rahil Koshti
Location: Ahmedabad, Gujarat, India
Email: rahilkoshti29@gmail.com
Status: Actively looking for internship opportunities

--- Education ---
- MSc Information Technology (IN PROGRESS) — GLS University, Ahmedabad (2025–2027)
  Specialization: Full Stack Development
- BCA — President Institute of Computer Application, Gujarat University, Ahmedabad (2022–2025)
  CGPA: 8.11

--- Skills ---
- App Development: Flutter, Dart, Cross Platform, Mobile UI/UX
- Web Development: HTML5, CSS3, JavaScript
- Backend & APIs: PHP, Python, Django, REST APIs
- Database: MySQL, MongoDB
- AI/ML: Machine Learning, AI Integration, Pandas, NumPy, Decision Tree
- Programming: C, C++, Java, Python
- Tools: Git, GitHub, AWS, Figma

--- Projects ---
1. ChargeNow — On-demand EV charging platform
   - Dispatches mobile charging vans to user location
   - Real-time van tracking & live ETA
   - Secure in-app digital payments
   - Emergency on-location charging
   - ML model (Decision Tree) predicts battery health from trained dataset
   - Tech: Flutter, Dart, Python, Django REST Framework, Scikit-learn
   - GitHub: github.com/Rahilkoshti29/chargenow

2. Book Your EV — EV Car Rental App
   - City & category-based vehicle search
   - Seamless booking & status tracking
   - Clean Flutter UI with PHP & MySQL backend
   - Hosted on AeonFree
   - Tech: Flutter, Dart, PHP, MySQL, REST APIs
   - GitHub: github.com/Rahilkoshti29/BookYourEV

--- Experience ---
- Off Page SEO Executive @ Divya Estate Management, Ahmedabad
  Duration: 11 Months (Dec 2024 – Oct 2025) — Freelance
  Work: Link building, keyword research, competitor analysis, SEO reporting

--- Achievements ---
- CyberShadez 2026 (National Level Techfest, GLS University) — Won 2nd Place in 3 events:
  1. Tech Teaser (IT Quiz)
  2. Code Relay (Relay Coding)
  3. Code Snap (Snapshot Coding)

--- Interests ---
- Full Stack Development
- Artificial Intelligence & Machine Learning
- App Development

--- Services Offered ---
- Web Design & Development
- App Development (Flutter)
- SEO Services (On-page, Off-page, Technical)
- Digital Marketing
- Tech Consultancy

=== INSTRUCTIONS ===
- Keep answers short, clear and professional (2-4 sentences max)
- Be friendly and enthusiastic about Rahil's work
- If asked about contact/hiring → mention rahilkoshti29@gmail.com
- If asked something completely unrelated to Rahil → politely say you can only answer questions about Rahil
- Never make up information not listed above
- Use emojis occasionally to be friendly but not excessive"""


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def ai_chat(request):
    if request.method == "OPTIONS":
        r = JsonResponse({})
        r["Access-Control-Allow-Origin"] = "*"
        r["Access-Control-Allow-Headers"] = "Content-Type"
        return r

    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    user_message = data.get("message", "").strip()

    if not user_message:
        return JsonResponse({"error": "No message provided"}, status=400)

    user_message = user_message[:500]

    # Get Groq API Key
    groq_key = os.getenv("GROQ_API_KEY")

    if not groq_key:
        return JsonResponse({
            "reply": "Groq API Key is not configured."
        })

    try:
        client = Groq(api_key=groq_key)

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            temperature=0.7,
            max_tokens=300,
        )

        reply = response.choices[0].message.content

        return JsonResponse({
            "reply": reply
        })

    except Exception as e:
        import traceback
        traceback.print_exc()

        return JsonResponse({
            "reply": f"Groq Error: {str(e)}"
        })