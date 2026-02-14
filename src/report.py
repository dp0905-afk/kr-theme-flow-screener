from __future__ import annotations

from datetime import datetime
from html import escape
from pathlib import Path
from typing import List

from src.scorer import CandidateScore


def save_html_report(candidates: List[CandidateScore], file_path: Path, generated_at: datetime) -> None:
    rows_html = "\n".join(
        (
            "<tr>"
            f"<td>{escape(item.code)}</td>"
            f"<td>{item.total_score}</td>"
            f"<td>{item.theme_score}</td>"
            f"<td>{item.flow_score}</td>"
            f"<td>{item.momentum_score}</td>"
            f"<td>{escape(item.theme)}</td>"
            f"<td>{escape(item.reasons)}</td>"
            "</tr>"
        )
        for item in candidates
    )

    if not rows_html:
        rows_html = '<tr><td colspan="7">No candidates passed filters.</td></tr>'

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Korean Theme Flow Screener Report</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 24px; }}
    table {{ border-collapse: collapse; width: 100%; }}
    th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
    th {{ background-color: #f2f2f2; }}
  </style>
</head>
<body>
  <h1>Korean Theme Flow Screener Report</h1>
  <p>Generated at: {generated_at.strftime('%Y-%m-%d %H:%M:%S')}</p>
  <table>
    <thead>
      <tr>
        <th>code</th>
        <th>total_score</th>
        <th>theme_score</th>
        <th>flow_score</th>
        <th>momentum_score</th>
        <th>theme</th>
        <th>reasons</th>
      </tr>
    </thead>
    <tbody>
      {rows_html}
    </tbody>
  </table>
</body>
</html>
"""

    file_path.write_text(html, encoding="utf-8")
