from __future__ import annotations

import argparse
import csv
from datetime import datetime
import json
import logging
from pathlib import Path
from typing import Any, Dict

from src.providers import CsvFlowProvider, CsvPriceProvider, CsvThemeSignalProvider
from src.report import save_html_report
from src.scorer import CandidateScore, StockScorer


DEFAULT_MIN_AVG_20D_VALUE = 2_000_000_000
DEFAULT_TOP_N = 10


def setup_logging() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="MVP Korean stock screener")
    parser.add_argument("--min-avg-value", type=float, default=DEFAULT_MIN_AVG_20D_VALUE)
    parser.add_argument("--top-n", type=int, default=DEFAULT_TOP_N)
    return parser.parse_args()


def load_json_file(path: Path) -> Dict[str, Any]:
    if not path.exists():
        raise FileNotFoundError(
            f"Required config file is missing: {path}. "
            "Please make sure config templates exist."
        )
    with path.open("r", encoding="utf-8") as json_file:
        return json.load(json_file)


def save_csv(candidates: list[CandidateScore], file_path: Path) -> None:
    with file_path.open("w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(
            csv_file,
            fieldnames=[
                "code",
                "total_score",
                "theme_score",
                "flow_score",
                "momentum_score",
                "theme",
                "reasons",
            ],
        )
        writer.writeheader()
        for item in candidates:
            writer.writerow(
                {
                    "code": item.code,
                    "total_score": item.total_score,
                    "theme_score": item.theme_score,
                    "flow_score": item.flow_score,
                    "momentum_score": item.momentum_score,
                    "theme": item.theme,
                    "reasons": item.reasons,
                }
            )


def main() -> None:
    setup_logging()
    args = parse_args()

    project_root = Path(__file__).resolve().parent
    config_dir = project_root / "config"
    data_dir = project_root / "data"
    output_dir = project_root / "outputs"
    output_dir.mkdir(parents=True, exist_ok=True)

    logging.info("Loading config files...")
    _ = load_json_file(config_dir / "theme_us.json")
    basket_kr = load_json_file(config_dir / "basket_kr.json")

    logging.info("Loading CSV data providers...")
    prices = CsvPriceProvider(data_dir / "kr_prices.csv").load_prices()
    flows = CsvFlowProvider(data_dir / "kr_flows.csv").load_flows()
    theme_signals = CsvThemeSignalProvider(data_dir / "us_theme_signal.csv").load_signals()

    logging.info("Scoring Korean stock candidates...")
    scorer = StockScorer(
        basket_kr=basket_kr,
        theme_signals=theme_signals,
        prices=prices,
        flows=flows,
        min_avg_20d_value=args.min_avg_value,
    )
    candidates = scorer.score_all()
    top_candidates = candidates[: args.top_n]

    today = datetime.now()
    date_label = today.strftime("%Y%m%d")
    csv_path = output_dir / f"top_candidates_{date_label}.csv"
    html_path = output_dir / f"report_{date_label}.html"

    logging.info("Saving CSV output: %s", csv_path)
    save_csv(top_candidates, csv_path)

    logging.info("Saving HTML report: %s", html_path)
    save_html_report(top_candidates, html_path, today)

    logging.info("Done. Generated %s candidates.", len(top_candidates))


if __name__ == "__main__":
    try:
        main()
    except FileNotFoundError as exc:
        logging.error("File error: %s", exc)
        raise SystemExit(1) from exc
    except Exception as exc:  # keep beginner-friendly catch with clear output
        logging.error("Unexpected error: %s", exc)
        raise SystemExit(1) from exc
