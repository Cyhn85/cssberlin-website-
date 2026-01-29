from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base
from datetime import date

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    report_type = Column(String(50), nullable=False)  # EÜR, Platform T-Cetveli, etc.
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    total_income = Column(Float, default=0.0)
    total_expense = Column(Float, default=0.0)
    net_result = Column(Float, default=0.0)
    status = Column(String(20), default="Draft")  # Draft, Final, Submitted
    pdf_path = Column(String(500))  # Oluşturulan PDF yolu
    created_at = Column(Date, default=date.today)
    submitted_to_finanzamt = Column(Boolean, default=False)
    submitted_date = Column(Date, nullable=True)
    
    # İlişkiler
    transactions = relationship("Transaction", back_populates="report")

    def __repr__(self):
        return f"<Report(id={self.id}, type={self.report_type}, period={self.period_start} to {self.period_end})>"

