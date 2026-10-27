#!/usr/bin/env python3
"""Render the printable kit and the social image."""
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "scripts" / "kit-print.html"
PDF = ROOT / "docs" / "pack" / "diwali-2026-puja-kit.pdf"
OG = ROOT / "docs" / "og.png"


def build_pdf():
    PDF.parent.mkdir(parents=True, exist_ok=True)
    if PDF.exists():
        PDF.unlink()
    cmd = [
        "google-chrome",
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--no-pdf-header-footer",
        f"--print-to-pdf={PDF}",
        HTML.as_uri(),
    ]
    subprocess.check_call(cmd)
    if not PDF.exists() or PDF.stat().st_size < 10000:
        sys.exit("PDF was not written")
    print(f"wrote {PDF} ({PDF.stat().st_size} bytes)")


def build_og():
    img = Image.new("RGB", (1200, 630), "#541418")
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 560, 1200, 630), fill="#c8963e")
    try:
        title = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf", 84)
        sub = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf", 36)
    except OSError:
        title = ImageFont.load_default()
        sub = title
    draw.text((80, 160), "Diwali 2026", font=title, fill="#fff8ee")
    draw.text((80, 280), "Lakshmi Puja kit", font=title, fill="#f0d7a6")
    draw.text((80, 430), "A printable guide for Indians living abroad", font=sub, fill="#fff8ee")
    img.save(OG, "PNG")
    print(f"wrote {OG}")


if __name__ == "__main__":
    build_og()
    build_pdf()
