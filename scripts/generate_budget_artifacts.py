#!/usr/bin/env python3
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from xml.sax.saxutils import escape
import textwrap
import zipfile


ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "deliverables"
XLSX_PATH = OUT_DIR / "project-budget-table.xlsx"
PDF_PATH = OUT_DIR / "project-metrics-summary.pdf"


SUMMARY = {
    "useful_raw_lines": 5149,
    "useful_chars": 163345,
    "norm65": 2513.00,
    "ifpug_lite_fp": 112,
    "project_value_brl": 3280.00,
    "value_per_fp_brl": 29.29,
    "value_per_norm65_brl": 1.31,
    "value_per_useful_line_brl": 0.64,
    "mei_das_monthly_brl": 86.05,
    "mei_net_after_das_brl": 3193.95,
    "mei_gross_to_preserve_net_brl": 3366.05,
}

MODULES = [
    {
        "module": "Visual shared layer",
        "functional_scope": "shell, layout, styles, tokens, entry structure",
        "fp": "",
        "norm65": 696.97,
        "weight_basis": "large technical mass, medium architectural relevance, lower direct business criticality",
        "module_value_brl": 665.73,
    },
    {
        "module": "Runtime and foundation",
        "functional_scope": "app runtime, route handling, shared state, session, data normalization, shared shell components",
        "fp": "",
        "norm65": 643.57,
        "weight_basis": "highest architectural importance, high business continuity",
        "module_value_brl": 1065.09,
    },
    {
        "module": "Property discovery",
        "functional_scope": "featured inventory, listing, filtering, comparison, detail, favorites",
        "fp": 31,
        "norm65": 356.11,
        "weight_basis": "strong user-facing value, relevant search flow",
        "module_value_brl": 522.96,
    },
    {
        "module": "Lead capture",
        "functional_scope": "property proposal, announce flow, contact, quiz",
        "fp": 27,
        "norm65": 137.05,
        "weight_basis": "commercially important, lower code mass",
        "module_value_brl": 168.01,
    },
    {
        "module": "Admin and CMS",
        "functional_scope": "login, dashboard, collections, property editor, CMS integration",
        "fp": 44,
        "norm65": 466.57,
        "weight_basis": "high write-criticality and operational importance",
        "module_value_brl": 774.54,
    },
    {
        "module": "PDF utility",
        "functional_scope": "proposal PDF generation support",
        "fp": "",
        "norm65": 212.74,
        "weight_basis": "auxiliary feature, lower runtime centrality",
        "module_value_brl": 83.67,
    },
]

PACKAGES = [
    ["Discovery and brand", "homepage, featured inventory, broker showcase", 10, 292.90],
    ["Property discovery", "listing, filters, compare, detail, favorites", 31, 908.00],
    ["Lead capture", "proposal, announce, contact, quiz", 27, 790.83],
    ["Admin and CMS", "login, dashboard, collection browsing, property CRUD, CMS source", 44, 1288.76],
]

FUNCTION_REFERENCE = [
    [3, 87.87, 67.32, 137.91],
    [4, 117.16, 89.76, 183.88],
    [5, 146.45, 112.20, 229.85],
    [10, 292.90, 224.40, 459.70],
]

MEI = [
    ["Formula", "DAS-MEI de servicos = 5% do salario minimo + R$ 5,00"],
    ["Assumed minimum wage", "R$ 1.621,00"],
    ["Estimated monthly INSS", "R$ 81,05"],
    ["Estimated monthly DAS-MEI", "R$ 86,05"],
    ["Net after one DAS", "R$ 3.193,95"],
    ["Gross to preserve R$ 3.280,00 net", "R$ 3.366,05"],
]


def money(value: float) -> str:
    return f"R$ {value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def make_rows() -> dict[str, list[list[object]]]:
    return {
        "Summary": [
            ["Metric", "Value"],
            ["Useful raw lines", SUMMARY["useful_raw_lines"]],
            ["Useful chars", SUMMARY["useful_chars"]],
            ["norm65", SUMMARY["norm65"]],
            ["IFPUG-lite FP", SUMMARY["ifpug_lite_fp"]],
            ["Project value", money(SUMMARY["project_value_brl"])],
            ["Value per FP", money(SUMMARY["value_per_fp_brl"])],
            ["Value per norm65", money(SUMMARY["value_per_norm65_brl"])],
            ["Value per useful line", money(SUMMARY["value_per_useful_line_brl"])],
        ],
        "Modules": [
            ["Module", "Functional scope", "FP", "norm65", "Weight basis", "Module value"]
        ] + [
            [
                row["module"],
                row["functional_scope"],
                row["fp"],
                row["norm65"],
                row["weight_basis"],
                money(row["module_value_brl"]),
            ]
            for row in MODULES
        ],
        "Packages": [
            ["Functional package", "Included functions", "FP", "Approx. value"]
        ] + [[name, scope, fp, money(value)] for name, scope, fp, value in PACKAGES],
        "FunctionRef": [
            ["Function size FP", "Approx. value", "Approx. norm65", "Approx. useful lines"]
        ] + [[fp, money(value), norm, lines] for fp, value, norm, lines in FUNCTION_REFERENCE],
        "MEI": [["Item", "Value"]] + MEI,
    }


def col_letter(index: int) -> str:
    out = ""
    while index:
        index, rem = divmod(index - 1, 26)
        out = chr(65 + rem) + out
    return out


def cell_xml(row_idx: int, col_idx: int, value: object) -> str:
    ref = f"{col_letter(col_idx)}{row_idx}"
    if isinstance(value, (int, float)) and value != "":
        return f'<c r="{ref}"><v>{value}</v></c>'
    return f'<c r="{ref}" t="inlineStr"><is><t>{escape(str(value))}</t></is></c>'


def sheet_xml(rows: list[list[object]]) -> str:
    body = []
    for r_idx, row in enumerate(rows, start=1):
        cells = "".join(cell_xml(r_idx, c_idx, value) for c_idx, value in enumerate(row, start=1))
        body.append(f'<row r="{r_idx}">{cells}</row>')
    dim = f"A1:{col_letter(max(len(r) for r in rows))}{len(rows)}"
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        f'<dimension ref="{dim}"/>'
        '<sheetViews><sheetView workbookViewId="0"/></sheetViews>'
        '<sheetFormatPr defaultRowHeight="15"/>'
        f'<sheetData>{"".join(body)}</sheetData>'
        "</worksheet>"
    )


def workbook_xml(sheet_names: Iterable[str]) -> str:
    sheets = "".join(
        f'<sheet name="{escape(name)}" sheetId="{idx}" r:id="rId{idx}"/>'
        for idx, name in enumerate(sheet_names, start=1)
    )
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f"<sheets>{sheets}</sheets></workbook>"
    )


def workbook_rels(sheet_count: int) -> str:
    rels = []
    for idx in range(1, sheet_count + 1):
        rels.append(
            f'<Relationship Id="rId{idx}" '
            'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
            f'Target="worksheets/sheet{idx}.xml"/>'
        )
    rels.append(
        f'<Relationship Id="rId{sheet_count + 1}" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" '
        'Target="styles.xml"/>'
    )
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        f"{''.join(rels)}</Relationships>"
    )


def content_types(sheet_count: int) -> str:
    overrides = [
        '<Override PartName="/xl/workbook.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
        '<Override PartName="/xl/styles.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>',
        '<Override PartName="/docProps/core.xml" '
        'ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
        '<Override PartName="/docProps/app.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>',
    ]
    overrides += [
        f'<Override PartName="/xl/worksheets/sheet{idx}.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        for idx in range(1, sheet_count + 1)
    ]
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        f"{''.join(overrides)}</Types>"
    )


def root_rels() -> str:
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
        'Target="xl/workbook.xml"/>'
        '<Relationship Id="rId2" '
        'Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" '
        'Target="docProps/core.xml"/>'
        '<Relationship Id="rId3" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" '
        'Target="docProps/app.xml"/>'
        "</Relationships>"
    )


def styles_xml() -> str:
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        '<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>'
        '<fills count="1"><fill><patternFill patternType="none"/></fill></fills>'
        '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
        '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
        '<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>'
        '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
        "</styleSheet>"
    )


def app_props(sheet_names: Iterable[str]) -> str:
    titles = "".join(f"<vt:lpstr>{escape(name)}</vt:lpstr>" for name in sheet_names)
    sheet_count = len(list(sheet_names))
    # sheet_names may be generator; caller passes list.
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
        'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
        '<Application>Codex</Application>'
        f'<TitlesOfParts><vt:vector size="{sheet_count}" baseType="lpstr">{titles}</vt:vector></TitlesOfParts>'
        "</Properties>"
    )


def core_props() -> str:
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<cp:coreProperties '
        'xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
        'xmlns:dc="http://purl.org/dc/elements/1.1/" '
        'xmlns:dcterms="http://purl.org/dc/terms/" '
        'xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
        '<dc:title>Project Budget Table</dc:title>'
        '<dc:creator>Codex</dc:creator>'
        f'<dcterms:created xsi:type="dcterms:W3CDTF">{timestamp}</dcterms:created>'
        f'<dcterms:modified xsi:type="dcterms:W3CDTF">{timestamp}</dcterms:modified>'
        "</cp:coreProperties>"
    )


def write_xlsx() -> None:
    rows = make_rows()
    sheet_names = list(rows.keys())
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(XLSX_PATH, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types(len(sheet_names)))
        zf.writestr("_rels/.rels", root_rels())
        zf.writestr("xl/workbook.xml", workbook_xml(sheet_names))
        zf.writestr("xl/_rels/workbook.xml.rels", workbook_rels(len(sheet_names)))
        zf.writestr("xl/styles.xml", styles_xml())
        zf.writestr("docProps/app.xml", app_props(sheet_names))
        zf.writestr("docProps/core.xml", core_props())
        for idx, name in enumerate(sheet_names, start=1):
            zf.writestr(f"xl/worksheets/sheet{idx}.xml", sheet_xml(rows[name]))


def pdf_escape(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


@dataclass
class PdfPage:
    lines: list[tuple[int, str, int]]


def wrap_lines(text: str, width: int) -> list[str]:
    return textwrap.wrap(text, width=width, break_long_words=False, replace_whitespace=False) or [""]


def build_pdf_pages() -> list[PdfPage]:
    pages: list[PdfPage] = []
    current: list[tuple[int, str, int]] = []
    y = 800

    def add_line(text: str, size: int = 11, indent: int = 50) -> None:
        nonlocal y, current, pages
        if y < 60:
            pages.append(PdfPage(current))
            current = []
            y = 800
        current.append((indent, text, size))
        y -= size + 6

    add_line("Nexus Based Imobiliaria App - Executive Metrics Summary", 16, 50)
    add_line(f"Generated at {datetime.now().strftime('%Y-%m-%d %H:%M')}", 9, 50)
    add_line("", 9, 50)
    for label, value in [
        ("Useful raw lines", SUMMARY["useful_raw_lines"]),
        ("Useful chars", SUMMARY["useful_chars"]),
        ("norm65", f"{SUMMARY['norm65']:.2f}"),
        ("IFPUG-lite", f"{SUMMARY['ifpug_lite_fp']} FP"),
        ("Project value", money(SUMMARY["project_value_brl"])),
    ]:
        add_line(f"{label}: {value}")
    add_line("", 9, 50)
    add_line("Weighted budget by module", 13, 50)
    for row in MODULES:
        add_line(f"{row['module']}: {money(row['module_value_brl'])}", 11, 50)
        for extra in wrap_lines(f"Scope: {row['functional_scope']}. Weight basis: {row['weight_basis']}. norm65: {row['norm65']:.2f}.", 88):
            add_line(extra, 9, 70)
    add_line("", 9, 50)
    add_line("Functional packages", 13, 50)
    for name, scope, fp, value in PACKAGES:
        add_line(f"{name}: {fp} FP - {money(value)}", 11, 50)
        for extra in wrap_lines(scope, 88):
            add_line(extra, 9, 70)
    add_line("", 9, 50)
    add_line("MEI charges", 13, 50)
    for label, value in MEI:
        for extra in wrap_lines(f"{label}: {value}", 90):
            add_line(extra, 10, 50)
    if current:
        pages.append(PdfPage(current))
    return pages


def pdf_stream_for_page(page: PdfPage, page_number: int) -> bytes:
    content = ["BT", "/F1 16 Tf", "50 800 Td", f"({pdf_escape(page.lines[0][1])}) Tj", "ET"]
    for idx, (indent, text, size) in enumerate(page.lines[1:], start=1):
        y = 800 - sum(prev_size + 6 for _, _, prev_size in page.lines[: idx + 0])  # not used directly
    content = []
    y = 800
    for indent, text, size in page.lines:
        content.append("BT")
        content.append(f"/F1 {size} Tf")
        content.append(f"1 0 0 1 {indent} {y} Tm")
        content.append(f"({pdf_escape(text)}) Tj")
        content.append("ET")
        y -= size + 6
    content.extend(
        [
            "BT",
            "/F1 9 Tf",
            f"1 0 0 1 50 30 Tm",
            f"(Page {page_number}) Tj",
            "ET",
        ]
    )
    return "\n".join(content).encode("latin-1", "replace")


def write_pdf() -> None:
    pages = build_pdf_pages()
    objects: list[bytes] = []

    def add_object(body: bytes) -> int:
        objects.append(body)
        return len(objects)

    font_obj = add_object(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    page_objs: list[int] = []
    content_objs: list[int] = []
    pages_placeholder = add_object(b"")

    for idx, page in enumerate(pages, start=1):
        stream = pdf_stream_for_page(page, idx)
        content_obj = add_object(b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream")
        content_objs.append(content_obj)
        page_obj = add_object(
            f"<< /Type /Page /Parent {pages_placeholder} 0 R /MediaBox [0 0 595 842] "
            f"/Resources << /Font << /F1 {font_obj} 0 R >> >> /Contents {content_obj} 0 R >>".encode()
        )
        page_objs.append(page_obj)

    kids = " ".join(f"{obj} 0 R" for obj in page_objs)
    objects[pages_placeholder - 1] = f"<< /Type /Pages /Kids [ {kids} ] /Count {len(page_objs)} >>".encode()
    catalog_obj = add_object(f"<< /Type /Catalog /Pages {pages_placeholder} 0 R >>".encode())

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with PDF_PATH.open("wb") as fh:
        fh.write(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        offsets = [0]
        for idx, body in enumerate(objects, start=1):
            offsets.append(fh.tell())
            fh.write(f"{idx} 0 obj\n".encode())
            fh.write(body)
            fh.write(b"\nendobj\n")
        xref_offset = fh.tell()
        fh.write(f"xref\n0 {len(objects)+1}\n".encode())
        fh.write(b"0000000000 65535 f \n")
        for offset in offsets[1:]:
            fh.write(f"{offset:010d} 00000 n \n".encode())
        fh.write(
            f"trailer\n<< /Size {len(objects)+1} /Root {catalog_obj} 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode()
        )


def main() -> None:
    write_xlsx()
    write_pdf()
    print(f"wrote {XLSX_PATH.relative_to(ROOT)}")
    print(f"wrote {PDF_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
