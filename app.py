import datetime as _dt
import hashlib
import json
import sqlite3
from pathlib import Path
from typing import Dict, List, Tuple

import pandas as pd
import streamlit as st


st.set_page_config(
    page_title="Caprel Secure Flow",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded",
)

DB_PATH = Path(__file__).resolve().parent / "app.db"

PALETTE = {
    "primary": "#5a9a3f",  # Vert Capre
    "accent": "#6d7f3b",   # Vert Olive
    "background": "#0b0f0c",
    "panel": "#121812",
    "muted": "#d7dfd2",
}


def _format_euro(value: float) -> str:
    """Format numbers with a thin space and euro sign."""
    return f"{value:,.0f} €".replace(",", " ")


@st.cache_resource(show_spinner=False)
def _get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def _init_db() -> None:
    conn = _get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        );
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT NOT NULL,
            payload TEXT NOT NULL,
            predicted_class TEXT NOT NULL,
            confidence REAL NOT NULL,
            created_at TEXT NOT NULL
        );
        """
    )
    # Seed default admin user if needed
    cursor = conn.execute("SELECT COUNT(*) FROM users WHERE username = ?", ("admin",))
    if cursor.fetchone()[0] == 0:
        pwd_hash = hashlib.sha256("admin".encode()).hexdigest()
        conn.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", ("admin", pwd_hash))
        conn.commit()


def _verify_user(username: str, password: str) -> bool:
    conn = _get_db()
    cursor = conn.execute("SELECT password_hash FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    if not row:
        return False
    return hashlib.sha256(password.encode()).hexdigest() == row[0]


def _record_prediction(user: str, payload: Dict, predicted_class: str, confidence: float) -> None:
    conn = _get_db()
    conn.execute(
        "INSERT INTO predictions (user, payload, predicted_class, confidence, created_at) VALUES (?, ?, ?, ?, ?)",
        (
            user,
            json.dumps(payload),
            predicted_class,
            confidence,
            _dt.datetime.utcnow().isoformat(),
        ),
    )
    conn.commit()


def _fetch_predictions(limit: int = 20) -> pd.DataFrame:
    conn = _get_db()
    df = pd.read_sql_query(
        "SELECT user, predicted_class, confidence, payload, created_at FROM predictions ORDER BY id DESC LIMIT ?",
        conn,
        params=(limit,),
    )
    if not df.empty:
        df["confidence_pct"] = (df["confidence"] * 100).round(1).astype(str) + "%"
    return df


def _init_session_state() -> None:
    """Bootstrap session data for orders, messages, and drafts."""
    if "logged_in" not in st.session_state:
        st.session_state.logged_in = False
    if "current_user" not in st.session_state:
        st.session_state.current_user = None
    if "view" not in st.session_state:
        st.session_state.view = "Landing"

    if "orders" not in st.session_state:
        st.session_state.orders = [
            {"id": "CMD004", "client": "Restaurant Al Bahr", "client_id": "C002", "status": "Pending", "date": "2025-11-18", "amount": 12000, "items": 15},
            {"id": "CMD005", "client": "Epicerie Safi Plus", "client_id": "C001", "status": "Pending", "date": "2025-11-18", "amount": 8000, "items": 10},
            {"id": "CMD006", "client": "Marche Central Casa", "client_id": "C003", "status": "Pending", "date": "2025-11-18", "amount": 5000, "items": 8},
            {"id": "CMD003", "client": "Marche Central Casa", "client_id": "C003", "status": "In Progress", "date": "2025-11-10", "amount": 10000, "items": 12},
            {"id": "CMD002", "client": "Restaurant Al Bahr", "client_id": "C002", "status": "Overdue", "date": "2025-11-05", "amount": 20000, "items": 25},
            {"id": "CMD001", "client": "Epicerie Safi Plus", "client_id": "C001", "status": "Paid", "date": "2025-11-01", "amount": 15000, "items": 18},
        ]

    if "messages" not in st.session_state:
        st.session_state.messages = [
            {"sender": "Restaurant Al Bahr", "text": "Hello, I wanted to discuss the payment for order CMD002.", "time": "14:25", "is_client": True},
            {"sender": "You", "text": "Good afternoon! Of course, I'm here to help. What would you like to know?", "time": "14:27", "is_client": False},
            {"sender": "Restaurant Al Bahr", "text": "We're experiencing some cash flow issues. Could we extend the payment deadline by 15 days?", "time": "14:30", "is_client": True},
            {"sender": "You", "text": "I understand. Let me check with our finance team. I'll get back to you within the hour.", "time": "14:32", "is_client": False},
        ]


CLIENTS = [
    {"id": "C002", "name": "Restaurant Al Bahr", "city": "Casablanca", "exposure": 32000, "limit": 30000, "orders": 8, "last_order": "2025-11-18"},
    {"id": "C001", "name": "Epicerie Safi Plus", "city": "Safi", "exposure": 15000, "limit": 20000, "orders": 12, "last_order": "2025-11-18"},
    {"id": "C003", "name": "Marche Central Casa", "city": "Casablanca", "exposure": 10000, "limit": 50000, "orders": 15, "last_order": "2025-11-18"},
]

PRODUCTS = [
    {"id": "P001", "name": "Capres Surfines de Pantelleria", "price": 12.5, "unit": "kg", "stock": 150, "category": "Capres"},
    {"id": "P002", "name": "Olives Vertes Picholine", "price": 8.0, "unit": "kg", "stock": 300, "category": "Olives"},
    {"id": "P003", "name": "Olives Noires Kalamata", "price": 9.5, "unit": "kg", "stock": 250, "category": "Olives"},
    {"id": "P004", "name": "Huile d'Olive Extra Vierge AOP", "price": 45.0, "unit": "L", "stock": 80, "category": "Huiles"},
    {"id": "P005", "name": "Capres au Vinaigre Balsamique", "price": 15.0, "unit": "kg", "stock": 20, "category": "Capres"},
    {"id": "P006", "name": "Olives Farcies aux Poivrons", "price": 10.5, "unit": "kg", "stock": 200, "category": "Olives"},
    {"id": "P007", "name": "Tapenade aux Capres et Olives", "price": 18.0, "unit": "kg", "stock": 0, "category": "Preparations"},
    {"id": "P008", "name": "Huile d'Olive Vierge Bio", "price": 38.0, "unit": "L", "stock": 150, "category": "Huiles"},
]

UPDATES = [
    {"date": "November 18, 2025", "title": "Enhanced Credit Monitoring", "detail": "Real-time alerts for credit limit breaches with automated notifications to finance teams."},
    {"date": "November 10, 2025", "title": "Multi-Factor Authentication", "detail": "New MFA options including SMS, authenticator apps, and biometric verification now available."},
    {"date": "November 1, 2025", "title": "API v2.0 Released", "detail": "Faster, more secure API with webhook support and improved documentation for developers."},
]

TESTIMONIALS = [
    {"title": "Outstanding Security", "quote": "Caprel LocalSecure transformed how we manage credit. The audit trail saved us during compliance review.", "author": "Sarah M., CFO at TechCorp"},
    {"title": "Intuitive & Powerful", "quote": "Easy onboarding, powerful features. Our sales team adapted instantly. Credit monitoring is a game-changer.", "author": "James K., Sales Director"},
    {"title": "Best Support Team", "quote": "24/7 support that actually responds. Migration was seamless, and the team guided us every step.", "author": "Aisha B., Operations Manager"},
]

FAQS = [
    ("How secure is Caprel LocalSecure?", "Zero-trust architecture, end-to-end encryption, MFA, and full audit trails with GDPR alignment."),
    ("How does credit monitoring work?", "Real-time tracking of exposure per client with alerts when thresholds are reached."),
    ("What integrations are available?", "REST API, webhooks, SFTP exports, and ERP/accounting connectors."),
    ("What's the onboarding process?", "Kickoff, data migration, training, and go-live in under a week for most teams."),
]


def _inject_css() -> None:
    st.markdown(
        f"""
        <style>
          :root {{
            --primary: {PALETTE["primary"]};
            --accent: {PALETTE["accent"]};
            --bg: {PALETTE["background"]};
            --panel: {PALETTE["panel"]};
            --muted: {PALETTE["muted"]};
          }}
          body, .stApp {{
            background: radial-gradient(100% 100% at 0% 0%, #0f1a0f 0%, #050805 40%, #000 100%);
            color: var(--muted);
          }}
          .block-container {{
            padding-top: 3rem;
            padding-bottom: 4rem;
          }}
          .glass {{
            background: linear-gradient(135deg, rgba(90,154,63,0.08), rgba(13,18,10,0.9));
            border: 1px solid rgba(90,154,63,0.3);
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            padding: 1rem 1.25rem;
          }}
          .pill {{
            display: inline-block;
            padding: 6px 12px;
            border-radius: 999px;
            background: rgba(90,154,63,0.15);
            color: #d7dfd2;
            border: 1px solid rgba(90,154,63,0.4);
            font-size: 0.85rem;
            letter-spacing: 0.02em;
          }}
          .hero-title {{
            font-size: clamp(32px, 4vw, 52px);
            line-height: 1.05;
            color: #f6fff0;
          }}
          .hero-gradient {{
            background: linear-gradient(120deg, #7bbc5a, #8fc26d, #4c7c32);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }}
          div[data-testid="stMetricValue"] {{
            color: #f6fff0;
          }}
          .stButton > button {{
            background: linear-gradient(120deg, #5a9a3f, #6d7f3b);
            color: #f6fff0;
            border: 1px solid rgba(90,154,63,0.5);
          }}
          .stButton > button:hover {{
            filter: brightness(1.05);
          }}
          .stDataFrame thead tr th {{
            background: rgba(90,154,63,0.15);
          }}
        </style>
        """,
        unsafe_allow_html=True,
    )


def render_landing() -> None:
    st.markdown('<div style="height:12px;"></div>', unsafe_allow_html=True)
    hero = st.container()
    with hero:
        col1, col2 = st.columns([1.15, 0.85])
        with col1:
            st.markdown('<span class="pill">Secure • Trusted • Audit-Ready</span>', unsafe_allow_html=True)
            st.markdown(
                '<div class="hero-title">Caprel <span class="hero-gradient">Secure Flow</span></div>',
                unsafe_allow_html=True,
            )
            st.markdown(
                "Secure workspace for **clients · credit · orders · messages**. "
                "Zero-trust architecture with encrypted data and complete audit trails."
            )
            st.button("Explore platform", use_container_width=True)
            st.button("Learn more", type="secondary", use_container_width=True)
            st.markdown(
                "- ✅ Zero-trust controls\n"
                "- ✅ End-to-end encryption\n"
                "- ✅ GDPR-ready"
            )
        with col2:
            st.markdown('<div class="glass">', unsafe_allow_html=True)
            st.markdown("**Security snapshot**")
            st.markdown(
                "- Zero-trust posture with MFA-ready flows\n"
                "- Full audit trails and role-based controls\n"
                "- Encrypted data in transit and at rest"
            )
            st.metric("Uptime", "99.99%")
            st.metric("Audit checks", "Passed")
            st.success("Security Notice: enable MFA and restrict to Finance/Sales/Support roles.")
            st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("### Why choose Caprel Secure Flow?")
    feat_cols = st.columns(4)
    features = [
        ("Zero-trust", "Authentication + authorization on every request."),
        ("Full audit", "Activity logs with timestamps and user tracking."),
        ("RBAC", "Granular permissions for Finance, Sales, Support."),
        ("Predictive AI", "147K+ training records to predict inspection outcomes."),
    ]
    for col, feat in zip(feat_cols, features):
        with col:
            st.markdown('<div class="glass">', unsafe_allow_html=True)
            st.subheader(feat[0])
            st.caption(feat[1])
            st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("### Latest updates")
    update_cols = st.columns(3)
    for col, item in zip(update_cols, UPDATES):
        with col:
            st.markdown('<div class="glass">', unsafe_allow_html=True)
            st.markdown(f"**{item['title']}**")
            st.caption(item["date"])
            st.write(item["detail"])
            st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("### Testimonials")
    test_cols = st.columns(3)
    for col, item in zip(test_cols, TESTIMONIALS):
        with col:
            st.markdown('<div class="glass">', unsafe_allow_html=True)
            st.markdown(f"**{item['title']}**")
            st.write(f"“{item['quote']}”")
            st.caption(item["author"])
            st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("### FAQ")
    for question, answer in FAQS:
        with st.expander(question):
            st.write(answer)


def render_login() -> None:
    st.markdown("## Secure Access")
    st.markdown("Use default credentials `admin` / `admin` to unlock the cockpit.")
    with st.form("login_form"):
        user = st.text_input("Username", placeholder="admin")
        pwd = st.text_input("Password", placeholder="admin", type="password")
        submitted = st.form_submit_button("Sign in")

    if submitted:
        if _verify_user(user, pwd):
            st.session_state.logged_in = True
            st.session_state.current_user = user
            st.session_state.view = "Dashboard"
            st.success("Login successful. Cockpit unlocked.")
            st.rerun()
        else:
            st.error("Invalid credentials.")


def render_dashboard() -> None:
    orders = pd.DataFrame(st.session_state.orders)
    stats = [
        ("Active Clients", len(CLIENTS)),
        ("Total Exposure", 57000),
        ("Average Exposure", 19000),
        ("Open Orders", (orders["status"] != "Paid").sum()),
    ]
    st.markdown("## Supplier Cockpit")
    cols = st.columns(len(stats))
    for col, (label, value) in zip(cols, stats):
        col.metric(label, _format_euro(value) if "Exposure" in label else value)

    st.markdown("### Risk alerts")
    st.markdown('<div class="glass">', unsafe_allow_html=True)
    st.warning("Restaurant Al Bahr exceeds limit: 32,000 € / 30,000 € (+2,000 €).")
    st.info("CMD002 payment overdue (20,000 €; due 2025-11-05).")
    st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("### Recent orders")
    st.dataframe(
        orders[["id", "client", "status", "date", "amount"]],
        use_container_width=True,
        hide_index=True,
    )

    st.markdown("### Credit surveillance")
    for client in CLIENTS:
        percent = (client["exposure"] / client["limit"]) * 100
        over = percent > 100
        st.progress(min(percent, 100) / 100, text=f"{client['name']} — {percent:.0f}%")
        st.caption(
            f"{_format_euro(client['exposure'])} / {_format_euro(client['limit'])} "
            f"{'(above credit limit)' if over else ''}"
        )

    st.markdown("### Exposure by city")
    exposure_by_city = pd.DataFrame(
        [
            {"city": "Casablanca", "percentage": 45, "amount": 25650},
            {"city": "Safi", "percentage": 35, "amount": 19950},
            {"city": "Others", "percentage": 20, "amount": 11400},
        ]
    )
    st.bar_chart(exposure_by_city.set_index("city")["percentage"])
    st.caption("Percentage split by city")


def render_orders() -> None:
    st.markdown("## Orders Management")
    df = pd.DataFrame(st.session_state.orders)

    col1, col2, col3, col4, col5 = st.columns(5)
    col1.metric("Total", len(df))
    col2.metric("Pending", (df["status"] == "Pending").sum())
    col3.metric("In Progress", (df["status"] == "In Progress").sum())
    col4.metric("Overdue", (df["status"] == "Overdue").sum())
    col5.metric("Paid", (df["status"] == "Paid").sum())

    search = st.text_input("Search by order ID or client", placeholder="CMD004 or Restaurant Al Bahr")
    filtered = df[
        df["id"].str.contains(search, case=False, na=False)
        | df["client"].str.contains(search, case=False, na=False)
    ] if search else df

    st.dataframe(filtered, use_container_width=True, hide_index=True)


def _compute_available_credit(client_id: str) -> Tuple[float, Dict]:
    client = next((c for c in CLIENTS if c["id"] == client_id), None)
    if not client:
        return 0, {}
    return client["limit"] - client["exposure"], client


def render_new_order() -> None:
    st.markdown("## Create New Order")
    with st.form("new_order_form"):
        col1, col2 = st.columns(2)
        client_choice = col1.selectbox(
            "Client",
            options=[""] + [c["id"] for c in CLIENTS],
            format_func=lambda cid: "Choose..." if cid == "" else next(c for c in CLIENTS if c["id"] == cid)["name"],
        )
        search = col2.text_input("Search products")

        filtered = [p for p in PRODUCTS if search.lower() in p["name"].lower()] if search else PRODUCTS
        product_ids = [p["id"] for p in filtered]
        selected = st.multiselect("Products", options=product_ids, format_func=lambda pid: next(p for p in PRODUCTS if p["id"] == pid)["name"])

        quantities: List[Tuple[str, int]] = []
        for pid in selected:
            product = next(p for p in PRODUCTS if p["id"] == pid)
            qty = st.number_input(
                f"{product['name']} ({product['price']} € / {product['unit']}, stock {product['stock']})",
                min_value=1,
                max_value=max(product["stock"], 1),
                value=1,
                step=1,
            )
            quantities.append((pid, qty))

        submitted = st.form_submit_button("Create Order")

    available, client_data = _compute_available_credit(client_choice)
    order_items = []
    total = 0.0
    for pid, qty in quantities:
        prod = next(p for p in PRODUCTS if p["id"] == pid)
        line_total = prod["price"] * qty
        order_items.append({"product": prod["name"], "quantity": qty, "line_total": line_total})
        total += line_total

    if client_data:
        st.info(
            f"Credit limit: {_format_euro(client_data['limit'])} · "
            f"Current exposure: {_format_euro(client_data['exposure'])} · "
            f"Available: {_format_euro(available)}"
        )

    if order_items:
        st.markdown("### Cart")
        st.table(pd.DataFrame(order_items))
        st.subheader(f"Total: {_format_euro(total)}")

    if submitted:
        if not client_choice:
            st.error("Please select a client.")
        elif not quantities:
            st.error("Please add at least one product.")
        elif total > available:
            st.error("Order exceeds client credit limit.")
        else:
            new_id = f"CMD{len(st.session_state.orders) + 1:03d}"
            today = _dt.date.today().isoformat()
            st.session_state.orders.append(
                {
                    "id": new_id,
                    "client": next(c for c in CLIENTS if c["id"] == client_choice)["name"],
                    "client_id": client_choice,
                    "status": "Pending",
                    "date": today,
                    "amount": total,
                    "items": sum(qty for _, qty in quantities),
                }
            )
            st.success(f"Order {new_id} created successfully.")


def render_clients() -> None:
    st.markdown("## Clients Management")
    for client in CLIENTS:
        available = client["limit"] - client["exposure"]
        percent = (client["exposure"] / client["limit"]) * 100
        color = "red" if percent > 100 else "orange" if percent > 75 else "green"
        st.markdown(f"### {client['name']} ({client['id']}) — {client['city']}")
        st.progress(min(percent, 100) / 100, text=f"{percent:.0f}% used")
        st.caption(
            f"Exposure {_format_euro(client['exposure'])} / limit {_format_euro(client['limit'])} "
            f"| Available {_format_euro(available)}"
        )
        st.color_picker("Credit health", value={"red": "#ff4d4f", "orange": "#faad14", "green": "#52c41a"}[color], key=f"color_{client['id']}")
        st.write(f"Orders: {client['orders']} · Last order: {client['last_order']}")
        st.divider()


def render_catalog() -> None:
    st.markdown("## Product Catalog")
    categories = ["All"] + sorted({p["category"] for p in PRODUCTS})
    cat = st.radio("Category", options=categories, horizontal=True)
    filtered = PRODUCTS if cat == "All" else [p for p in PRODUCTS if p["category"] == cat]
    st.dataframe(pd.DataFrame(filtered), use_container_width=True, hide_index=True)


def _predict_inspection(payload: Dict) -> Dict:
    """Rule-based lightweight predictor to avoid external services."""
    score = 0.5
    if payload["RiskLevel"] == "High":
        score += 0.2
    if payload["RiskLevel"] == "Low":
        score -= 0.1
    if payload["SectionViolations"] > 20:
        score += 0.2
    if payload["Reason"] == "COMPLAINT":
        score += 0.1
    if payload["PreviousResult"] == "FAIL":
        score += 0.1
    if payload["PreviousResult"] == "PASS":
        score -= 0.05

    score = max(0.0, min(score, 1.0))
    if score >= 0.75:
        predicted = "FAIL"
    elif score >= 0.55:
        predicted = "PASS(CONDITIONAL)"
    else:
        predicted = "PASS"

    probabilities = {
        "PASS": max(0.0, 1 - score),
        "PASS(CONDITIONAL)": 0.15 + abs(0.5 - score) * 0.3,
        "FAIL": score,
        "FURTHER INSPECTION REQUIRED": 0.1,
        "FACILITY CHANGED": 0.05,
        "INSPECTION OVERRULED": 0.05,
        "SHUT-DOWN": 0.05,
    }
    total_prob = sum(probabilities.values())
    probabilities = {k: v / total_prob for k, v in probabilities.items()}
    return {"predicted_class": predicted, "confidence": score, "probabilities": probabilities}


def render_ml() -> None:
    st.markdown("## ML Analytics & Prediction")
    st.caption("Predict inspection outcomes to anticipate risk, prioritize follow-up, and adjust credit policies before issues surface.")
    with st.form("ml_form"):
        col1, col2, col3 = st.columns(3)
        facility_type = col1.selectbox("Facility Type", ["RESTAURANT", "GROCERY STORE", "SCHOOL", "DAYCARE (2 - 6 YEARS)", "CHILDREN'S SERVICES FACILITY"])
        risk_level = col2.selectbox("Risk Level", ["High", "Medium", "Low"])
        reason = col3.selectbox("Inspection Reason", ["CANVASS", "COMPLAINT", "LICENSE", "RE-INSPECTION", "SUSPECTED FOOD POISONING"])
        violations = st.number_input("Section Violations", min_value=0, max_value=200, value=32)
        city = st.text_input("City", value="Casablanca")
        previous = st.selectbox("Previous Result (optional)", ["None", "PASS", "FAIL", "PASS(CONDITIONAL)"])
        submitted = st.form_submit_button("Predict Inspection Result")

    if submitted:
        payload = {
            "Type": facility_type,
            "RiskLevel": risk_level,
            "SectionViolations": violations,
            "Reason": reason,
            "City": city,
            "PreviousResult": previous if previous != "None" else "",
        }
        prediction = _predict_inspection(payload)
        _record_prediction(
            user=st.session_state.current_user or "guest",
            payload=payload,
            predicted_class=prediction["predicted_class"],
            confidence=prediction["confidence"],
        )
        st.success(f"Predicted class: {prediction['predicted_class']}")
        st.progress(prediction["confidence"])
        st.write("Confidence", f"{prediction['confidence'] * 100:.1f}%")
        st.info("Use results to decide: expedite inspections for FAIL/CONDITIONAL, tighten credit for high-risk facilities, and plan follow-ups when confidence is high.")
        st.markdown("#### Probability distribution")
        st.dataframe(
            pd.DataFrame(
                [{"class": k, "probability": f"{v * 100:.1f}%"} for k, v in sorted(prediction["probabilities"].items(), key=lambda item: item[1], reverse=True)]
            ),
            hide_index=True,
        )

    st.markdown("### Prediction history (last 20)")
    history = _fetch_predictions()
    if history.empty:
        st.info("No predictions recorded yet.")
    else:
        display = history[["user", "predicted_class", "confidence_pct", "created_at"]]
        st.dataframe(display, use_container_width=True, hide_index=True)


def render_messages() -> None:
    st.markdown("## Messages")
    messages = st.session_state.messages
    st.markdown("### Conversation — Restaurant Al Bahr (C002)")
    for msg in messages:
        align = "➡️ " if not msg["is_client"] else "⬅️ "
        st.write(f"{align}**{msg['sender']}** ({msg['time']}): {msg['text']}")

    new_text = st.text_area("Reply", placeholder="Type your message...")
    if st.button("Send"):
        if new_text.strip():
            now = _dt.datetime.now().strftime("%H:%M")
            st.session_state.messages.append({"sender": "You", "text": new_text.strip(), "time": now, "is_client": False})
            st.success("Message sent.")
        else:
            st.warning("Message is empty.")


def main() -> None:
    _init_db()
    _init_session_state()
    _inject_css()
    st.sidebar.title("Caprel Secure Flow")
    logged_in = st.session_state.logged_in
    base_options = ["Landing", "Login"]
    secure_options = ["Dashboard", "Orders", "New Order", "Clients", "Catalog", "ML Analytics", "Messages"]
    nav_options = base_options + (secure_options if logged_in else [])
    current_view = st.session_state.view if st.session_state.view in nav_options else "Landing"
    view = st.sidebar.radio("Navigation", options=nav_options, index=nav_options.index(current_view))
    st.session_state.view = view

    if logged_in:
        if st.sidebar.button("Sign out"):
            st.session_state.logged_in = False
            st.session_state.view = "Landing"
            st.info("Signed out.")
            st.rerun()

    if view == "Landing":
        render_landing()
    elif view == "Login":
        render_login()
    elif view == "Dashboard":
        render_dashboard()
    elif view == "Orders":
        render_orders()
    elif view == "New Order":
        render_new_order()
    elif view == "Clients":
        render_clients()
    elif view == "Catalog":
        render_catalog()
    elif view == "ML Analytics":
        render_ml()
    elif view == "Messages":
        render_messages()


if __name__ == "__main__":
    main()
