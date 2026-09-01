#!/usr/bin/env python3
"""Render the committed FSS2026 SVG icon design to required PWA PNG sizes."""

from pathlib import Path
import xml.etree.ElementTree as ET

from PIL import Image, ImageDraw, ImageFont


HERE = Path(__file__).resolve().parent
SOURCE = HERE / "icon.svg"
SIZES = (180, 192, 512)
FONT = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
SVG_NS = "{http://www.w3.org/2000/svg}"


def scale(value: str, factor: float) -> int:
    return round(float(value) * factor)


def render(size: int) -> None:
    root = ET.parse(SOURCE).getroot()
    factor = size / 1024
    image = Image.new("RGB", (size, size), "white")
    draw = ImageDraw.Draw(image)

    background = root.find(f"{SVG_NS}rect[@id='background']")
    accent_line = root.find(f"{SVG_NS}rect[@id='accent-line']")
    accent_circle = root.find(f"{SVG_NS}circle[@id='accent-circle']")
    title_fss = root.find(f"{SVG_NS}text[@id='title-fss']")
    title_year = root.find(f"{SVG_NS}text[@id='title-year']")
    if None in (background, accent_line, accent_circle, title_fss, title_year):
        raise ValueError("icon.svg is missing a required design element")

    draw.rounded_rectangle(
        (0, 0, size - 1, size - 1),
        radius=scale(background.attrib["rx"], factor),
        fill=background.attrib["fill"],
    )
    cx = scale(accent_circle.attrib["cx"], factor)
    cy = scale(accent_circle.attrib["cy"], factor)
    radius = scale(accent_circle.attrib["r"], factor)
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=accent_circle.attrib["fill"])
    x = scale(accent_line.attrib["x"], factor)
    y = scale(accent_line.attrib["y"], factor)
    width = scale(accent_line.attrib["width"], factor)
    height = scale(accent_line.attrib["height"], factor)
    draw.rounded_rectangle(
        (x, y, x + width, y + height),
        radius=scale(accent_line.attrib["rx"], factor),
        fill=accent_line.attrib["fill"],
    )

    for element in (title_fss, title_year):
        font = ImageFont.truetype(FONT, scale(element.attrib["font-size"], factor))
        draw.text(
            (scale(element.attrib["x"], factor), scale(element.attrib["y"], factor)),
            element.text,
            font=font,
            fill=element.attrib["fill"],
            anchor="mm",
        )

    image.save(HERE / f"icon-{size}.png", optimize=True)


if __name__ == "__main__":
    if not FONT.is_file():
        raise SystemExit(f"Required font not found: {FONT}")
    for icon_size in SIZES:
        render(icon_size)
