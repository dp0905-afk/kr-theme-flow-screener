from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List

from src.providers import FlowRecord, PriceRecord


@dataclass
class CandidateScore:
    code: str
    theme: str
    total_score: int
    theme_score: int
    flow_score: int
    momentum_score: int
    reasons: str


class StockScorer:
    def __init__(
        self,
        basket_kr: Dict[str, List[str]],
        theme_signals: Dict[str, float],
        prices: List[PriceRecord],
        flows: List[FlowRecord],
        min_avg_20d_value: float,
    ) -> None:
        self.basket_kr = basket_kr
        self.theme_signals = theme_signals
        self.prices = prices
        self.flows = flows
        self.min_avg_20d_value = min_avg_20d_value

    def score_all(self) -> List[CandidateScore]:
        price_by_code: Dict[str, List[PriceRecord]] = {}
        flow_by_code: Dict[str, List[FlowRecord]] = {}

        for price in self.prices:
            price_by_code.setdefault(price.code, []).append(price)

        for flow in self.flows:
            flow_by_code.setdefault(flow.code, []).append(flow)

        candidates: List[CandidateScore] = []

        for theme, codes in self.basket_kr.items():
            theme_signal = self.theme_signals.get(theme, 0.0)
            theme_score = self._calculate_theme_score(theme_signal)

            for code in codes:
                code_prices = sorted(price_by_code.get(code, []), key=lambda row: row.date)
                code_flows = sorted(flow_by_code.get(code, []), key=lambda row: row.date)
                if not code_prices:
                    continue

                avg_value = self._avg_20d_value(code_prices)
                if avg_value < self.min_avg_20d_value:
                    continue

                flow_score, flow_reason = self._calculate_flow_score(code_flows)
                momentum_score, momentum_reason = self._calculate_momentum_score(code_prices)

                reasons = [f"{theme} theme strength"]
                if flow_reason:
                    reasons.append(flow_reason)
                if momentum_reason:
                    reasons.append(momentum_reason)

                total_score = theme_score + flow_score + momentum_score
                candidates.append(
                    CandidateScore(
                        code=code,
                        theme=theme,
                        total_score=total_score,
                        theme_score=theme_score,
                        flow_score=flow_score,
                        momentum_score=momentum_score,
                        reasons=" + ".join(reasons),
                    )
                )

        return sorted(candidates, key=lambda row: row.total_score, reverse=True)

    @staticmethod
    def _calculate_theme_score(signal_strength: float) -> int:
        bounded_signal = max(0.0, min(1.0, signal_strength))
        return round(bounded_signal * 30)

    @staticmethod
    def _calculate_flow_score(code_flows: List[FlowRecord]) -> tuple[int, str]:
        recent = code_flows[-5:]
        foreign_5d = sum(row.foreign_net for row in recent)
        inst_5d = sum(row.inst_net for row in recent)

        score = 0
        reasons: List[str] = []

        if foreign_5d > 0:
            score += 15
            reasons.append("foreign net buy")
        if inst_5d > 0:
            score += 15
            reasons.append("inst net buy")
        if foreign_5d > 0 and inst_5d > 0:
            score += 10
            reasons.append("foreign&inst both positive")

        return min(score, 40), " & ".join(reasons)

    @staticmethod
    def _calculate_momentum_score(code_prices: List[PriceRecord]) -> tuple[int, str]:
        latest = code_prices[-1]
        lookback_20 = code_prices[-20:]

        avg_20d_volume = sum(row.volume for row in lookback_20) / len(lookback_20)
        highest_20d_close = max(row.close for row in lookback_20)

        volume_spike = latest.volume >= 1.5 * avg_20d_volume
        breakout = latest.close >= highest_20d_close

        if volume_spike or breakout:
            reason = "volume spike" if volume_spike else "20d breakout"
            return 30, reason

        return 0, ""

    @staticmethod
    def _avg_20d_value(code_prices: List[PriceRecord]) -> float:
        lookback_20 = code_prices[-20:]
        return sum(row.value for row in lookback_20) / len(lookback_20)
