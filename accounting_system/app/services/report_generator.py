from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.models.report import Report
from datetime import date, datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from typing import Optional
import os

class ReportGenerator:
    """Beyanname PDF oluşturma servisi"""
    
    def __init__(self, db: Session):
        self.db = db
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Özel stil tanımlamaları"""
        self.styles.add(ParagraphStyle(
            name='GermanTitle',
            parent=self.styles['Heading1'],
            fontSize=16,
            textColor=colors.HexColor('#2D5016'),
            spaceAfter=12,
            alignment=1  # Center
        ))
        self.styles.add(ParagraphStyle(
            name='GermanHeading',
            parent=self.styles['Heading2'],
            fontSize=12,
            textColor=colors.HexColor('#5a9a30'),
            spaceAfter=6
        ))
    
    def generate_euer_report(self, year: int, month: Optional[int] = None) -> str:
        """EÜR (Einnahmenüberschussrechnung) beyannamesi oluştur"""
        start_date = date(year, month or 1, 1) if month else date(year, 1, 1)
        
        if month:
            # Ay sonu
            if month == 12:
                end_date = date(year, 12, 31)
            else:
                end_date = date(year, month + 1, 1) - date.resolution
        else:
            # Yıl sonu
            end_date = date(year, 12, 31)
        
        # İşlemleri getir
        transactions = self.db.query(Transaction).filter(
            Transaction.date >= start_date,
            Transaction.date <= end_date,
            Transaction.is_business == True
        ).order_by(Transaction.date).all()
        
        # Gelir ve giderleri ayır
        incomes = [t for t in transactions if t.transaction_type == "Gelir"]
        expenses = [t for t in transactions if t.transaction_type == "Gider"]
        
        total_income = sum(t.amount for t in incomes)
        total_expense = sum(abs(t.amount) for t in expenses)
        net_result = total_income - total_expense
        
        # PDF dosya yolu
        period_str = f"{year}_{month:02d}" if month else f"{year}_yearly"
        pdf_filename = f"EÜR_{period_str}.pdf"
        pdf_path = os.path.join("reports", pdf_filename)
        
        # Reports klasörünü oluştur
        os.makedirs("reports", exist_ok=True)
        
        # PDF oluştur
        doc = SimpleDocTemplate(pdf_path, pagesize=A4)
        story = []
        
        # Başlık
        title = f"Einnahmenüberschussrechnung (EÜR)"
        if month:
            title += f" - {month:02d}/{year}"
        else:
            title += f" - {year}"
        
        story.append(Paragraph(title, self.styles['GermanTitle']))
        story.append(Spacer(1, 0.5*cm))
        
        # Firma bilgileri
        story.append(Paragraph("<b>Unternehmer:</b> Ceyhun Sorguç", self.styles['Normal']))
        story.append(Paragraph("Am Omnibuschof, 12", self.styles['Normal']))
        story.append(Paragraph("13593 Berlin, Deutschland", self.styles['Normal']))
        story.append(Spacer(1, 0.3*cm))
        
        # Dönem bilgisi
        period_text = f"<b>Zeitraum:</b> {start_date.strftime('%d.%m.%Y')} bis {end_date.strftime('%d.%m.%Y')}"
        story.append(Paragraph(period_text, self.styles['Normal']))
        story.append(Spacer(1, 0.5*cm))
        
        # Gelirler tablosu
        story.append(Paragraph("EINNAHMEN", self.styles['GermanHeading']))
        income_data = [["Datum", "Platform", "Beschreibung", "Betrag (€)"]]
        
        for t in incomes:
            income_data.append([
                t.date.strftime("%d.%m.%Y"),
                t.platform,
                t.description[:40] + "..." if len(t.description) > 40 else t.description,
                f"{t.amount:.2f}"
            ])
        
        income_data.append(["", "", "<b>Summe Einnahmen</b>", f"<b>{total_income:.2f}</b>"])
        
        income_table = Table(income_data, colWidths=[3*cm, 3*cm, 8*cm, 3*cm])
        income_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#5a9a30')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (3, 0), (3, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -2), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.white, colors.lightgrey]),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#FF8C42')),
        ]))
        
        story.append(income_table)
        story.append(Spacer(1, 0.5*cm))
        
        # Giderler tablosu
        story.append(Paragraph("AUSGABEN", self.styles['GermanHeading']))
        expense_data = [["Datum", "Platform", "Beschreibung", "Kategorie", "Betrag (€)"]]
        
        for t in expenses:
            expense_data.append([
                t.date.strftime("%d.%m.%Y"),
                t.platform,
                t.description[:30] + "..." if len(t.description) > 30 else t.description,
                t.category or "",
                f"{abs(t.amount):.2f}"
            ])
        
        expense_data.append(["", "", "", "<b>Summe Ausgaben</b>", f"<b>{total_expense:.2f}</b>"])
        
        expense_table = Table(expense_data, colWidths=[2.5*cm, 2.5*cm, 5*cm, 3*cm, 2.5*cm])
        expense_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E8854C')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (4, 0), (4, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -2), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.white, colors.lightgrey]),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#FF8C42')),
        ]))
        
        story.append(expense_table)
        story.append(Spacer(1, 0.5*cm))
        
        # Sonuç tablosu
        result_data = [
            ["<b>Summe Einnahmen</b>", f"<b>{total_income:.2f} €</b>"],
            ["<b>Summe Ausgaben</b>", f"<b>{total_expense:.2f} €</b>"],
            ["<b>Überschuss/Fehlbetrag</b>", f"<b>{net_result:.2f} €</b>"]
        ]
        
        result_table = Table(result_data, colWidths=[10*cm, 5*cm])
        result_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#2D5016')),
            ('TEXTCOLOR', (0, -1), (-1, -1), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('PADDING', (0, 0), (-1, -1), 12),
        ]))
        
        story.append(result_table)
        story.append(Spacer(1, 0.5*cm))
        
        # Notlar
        story.append(Paragraph("<b>Hinweise:</b>", self.styles['Normal']))
        story.append(Paragraph("• Kleinunternehmer gemäß §19 UStG", self.styles['Normal']))
        story.append(Paragraph("• Umsatzsteuerbefreiung bis 22.500€ Jahresumsatz", self.styles['Normal']))
        story.append(Paragraph(f"• Erstellt am: {datetime.now().strftime('%d.%m.%Y %H:%M')}", self.styles['Normal']))
        
        # PDF oluştur
        doc.build(story)
        
        # Report kaydı oluştur
        report = Report(
            report_type="EÜR",
            period_start=start_date,
            period_end=end_date,
            total_income=total_income,
            total_expense=total_expense,
            net_result=net_result,
            status="Final",
            pdf_path=pdf_path
        )
        self.db.add(report)
        self.db.commit()
        
        return pdf_path
    
    def generate_platform_report(self, platform: str, year: int, month: Optional[int] = None) -> str:
        """Platform bazlı T-cetveli oluştur"""
        start_date = date(year, month or 1, 1) if month else date(year, 1, 1)
        
        if month:
            if month == 12:
                end_date = date(year, 12, 31)
            else:
                end_date = date(year, month + 1, 1) - date.resolution
        else:
            end_date = date(year, 12, 31)
        
        # Platform işlemlerini getir
        transactions = self.db.query(Transaction).filter(
            Transaction.date >= start_date,
            Transaction.date <= end_date,
            Transaction.platform == platform,
            Transaction.is_business == True
        ).order_by(Transaction.date).all()
        
        # PDF oluştur
        period_str = f"{year}_{month:02d}" if month else f"{year}_yearly"
        pdf_filename = f"T-Cetveli_{platform}_{period_str}.pdf"
        pdf_path = os.path.join("reports", pdf_filename)
        
        os.makedirs("reports", exist_ok=True)
        
        doc = SimpleDocTemplate(pdf_path, pagesize=A4)
        story = []
        
        # Başlık
        title = f"T-Cetveli - {platform}"
        if month:
            title += f" ({month:02d}/{year})"
        else:
            title += f" ({year})"
        
        story.append(Paragraph(title, self.styles['GermanTitle']))
        story.append(Spacer(1, 0.5*cm))
        
        # İşlemler tablosu
        data = [["Datum", "Typ", "Beschreibung", "Betrag (€)"]]
        
        for t in transactions:
            data.append([
                t.date.strftime("%d.%m.%Y"),
                t.transaction_type,
                t.description[:50] + "..." if len(t.description) > 50 else t.description,
                f"{t.amount:.2f}" if t.transaction_type == "Gelir" else f"-{abs(t.amount):.2f}"
            ])
        
        table = Table(data, colWidths=[3*cm, 2.5*cm, 8*cm, 3*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#5a9a30')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (3, 0), (3, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
        ]))
        
        story.append(table)
        
        doc.build(story)
        return pdf_path

