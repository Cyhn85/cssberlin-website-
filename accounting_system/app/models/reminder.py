from sqlalchemy import Column, Integer, String, Date, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base
from datetime import date, timedelta

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    reminder_type = Column(String(50), nullable=False)  # Beyanname, Ödeme, Limit Uyarısı
    title = Column(String(200), nullable=False)
    description = Column(Text)
    due_date = Column(Date, nullable=False, index=True)
    is_completed = Column(Boolean, default=False)
    is_urgent = Column(Boolean, default=False)
    notification_sent = Column(Boolean, default=False)
    created_at = Column(Date, default=date.today)
    
    def days_until_due(self):
        return (self.due_date - date.today()).days
    
    def is_overdue(self):
        return self.due_date < date.today() and not self.is_completed

    def __repr__(self):
        return f"<Reminder(id={self.id}, type={self.reminder_type}, due_date={self.due_date})>"

