# Diwali kit

A static GitHub Pages site in `/docs` for Indians celebrating Diwali 2026 abroad.

- Free guide: `docs/lakshmi-puja.html` (steps, substitutes, Drik Panchang muhurats).
- Free WhatsApp cards: `docs/cards/` and `docs/share-cards/card-1.png` through `card-4.png`. The site URL is printed on each card. They are not part of the paid pack.
- Paid PDF: $7 USD, one time, via PayPal Smart Buttons. The download link is shown in the browser after `capture`, and the order id is kept in `localStorage`.
- PayPal cannot take this payment from buyers in India.

Muhurat times are copied from Drik Panchang city pages. They are not calculated here.

Regenerate the PDF (needs Google Chrome):

```bash
python3 scripts/build_pdf.py
npm test
```

GitHub Pages should serve the `main` branch, folder `/docs`.
