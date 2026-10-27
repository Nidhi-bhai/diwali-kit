#!/usr/bin/env python3
"""Draw the four free WhatsApp cards at 1080x1350.

The footer string is burned into every file. A blank name plate sits above
it so the browser can write a family name without covering the URL.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "share-cards"
W, H = 1080, 1350
FOOTER = "Free card + your city's puja time: nidhi-bhai.github.io/diwali-kit"
SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SERIF_REG = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"

# Name plate the canvas script fills. Keep these in sync with docs/js/cards.js.
PLATE = (90, 990, 990, 1120)


def font(path, size):
    return ImageFont.truetype(path, size)


def center(draw, text, y, fnt, fill):
    box = draw.textbbox((0, 0), text, font=fnt)
    x = (W - (box[2] - box[0])) / 2
    draw.text((x, y), text, font=fnt, fill=fill)


def diya(draw, cx, cy, bowl, flame):
    draw.ellipse((cx - 78, cy, cx + 78, cy + 70), fill=bowl)
    draw.polygon([(cx, cy - 88), (cx - 26, cy + 8), (cx + 26, cy + 8)], fill=flame)
    draw.polygon([(cx, cy - 58), (cx - 12, cy + 4), (cx + 12, cy + 4)], fill="#fff8ee")


def footer(draw, bar, ink):
    draw.rectangle((0, 1180, W, H), fill=bar)
    draw.rectangle((0, 1180, W, 1188), fill="#c8963e")
    fnt = font(SANS, 28)
    box = draw.textbbox((0, 0), FOOTER, font=fnt)
    x = (W - (box[2] - box[0])) / 2
    draw.text((x, 1232), FOOTER, font=fnt, fill=ink)


def plate(draw, fill, hint, hint_fill):
    x0, y0, x1, y1 = PLATE
    draw.rounded_rectangle((x0, y0, x1, y1), radius=18, fill=fill)
    fnt = font(SERIF_REG, 36)
    center(draw, hint, y0 + 42, fnt, hint_fill)


def card(bg, title, subtitle, title_fill, sub_fill, bar, bar_ink, plate_fill, hint, hint_fill, diya_bowl, diya_flame):
    img = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(img)
    diya(draw, W // 2, 250, diya_bowl, diya_flame)
    title_font = font(SERIF, 92 if len(title) < 16 else 78)
    center(draw, title, 470, title_font, title_fill)
    center(draw, subtitle, 620, font(SERIF_REG, 40), sub_fill)
    plate(draw, plate_fill, hint, hint_fill)
    footer(draw, bar, bar_ink)
    return img


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    specs = [
        ("card-1.png", "#541418", "Shubh Deepavali", "Sunday 8 November 2026", "#fff8ee", "#f0d7a6", "#2a0c10", "#f0d7a6", "#fbf6ee", "Your family name", "#8a5a12", "#f0d7a6", "#e39b2b"),
        ("card-2.png", "#fbf6ee", "Happy Diwali", "A lamp, and the people you call", "#541418", "#7a1f24", "#541418", "#fff8ee", "#fffaf3", "Your family name", "#8a5a12", "#c8963e", "#e07a2f"),
        ("card-3.png", "#8a3b12", "Shubh Dhanteras", "Friday 6 November 2026", "#fff8ee", "#f0d7a6", "#3d1a08", "#f0d7a6", "#f8e7c4", "Your family name", "#8a5a12", "#f0d7a6", "#fff4e4"),
        ("card-4.png", "#f4e4c4", "Happy Diwali", "From our family", "#541418", "#7a1f24", "#541418", "#fff8ee", "#fffaf3", "Your family name", "#8a5a12", "#7a1f24", "#e39b2b"),
    ]
    for name, *args in specs:
        img = card(*args)
        path = OUT / name
        img.save(path, "PNG")
        print(path, img.size)


if __name__ == "__main__":
    main()
