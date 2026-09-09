import math
from datetime import datetime

class PDFGeneratorService:
    """
    Centralized pure-Python standard PDF 1.4 document builder.
    Produces valid multi-page PDF binary streams with structured headers,
    summary statistics, active filter tags, aligned data tables,
    footers, and page numbers.
    """

    @staticmethod
    def _escape_pdf(text):
        if text is None:
            return ""
        return str(text).replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

    @classmethod
    def generate_report_pdf(cls, title, columns, rows, summary_metrics=None, filter_info=None, user_info=None):
        """
        Generates a multi-page PDF 1.4 document.

        :param title: str - e.g. "SLTB SAFETRACK AI - BUS MANAGEMENT REPORT"
        :param columns: list of dicts - e.g. [{'header': 'Bus ID', 'width': 12, 'align': 'left'}, ...]
                        Total widths should sum to ~85-95 chars for standard portrait.
        :param rows: list of lists or dicts matching column keys.
        :param summary_metrics: dict or list of tuples - e.g. [('Total Buses', 12), ('Active', 10)]
        :param filter_info: dict or list of tuples - e.g. [('Service Type', 'Luxury'), ('Status', 'Active')]
        :param user_info: str or dict - e.g. "Admin (ID: 1)"
        :return: bytes - valid PDF binary stream
        """
        gen_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Compute rows per page
        # Page 1 has title, metadata, summary block -> ~30-35 table rows
        # Page 2+ has title line, table headers -> ~48-52 table rows
        p1_capacity = 32 if (summary_metrics or filter_info) else 40
        p2_capacity = 48

        total_rows = len(rows)
        if total_rows <= p1_capacity:
            num_pages = 1
            page_row_chunks = [rows]
        else:
            remaining_rows = rows[p1_capacity:]
            subsequent_chunks = [
                remaining_rows[i:i + p2_capacity]
                for i in range(0, len(remaining_rows), p2_capacity)
            ]
            page_row_chunks = [rows[:p1_capacity]] + subsequent_chunks
            num_pages = len(page_row_chunks)

        # Build column header string
        header_parts = []
        div_parts = []
        for col in columns:
            w = col.get('width', 15)
            h = col.get('header', '')
            align = col.get('align', 'left')
            if align == 'right':
                header_parts.append(f"{h:>{w}}")
            else:
                header_parts.append(f"{h:<{w}}")
            div_parts.append("-" * w)

        col_header_str = " ".join(header_parts)
        col_divider_str = "-".join(div_parts)

        # Generate content stream for each page
        page_streams = []

        for p_idx, page_rows in enumerate(page_row_chunks, 1):
            lines = []
            lines.append("BT")
            lines.append("/F1 14 Tf")
            lines.append("40 765 Td")
            
            # Header Title
            doc_title = title if not title.upper().startswith("SLTB") else title
            lines.append(f"({cls._escape_pdf(doc_title)}) Tj")

            if p_idx == 1:
                # Subtitle & Generation Info
                lines.append("/F1 9 Tf")
                lines.append("0 -16 Td")
                user_str = f" | User: {user_info}" if user_info else ""
                lines.append(f"(Generated: {cls._escape_pdf(gen_time)}{cls._escape_pdf(user_str)} | System: SLTB SafeTrack AI Live MySQL) Tj")

                # Filters Block
                if filter_info:
                    lines.append("0 -13 Td")
                    if isinstance(filter_info, dict):
                        f_items = [f"{k}: {v}" for k, v in filter_info.items() if v not in (None, '', 'all', 'All')]
                    else:
                        f_items = [f"{k}: {v}" for k, v in filter_info if v not in (None, '', 'all', 'All')]
                    f_str = " | ".join(f_items) if f_items else "All Records (No active filters)"
                    lines.append(f"(Active Filters: {cls._escape_pdf(f_str)}) Tj")

                # Summary Statistics Block
                if summary_metrics:
                    lines.append("0 -13 Td")
                    if isinstance(summary_metrics, dict):
                        s_items = [f"{k}: {v}" for k, v in summary_metrics.items()]
                    else:
                        s_items = [f"{k}: {v}" for k, v in summary_metrics]
                    s_str = "  |  ".join(s_items)
                    lines.append(f"(Summary: {cls._escape_pdf(s_str)}) Tj")

                # Table Header
                lines.append("0 -18 Td")
                lines.append("/F1 8 Tf")
                lines.append(f"({cls._escape_pdf(col_header_str)}) Tj")
                lines.append("0 -4 Td")
                lines.append(f"({cls._escape_pdf(col_divider_str)}) Tj")

            else:
                # Subsequent pages header
                lines.append("/F1 8 Tf")
                lines.append("0 -16 Td")
                lines.append(f"(Continued - Page {p_idx} of {num_pages} | Generated: {cls._escape_pdf(gen_time)}) Tj")
                lines.append("0 -14 Td")
                lines.append(f"({cls._escape_pdf(col_header_str)}) Tj")
                lines.append("0 -4 Td")
                lines.append(f"({cls._escape_pdf(col_divider_str)}) Tj")

            # Data Rows
            lines.append("/F1 8 Tf")
            for row in page_rows:
                lines.append("0 -11 Td")
                row_parts = []
                for col in columns:
                    w = col.get('width', 15)
                    key = col.get('key')
                    align = col.get('align', 'left')
                    
                    if isinstance(row, dict):
                        val = row.get(key, '')
                    elif isinstance(row, (list, tuple)):
                        idx = col.get('index', 0)
                        val = row[idx] if idx < len(row) else ''
                    else:
                        val = str(row)

                    val_str = str(val) if val is not None else '—'
                    # Truncate if exceeds width
                    if len(val_str) > w:
                        val_str = val_str[:w - 1] + "."

                    if align == 'right':
                        row_parts.append(f"{val_str:>{w}}")
                    else:
                        row_parts.append(f"{val_str:<{w}}")

                row_line = " ".join(row_parts)
                lines.append(f"({cls._escape_pdf(row_line)}) Tj")

            if not page_rows:
                lines.append("0 -15 Td")
                lines.append("(No matching records found in live MySQL database.) Tj")

            # Footer
            lines.append("ET")
            
            # Bottom footer text
            lines.append("BT")
            lines.append("/F1 8 Tf")
            lines.append("40 30 Td")
            footer_text = f"SLTB SafeTrack AI  |  Confidential Official Report  |  Page {p_idx} of {num_pages}"
            lines.append(f"({cls._escape_pdf(footer_text)}) Tj")
            lines.append("ET")

            stream_content = "\n".join(lines).encode('latin-1', errors='replace')
            page_streams.append(stream_content)

        # Assemble PDF Objects
        # Obj 1: Catalog -> Pages (2)
        # Obj 2: Pages -> Kids [3, 5, 7, ...]
        # For each page i:
        #   Obj (3 + 2*i): Page -> Contents (4 + 2*i)
        #   Obj (4 + 2*i): Contents stream
        # Font object: Courier
        
        objects = []
        objects.append(b"%PDF-1.4\n")

        # Object index tracker
        # 1: Catalog
        # 2: Pages
        # 3 to 2+2N: Page and Content objects
        # Last object: Font
        font_obj_id = 3 + 2 * num_pages

        page_obj_ids = [3 + 2 * i for i in range(num_pages)]
        kids_str = " ".join([f"{pid} 0 R" for pid in page_obj_ids])

        # Obj 1: Catalog
        obj1 = b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
        # Obj 2: Pages
        obj2 = f"2 0 obj\n<< /Type /Pages /Kids [{kids_str}] /Count {num_pages} >>\nendobj\n".encode('latin-1')

        body = [obj1, obj2]

        for i, stream_bytes in enumerate(page_streams):
            p_obj_id = 3 + 2 * i
            c_obj_id = 4 + 2 * i

            p_obj = (
                f"{p_obj_id} 0 obj\n"
                f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
                f"/Contents {c_obj_id} 0 R /Resources << /Font << /F1 {font_obj_id} 0 R >> >> >>\n"
                f"endobj\n"
            ).encode('latin-1')

            c_obj = (
                f"{c_obj_id} 0 obj\n<< /Length {len(stream_bytes)} >>\nstream\n"
            ).encode('latin-1') + stream_bytes + b"\nendstream\nendobj\n"

            body.append(p_obj)
            body.append(c_obj)

        # Font object: Courier
        font_obj = (
            f"{font_obj_id} 0 obj\n"
            f"<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\n"
            f"endobj\n"
        ).encode('latin-1')
        body.append(font_obj)

        # Calculate xref offsets
        xref_offsets = [0]
        curr_offset = len(objects[0])
        for o in body:
            xref_offsets.append(curr_offset)
            curr_offset += len(o)

        xref = f"xref\n0 {len(xref_offsets)}\n0000000000 65535 f \n"
        for off in xref_offsets[1:]:
            xref += f"{off:010d} 00000 n \n"

        trailer = f"trailer\n<< /Size {len(xref_offsets)} /Root 1 0 R >>\nstartxref\n{curr_offset}\n%%EOF\n"

        return objects[0] + b"".join(body) + xref.encode('latin-1') + trailer.encode('latin-1')
