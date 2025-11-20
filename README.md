# Caprel Secure Flow — Streamlit Editio`
`## Quick start
1) Prereqs: Python 3.10+ and `pip`.
2) From the project folder:
```bash
python3 -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
streamlit run app.py
```
3) Open the Streamlit link in your browser (default http://localhost:8501).

## Navigation
- **Landing**: hero, features, updates, FAQ (first view).
- **Login**: unlocks the cockpit with `admin` / `admin`.
- **Dashboard**: stats, risk alerts, recent orders, exposure by city.
- **Orders**: search/filter existing orders.
- **New Order**: pick client + products, total, credit-limit check.
- **Clients**: credit exposure overview per client.
- **Catalog**: static inventory with categories.
- **ML Analytics**: prediction form (local rule-based demo).
- **Messages**: static conversation with reply action.

### Authentication
- Landing shows first; secure sections appear after login.
- Default credentials: username `admin`, password `admin`. Use “Sign out” in the sidebar to lock again.

## Data & logic
- Mocked in-memory data via Streamlit session: clients, orders, products, messages.
- SQLite database (`app.db`) for authentication (default admin/admin) and ML prediction history.
- “ML prediction” is a local rule-based output—swap with a real model or API when ready.

## Customization
- Edit `CLIENTS`, `PRODUCTS`, `UPDATES`, etc. in `app.py` to adjust labels/numbers.
- Add business rules inside the corresponding `render_*` functions.

## Quick checks
- Verify Streamlit boots: `streamlit run app.py`.
- Create an order in **New Order** to confirm credit-limit validation and in-memory insert.
- Run a prediction in **ML Analytics** and confirm it appears in the history table (persisted in `app.db`).
# caprel-final-final-final
