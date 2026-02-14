from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
import csv
from pathlib import Path
from typing import Dict, List


DATE_FORMAT = "%Y-%m-%d"


@dataclass
class PriceRecord:
    date: datetime
    code: str
    close: float
    high: float
    low: float
    volume: float
    value: float


@dataclass
class FlowRecord:
    date: datetime
    code: str
    foreign_net: float
    inst_net: float


@dataclass
class ThemeSignalRecord:
    date: datetime
    theme: str
    signal_strength: float


class PriceProvider(ABC):
    @abstractmethod
    def load_prices(self) -> List[PriceRecord]:
        """Load Korean price records."""


class FlowProvider(ABC):
    @abstractmethod
    def load_flows(self) -> List[FlowRecord]:
        """Load Korean flow records."""


class ThemeSignalProvider(ABC):
    @abstractmethod
    def load_signals(self) -> Dict[str, float]:
        """Load latest US theme signal by theme."""


class _BaseCsvProvider:
    def __init__(self, file_path: str | Path) -> None:
        self.file_path = Path(file_path)

    def _ensure_file_exists(self) -> None:
        if not self.file_path.exists():
            raise FileNotFoundError(
                f"Required input file is missing: {self.file_path}. "
                "Please check README.md setup steps and sample data files."
            )


class CsvPriceProvider(_BaseCsvProvider, PriceProvider):
    def load_prices(self) -> List[PriceRecord]:
        self._ensure_file_exists()
        rows: List[PriceRecord] = []

        with self.file_path.open("r", newline="", encoding="utf-8") as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                rows.append(
                    PriceRecord(
                        date=datetime.strptime(row["date"], DATE_FORMAT),
                        code=row["code"],
                        close=float(row["close"]),
                        high=float(row["high"]),
                        low=float(row["low"]),
                        volume=float(row["volume"]),
                        value=float(row["value"]),
                    )
                )
        return rows


class CsvFlowProvider(_BaseCsvProvider, FlowProvider):
    def load_flows(self) -> List[FlowRecord]:
        self._ensure_file_exists()
        rows: List[FlowRecord] = []

        with self.file_path.open("r", newline="", encoding="utf-8") as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                rows.append(
                    FlowRecord(
                        date=datetime.strptime(row["date"], DATE_FORMAT),
                        code=row["code"],
                        foreign_net=float(row["foreign_net"]),
                        inst_net=float(row["inst_net"]),
                    )
                )
        return rows


class CsvThemeSignalProvider(_BaseCsvProvider, ThemeSignalProvider):
    def load_signals(self) -> Dict[str, float]:
        self._ensure_file_exists()
        latest_by_theme: Dict[str, ThemeSignalRecord] = {}

        with self.file_path.open("r", newline="", encoding="utf-8") as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                record = ThemeSignalRecord(
                    date=datetime.strptime(row["date"], DATE_FORMAT),
                    theme=row["theme"],
                    signal_strength=float(row["signal_strength"]),
                )
                previous = latest_by_theme.get(record.theme)
                if previous is None or record.date > previous.date:
                    latest_by_theme[record.theme] = record

        return {theme: data.signal_strength for theme, data in latest_by_theme.items()}
