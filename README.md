# Korean Theme Flow Screener (MVP)

This project is a **beginner-friendly Korean stock screener** for local testing.

When you run it, it reads sample CSV data, scores Korean stock codes, and creates:
- a CSV file with top candidates
- an HTML report you can open in your browser

---

## 1) What this project does

The screener combines 3 ideas:
1. **Theme score (0-30)** from US theme signal strength
2. **Flow score (0-40)** from recent foreign/institution net buying
3. **Momentum score (0-30)** from volume spike or breakout condition

Then it applies a liquidity filter and returns top N candidates.

---

## 2) Project structure

```
kr-theme-flow-screener/
├─ main.py
├─ requirements.txt
├─ README.md
├─ src/
│  ├─ providers.py
│  ├─ scorer.py
│  └─ report.py
├─ config/
│  ├─ theme_us.json
│  └─ basket_kr.json
├─ data/
│  ├─ kr_prices.csv
│  ├─ kr_flows.csv
│  └─ us_theme_signal.csv
└─ outputs/
```

---

## 3) Install Python (3.10+ recommended)

If Python is not installed:
1. Go to: https://www.python.org/downloads/
2. Download Python 3.10 or newer.
3. During installation on Windows, check **"Add Python to PATH"**.

Then verify in terminal:

```bash
python --version
```

You should see something like `Python 3.10.x` or newer.

---

## 4) Open terminal in the project folder

Navigate to this project folder (where `main.py` exists).

Example:

```bash
cd /path/to/kr-theme-flow-screener
```

---

## 5) Create a virtual environment

### macOS / Linux
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Windows (PowerShell)
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

After activation, you should see `(.venv)` at the start of your terminal line.

---

## 6) Install requirements

```bash
pip install -r requirements.txt
```

This MVP uses only Python standard library (no heavy packages), so install is quick.

---

## 7) Run the program

Basic run:

```bash
python main.py
```

Optional settings:
- `--min-avg-value`: liquidity threshold (default: `2000000000`)
- `--top-n`: number of candidates to return (default: `10`)

Example:

```bash
python main.py --min-avg-value 1500000000 --top-n 5
```

---

## 8) Where outputs are saved

After running, files are generated in `outputs/`:

- `outputs/top_candidates_YYYYMMDD.csv`
- `outputs/report_YYYYMMDD.html`

Open the HTML file in your browser to view a readable table report.

---

## 9) Input files (already included)

Sample CSV files are already created so the project runs immediately:
- `data/kr_prices.csv`
- `data/kr_flows.csv`
- `data/us_theme_signal.csv`

You can replace these with your own data later (same column names required).

---

## 10) Troubleshooting (beginner tips)

- **Error: file missing**
  - Make sure `config/` and `data/` files exist.
- **Command not found: python**
  - Try `python3 --version` and use `python3 main.py`.
- **Virtual environment not active**
  - Reactivate it using the commands in Step 5.

---

Happy testing! 🚀
