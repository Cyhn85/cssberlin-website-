from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.base import get_db
from app.services.report_generator import ReportGenerator
from app.models.report import Report
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

router = APIRouter(prefix="/api/reports", tags=["reports"])

class ReportResponse(BaseModel):
    id: int
    report_type: str
    period_start: date
    period_end: date
    total_income: float
    total_expense: float
    net_result: float
    status: str
    pdf_path: Optional[str]
    
    class Config:
        from_attributes = True

@router.get("", response_model=List[ReportResponse])
async def get_reports(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Tüm beyannameleri getir"""
    reports = db.query(Report).offset(skip).limit(limit).all()
    return reports

@router.post("/generate/euer")
async def generate_euer_report(
    year: int,
    month: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """EÜR beyannamesi oluştur"""
    generator = ReportGenerator(db)
    pdf_path = generator.generate_euer_report(year, month)
    
    return {
        "message": "EÜR beyannamesi oluşturuldu",
        "pdf_path": pdf_path,
        "year": year,
        "month": month
    }

@router.post("/generate/platform")
async def generate_platform_report(
    platform: str,
    year: int,
    month: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Platform bazlı T-cetveli oluştur"""
    generator = ReportGenerator(db)
    pdf_path = generator.generate_platform_report(platform, year, month)
    
    return {
        "message": f"{platform} T-cetveli oluşturuldu",
        "pdf_path": pdf_path,
        "platform": platform,
        "year": year,
        "month": month
    }

@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    """Beyanname detayı"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.get("/{report_id}/pdf")
async def download_report_pdf(
    report_id: int,
    db: Session = Depends(get_db)
):
    """Beyanname PDF'ini indir"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    if not report.pdf_path or not os.path.exists(report.pdf_path):
        raise HTTPException(status_code=404, detail="PDF file not found")
    
    from fastapi.responses import FileResponse
    return FileResponse(
        report.pdf_path,
        media_type="application/pdf",
        filename=os.path.basename(report.pdf_path)
    )

@router.post("/{report_id}/submit")
async def submit_to_finanzamt(
    report_id: int,
    db: Session = Depends(get_db)
):
    """Beyannameyi Finanzamt'a gönderildi olarak işaretle"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report.submitted_to_finanzamt = True
    report.submitted_date = date.today()
    report.status = "Submitted"
    db.commit()
    
    return {
        "message": "Beyanname Finanzamt'a gönderildi olarak işaretlendi",
        "submitted_date": report.submitted_date
    }

