from io import BytesIO
from pathlib import Path

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parent
IMAGE_PATH = ROOT / "proposta.png"
OUTPUT_PATH = ROOT / "proposta_website_suaimobiliaria.pdf"

# Same ratio as proposta.png (1536x1024). This lets the full reference image
# fill one PDF page without stretching, cropping, or white borders.
PAGE_W = 1152
PAGE_H = 768
MARGIN = 58

INK = colors.HexColor("#101A1B")
SOFT_INK = colors.HexColor("#243030")
MUTED = colors.HexColor("#5F6E6A")
GOLD = colors.HexColor("#C9902D")
GOLD_DARK = colors.HexColor("#9E6C19")
CREAM = colors.HexColor("#FBF8EF")
WASH = colors.HexColor("#F4F2EA")
LINE = colors.HexColor("#E0E3DD")
WHITE = colors.white


CROPS = {
    "home": (0, 0, 565, 620),
    "listing": (590, 0, 1036, 612),
    "detail": (1036, 0, 1536, 612),
    "mobile": (620, 620, 1130, 910),
    "dashboard": (1130, 605, 1536, 925),
    "footer": (570, 920, 1536, 1024),
}


def register_fonts():
    fonts_dir = Path("C:/Windows/Fonts")
    candidates = {
        "ProposalSans": fonts_dir / "arial.ttf",
        "ProposalSans-Bold": fonts_dir / "arialbd.ttf",
        "ProposalSerif": fonts_dir / "georgia.ttf",
        "ProposalSerif-Bold": fonts_dir / "georgiab.ttf",
    }
    for name, path in candidates.items():
        if path.exists():
            pdfmetrics.registerFont(TTFont(name, path))


def font(name):
    registered = set(pdfmetrics.getRegisteredFontNames())
    return {
        "sans": "ProposalSans" if "ProposalSans" in registered else "Helvetica",
        "sans_bold": "ProposalSans-Bold" if "ProposalSans-Bold" in registered else "Helvetica-Bold",
        "serif": "ProposalSerif" if "ProposalSerif" in registered else "Times-Roman",
        "serif_bold": "ProposalSerif-Bold" if "ProposalSerif-Bold" in registered else "Times-Bold",
    }[name]


def draw_wrapped(c, text, x, y, width, size=14, leading=19, color=MUTED, font_name=None):
    font_name = font_name or font("sans")
    c.setFillColor(color)
    c.setFont(font_name, size)
    lines = []
    current = ""
    for word in text.split():
        probe = f"{current} {word}".strip()
        if c.stringWidth(probe, font_name, size) <= width:
            current = probe
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)

    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_logo(c, x, y, dark=False):
    stroke = GOLD if dark else colors.HexColor("#F2B548")
    text = INK if dark else WHITE
    c.setStrokeColor(stroke)
    c.setLineWidth(4)
    c.line(x, y, x + 18, y + 14)
    c.line(x + 18, y + 14, x + 36, y)
    c.roundRect(x + 5, y - 20, 26, 20, 4, stroke=1, fill=0)
    c.setFillColor(text)
    c.setFont(font("sans_bold"), 17)
    c.drawString(x + 48, y - 12, "SuaImobiliária")


def draw_footer(c, page_label):
    c.setStrokeColor(LINE)
    c.line(MARGIN, 36, PAGE_W - MARGIN, 36)
    c.setFillColor(MUTED)
    c.setFont(font("sans"), 10)
    c.drawString(MARGIN, 20, "Proposta de solução para website imobiliário")
    c.drawRightString(PAGE_W - MARGIN, 20, page_label)


def image_reader_from_crop(box):
    image = Image.open(IMAGE_PATH).convert("RGB")
    crop = image.crop(box)
    buffer = BytesIO()
    crop.save(buffer, format="PNG")
    buffer.seek(0)
    return ImageReader(buffer), crop.size


def draw_image_fit(c, reader, image_size, x, y, w, h, radius=18, stroke=True, mode="fit", align_x=0.5, align_y=0.5):
    iw, ih = image_size
    scale = max(w / iw, h / ih) if mode == "cover" else min(w / iw, h / ih)
    draw_w = iw * scale
    draw_h = ih * scale
    dx = x + (w - draw_w) * align_x
    dy = y + (h - draw_h) * align_y

    c.setFillColor(WHITE)
    c.roundRect(x, y, w, h, radius, stroke=0, fill=1)
    c.saveState()
    clip = c.beginPath()
    clip.roundRect(x, y, w, h, radius)
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(reader, dx, dy, width=draw_w, height=draw_h, preserveAspectRatio=True, mask="auto")
    c.restoreState()
    if stroke:
        c.setStrokeColor(LINE)
        c.setLineWidth(2)
        c.roundRect(x, y, w, h, radius, stroke=1, fill=0)
    return dx, dy, draw_w, draw_h


def badge(c, x, y, label, fill=GOLD):
    c.setFillColor(fill)
    c.roundRect(x, y, 42, 42, 12, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont(font("sans_bold"), 16)
    c.drawCentredString(x + 21, y + 13, label)


def draw_arrow(c, x1, y1, x2, y2, color=GOLD):
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(2.2)
    c.line(x1, y1, x2, y2)
    # Small triangular arrow head.
    if x2 >= x1:
        points = [x2, y2, x2 - 9, y2 + 5, x2 - 9, y2 - 5]
    else:
        points = [x2, y2, x2 + 9, y2 + 5, x2 + 9, y2 - 5]
    path = c.beginPath()
    path.moveTo(points[0], points[1])
    path.lineTo(points[2], points[3])
    path.lineTo(points[4], points[5])
    path.close()
    c.drawPath(path, stroke=0, fill=1)


def frame_anchor(layout, side, x_pad=0, y_pad=0, ratio=0.5):
    if side == "left":
        return layout["crop_x"] + x_pad, layout["crop_y"] + layout["crop_h"] * ratio + y_pad
    if side == "right":
        return layout["crop_x"] + layout["crop_w"] + x_pad, layout["crop_y"] + layout["crop_h"] * ratio + y_pad
    if side == "top":
        return layout["crop_x"] + layout["crop_w"] * ratio + x_pad, layout["crop_y"] + y_pad
    return layout["crop_x"] + layout["crop_w"] * ratio + x_pad, layout["crop_y"] + layout["crop_h"] + y_pad


def cover_page(c):
    c.setFillColor(INK)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(colors.HexColor("#162526"))
    c.circle(PAGE_W - 120, PAGE_H - 80, 280, stroke=0, fill=1)
    c.setFillColor(colors.HexColor("#221C11"))
    c.circle(80, 80, 230, stroke=0, fill=1)

    draw_logo(c, MARGIN, PAGE_H - 72)
    c.setFillColor(colors.HexColor("#F5D597"))
    c.setFont(font("sans_bold"), 12)
    c.drawString(MARGIN, PAGE_H - 180, "PROPOSTA DE SOLUÇÃO")

    c.setFillColor(WHITE)
    c.setFont(font("serif_bold"), 60)
    c.drawString(MARGIN, PAGE_H - 252, "Website imobiliário")
    c.drawString(MARGIN, PAGE_H - 318, "a partir do layout")

    intro = (
        "Leitura executiva da proposta visual em quatro páginas: contexto, "
        "referência completa, mapa de features e provocações para retorno."
    )
    draw_wrapped(c, intro, MARGIN, PAGE_H - 382, 650, 18, 28, colors.HexColor("#DDE5DF"))

    labels = [
        ("01", "Visão geral da proposta"),
        ("02", "Referência visual integral"),
        ("03", "Mapa de features"),
        ("04", "Provocações para retorno"),
    ]
    x = MARGIN
    y = 156
    for idx, (num, text) in enumerate(labels):
        cx = x + idx * 260
        c.setFillColor(colors.Color(1, 1, 1, alpha=0.08))
        c.roundRect(cx, y, 238, 92, 18, stroke=0, fill=1)
        badge(c, cx + 18, y + 25, num)
        c.setFillColor(WHITE)
        c.setFont(font("sans_bold"), 14)
        draw_wrapped(c, text, cx + 72, y + 56, 145, 13.5, 17, WHITE, font("sans_bold"))


def image_page(c):
    image = Image.open(IMAGE_PATH).convert("RGB")
    c.drawImage(ImageReader(image), 0, 0, width=PAGE_W, height=PAGE_H, preserveAspectRatio=False, mask="auto")


def feature_card(c, x, y, w, h, number, title, items):
    c.setFillColor(WHITE)
    c.roundRect(x, y, w, h, 20, stroke=0, fill=1)
    c.setStrokeColor(LINE)
    c.setLineWidth(2)
    c.roundRect(x, y, w, h, 20, stroke=1, fill=0)

    badge(c, x + 18, y + h - 58, number)
    c.setFillColor(INK)
    c.setFont(font("sans_bold"), 18)
    c.drawString(x + 74, y + h - 42, title)

    text_y = y + h - 82
    for item in items:
        c.setFillColor(GOLD_DARK)
        c.circle(x + 30, text_y + 4, 3.2, stroke=0, fill=1)
        text_y = draw_wrapped(c, item, x + 44, text_y, w - 64, 12.4, 17, MUTED)
        text_y -= 5


def feature_page(c):
    c.setFillColor(WASH)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    draw_logo(c, MARGIN, PAGE_H - 58, dark=True)
    c.setFillColor(GOLD_DARK)
    c.setFont(font("sans_bold"), 12)
    c.drawString(MARGIN, PAGE_H - 124, "MAPA DE FEATURES")
    c.setFillColor(INK)
    c.setFont(font("serif_bold"), 40)
    c.drawString(MARGIN, PAGE_H - 172, "O que a interface resolve")
    draw_wrapped(
        c,
        "Abaixo estão os blocos funcionais que aparecem no design. Nas páginas seguintes, cada bloco é explicado a partir do recorte correspondente da imagem original.",
        MARGIN,
        PAGE_H - 208,
        770,
        14,
        21,
        MUTED,
    )

    features = [
        ("01", "Aquisição", ["Hero com busca por finalidade, localização e preço.", "Provas de confiança e imóveis em destaque."]),
        ("02", "Catálogo", ["Filtros laterais e listagem objetiva.", "Comparação rápida por preço, área e atributos."]),
        ("03", "Conversão", ["Galeria, ficha do imóvel e chamadas de contato.", "WhatsApp, ligação e agendamento em destaque."]),
        ("04", "Mobile", ["Favoritos, anúncio de imóvel e quiz de busca.", "Fluxos curtos para leads em tela pequena."]),
        ("05", "Gestão", ["Dashboard para imóveis, leads e visitas.", "Atividades recentes e ranking de acesso."]),
        ("06", "Rodapé", ["Mapa institucional, ajuda e contato.", "Fechamento de credibilidade e canais diretos."]),
    ]

    cols = 3
    gap = 24
    card_w = (PAGE_W - 2 * MARGIN - (cols - 1) * gap) / cols
    card_h = 176
    start_y = 336
    for index, data in enumerate(features):
        col = index % cols
        row = index // cols
        x = MARGIN + col * (card_w + gap)
        y = start_y - row * (card_h + 28)
        feature_card(c, x, y, card_w, card_h, *data)
    draw_footer(c, "03")


def crop_explainer_page(c, page_no, crop_key, section, title, body, bullets, notes):
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    draw_logo(c, MARGIN, PAGE_H - 58, dark=True)

    c.setFillColor(GOLD_DARK)
    c.setFont(font("sans_bold"), 12)
    c.drawString(MARGIN, PAGE_H - 120, section.upper())
    c.setFillColor(INK)
    c.setFont(font("serif_bold"), 38)
    c.drawString(MARGIN, PAGE_H - 166, title)
    draw_wrapped(c, body, MARGIN, PAGE_H - 202, 470, 14, 21, MUTED)

    layout_map = {
        "default": {
            "crop_x": 568,
            "crop_y": 156,
            "crop_w": 526,
            "crop_h": 500,
            "crop_mode": "fit",
            "crop_align_x": 0.5,
            "crop_align_y": 0.5,
            "panel_x": MARGIN,
            "panel_y": 118,
            "panel_w": 454,
            "panel_h": 310,
            "panel_title_y": 378,
            "panel_text_y": 336,
            "panel_text_w": 340,
            "bullet_gap": 34,
            "note_y": 92,
            "arrows": [
                {"start": (512, 382), "side": "left", "x_pad": -6, "ratio": 0.80},
                {"start": (512, 246), "side": "left", "x_pad": -6, "ratio": 0.40},
            ],
        },
        "home": {
            "crop_x": 568,
            "crop_y": 150,
            "crop_w": 530,
            "crop_h": 506,
            "crop_mode": "fit",
            "crop_align_x": 0.5,
            "crop_align_y": 0.5,
            "panel_x": MARGIN,
            "panel_y": 118,
            "panel_w": 454,
            "panel_h": 310,
            "panel_title_y": 378,
            "panel_text_y": 336,
            "panel_text_w": 340,
            "bullet_gap": 34,
            "note_y": 92,
            "arrows": [
                {"start": (512, 392), "side": "left", "x_pad": 26, "ratio": 0.74},
                {"start": (512, 250), "side": "left", "x_pad": 26, "ratio": 0.16},
            ],
        },
        "listing": {
            "crop_x": 568,
            "crop_y": 150,
            "crop_w": 530,
            "crop_h": 506,
            "crop_mode": "fit",
            "crop_align_x": 0.5,
            "crop_align_y": 0.5,
            "panel_x": MARGIN,
            "panel_y": 118,
            "panel_w": 454,
            "panel_h": 310,
            "panel_title_y": 378,
            "panel_text_y": 336,
            "panel_text_w": 340,
            "bullet_gap": 34,
            "note_y": 92,
            "arrows": [
                {"start": (512, 382), "side": "left", "x_pad": 40, "ratio": 0.48},
                {"start": (512, 246), "side": "left", "x_pad": 40, "ratio": 0.84},
            ],
        },
        "detail": {
            "crop_x": 568,
            "crop_y": 150,
            "crop_w": 530,
            "crop_h": 506,
            "crop_mode": "fit",
            "crop_align_x": 0.5,
            "crop_align_y": 0.5,
            "panel_x": MARGIN,
            "panel_y": 118,
            "panel_w": 454,
            "panel_h": 310,
            "panel_title_y": 378,
            "panel_text_y": 336,
            "panel_text_w": 340,
            "bullet_gap": 34,
            "note_y": 92,
            "arrows": [
                {"start": (512, 382), "side": "left", "x_pad": 36, "ratio": 0.36},
                {"start": (512, 246), "side": "left", "x_pad": 36, "ratio": 0.78},
            ],
        },
        "mobile": {
            "crop_x": 570,
            "crop_y": 224,
            "crop_w": 526,
            "crop_h": 286,
            "crop_mode": "cover",
            "crop_align_x": 0.54,
            "crop_align_y": 0.5,
            "panel_x": MARGIN,
            "panel_y": 118,
            "panel_w": 462,
            "panel_h": 300,
            "panel_title_y": 378,
            "panel_text_y": 338,
            "panel_text_w": 334,
            "bullet_gap": 42,
            "note_y": 92,
            "arrows": [
                {"start": (520, 378), "side": "left", "x_pad": 34, "ratio": 0.38},
                {"start": (520, 236), "side": "left", "x_pad": 34, "ratio": 0.72},
            ],
        },
        "footer": {
            "crop_x": 568,
            "crop_y": 390,
            "crop_w": 526,
            "crop_h": 70,
            "crop_mode": "cover",
            "crop_align_x": 0.5,
            "crop_align_y": 0.5,
            "panel_x": MARGIN,
            "panel_y": 118,
            "panel_w": 454,
            "panel_h": 310,
            "panel_title_y": 378,
            "panel_text_y": 336,
            "panel_text_w": 340,
            "bullet_gap": 34,
            "note_y": 92,
            "arrows": [
                {"start": (512, 382), "side": "left", "x_pad": -6, "ratio": 0.58},
                {"start": (512, 246), "side": "left", "x_pad": -6, "ratio": 0.40},
            ],
        },
        "dashboard": {
            "crop_x": 556,
            "crop_y": 140,
            "crop_w": 540,
            "crop_h": 418,
            "crop_mode": "cover",
            "crop_align_x": 0.5,
            "crop_align_y": 0.5,
            "panel_x": MARGIN,
            "panel_y": 126,
            "panel_w": 456,
            "panel_h": 290,
            "panel_title_y": 366,
            "panel_text_y": 326,
            "panel_text_w": 344,
            "bullet_gap": 34,
            "note_y": 84,
            "arrows": [
                {"start": (500, 356), "side": "left", "x_pad": 28, "ratio": 0.44},
                {"start": (500, 228), "side": "left", "x_pad": 28, "ratio": 0.82},
            ],
        },
    }
    layout = layout_map.get(crop_key, layout_map["default"])

    reader, size = image_reader_from_crop(CROPS[crop_key])
    drawn = draw_image_fit(
        c,
        reader,
        size,
        layout["crop_x"],
        layout["crop_y"],
        layout["crop_w"],
        layout["crop_h"],
        mode=layout["crop_mode"],
        align_x=layout["crop_align_x"],
        align_y=layout["crop_align_y"],
    )

    c.setFillColor(INK)
    c.roundRect(layout["panel_x"], layout["panel_y"], layout["panel_w"], layout["panel_h"], 22, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont(font("sans_bold"), 18)
    c.drawString(layout["panel_x"] + 24, layout["panel_title_y"], "Leitura do recorte")
    text_y = layout["panel_text_y"]
    for idx, bullet in enumerate(bullets, 1):
        badge(c, layout["panel_x"] + 24, text_y - 10, f"{idx:02}", GOLD if idx % 2 else SOFT_INK)
        text_y = draw_wrapped(
            c,
            bullet,
            layout["panel_x"] + 82,
            text_y + 2,
            layout["panel_text_w"],
            12.5,
            17,
            colors.HexColor("#DDE5DF"),
        )
        text_y -= layout["bullet_gap"]

    note_y = layout["note_y"]
    c.setFillColor(GOLD_DARK)
    c.setFont(font("sans_bold"), 11)
    c.drawString(MARGIN, note_y, "PONTO DE ATENÇÃO")
    draw_wrapped(c, notes, MARGIN + 128, note_y, 390, 11.5, 16, MUTED)

    draw_footer(c, f"{page_no:02}")


def provocations_page(c):
    c.setFillColor(INK)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    draw_logo(c, MARGIN, PAGE_H - 58)
    c.setFillColor(colors.HexColor("#F5D597"))
    c.setFont(font("sans_bold"), 12)
    c.drawString(MARGIN, PAGE_H - 126, "RETORNO E PRÓXIMAS DECISÕES")
    c.setFillColor(WHITE)
    c.setFont(font("serif_bold"), 44)
    c.drawString(MARGIN, PAGE_H - 180, "Provocações para avançar")
    draw_wrapped(
        c,
        "A proposta visual já sugere uma direção forte. Para transformar isso em produto, as respostas abaixo ajudam a priorizar escopo, conteúdo e integrações.",
        MARGIN,
        PAGE_H - 222,
        760,
        15,
        22,
        colors.HexColor("#DDE5DF"),
    )

    questions = [
        "A prioridade inicial é vender, alugar, captar imóveis ou fortalecer marca?",
        "Quais filtros realmente mudam a decisão do cliente na operação atual?",
        "O lead deve cair em WhatsApp, CRM, e-mail ou painel interno?",
        "Quais dados do dashboard precisam ser reais já na primeira versão?",
        "A equipe terá autonomia para cadastrar imóveis, fotos e corretores?",
        "Quais textos e imagens precisam vir prontos para lançamento?",
    ]
    x = MARGIN
    y = PAGE_H - 318
    for idx, question in enumerate(questions, 1):
        row = (idx - 1) // 2
        col = (idx - 1) % 2
        cx = x + col * 520
        cy = y - row * 126
        c.setFillColor(colors.Color(1, 1, 1, alpha=0.08))
        c.roundRect(cx, cy - 70, 488, 92, 18, stroke=0, fill=1)
        badge(c, cx + 18, cy - 44, f"{idx:02}", GOLD if idx % 2 else colors.HexColor("#223335"))
        draw_wrapped(c, question, cx + 78, cy - 15, 370, 13.5, 18, WHITE, font("sans_bold"))

    c.setFillColor(colors.HexColor("#F5D597"))
    c.setFont(font("sans_bold"), 16)
    c.drawString(MARGIN, 76, "Sugestão de retorno: validar prioridades, aprovar direção visual e fechar a primeira versão funcional.")


def main():
    if not IMAGE_PATH.exists():
        raise FileNotFoundError(f"Imagem não encontrada: {IMAGE_PATH}")

    register_fonts()
    c = canvas.Canvas(str(OUTPUT_PATH), pagesize=(PAGE_W, PAGE_H))
    c.setTitle("Proposta de solução para website imobiliário")
    c.setAuthor("SuaImobiliária")

    cover_page(c)
    c.showPage()
    image_page(c)
    c.showPage()
    feature_page(c)
    c.showPage()

    provocations_page(c)
    c.save()
    print(OUTPUT_PATH)


if __name__ == "__main__":
    main()
