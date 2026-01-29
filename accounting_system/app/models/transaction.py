from sqlalchemy import Column, Integer, String, Float, Date, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base
from datetime import date

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, index=True)
    platform = Column(String(50), nullable=False, index=True)  # Vinted, eBay, Kleinanzeigen, Deutsche Bank, etc.
    transaction_type = Column(String(20), nullable=False)  # Gelir, Gider
    description = Column(Text, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(100))  # Satış, Mal Alımı, Yakıt, etc.
    document_number = Column(String(100), unique=True, index=True)
    status = Column(String(20), default="Tamamlandı")
    notes = Column(Text)
    is_business = Column(Boolean, default=True, index=True)  # İş/Özel ayrımı
    document_path = Column(String(500))  # PDF/PNG dosya yolu
    
    # İlişkiler
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=True)
    report = relationship("Report", back_populates="transactions")

    def __repr__(self):
        return f"<Transaction(id={self.id}, date={self.date}, amount={self.amount})>"

