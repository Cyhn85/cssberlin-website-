from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.models.reminder import Reminder
from typing import List
import calendar

class ReminderService:
    """Hatırlatma sistemi servisi"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_beyanname_reminders(self, year: int):
        """Beyanname tarihleri için hatırlatmalar oluştur"""
        reminders = []
        
        # Aylık beyannameler (her ayın 10'u)
        for month in range(1, 13):
            # Önceki ayın beyannamesi
            if month == 1:
                prev_month = 12
                prev_year = year - 1
            else:
                prev_month = month - 1
                prev_year = year
            
            due_date = date(year, month, 10)
            
            reminder = Reminder(
                reminder_type="Beyanname",
                title=f"{calendar.month_name[prev_month]} {prev_year} Beyannamesi",
                description=f"{calendar.month_name[prev_month]} {prev_year} ayı için EÜR beyannamesi hazırlanmalı ve Finanzamt'a gönderilmeli.",
                due_date=due_date,
                is_urgent=due_date <= date.today() + timedelta(days=7)
            )
            reminders.append(reminder)
        
        # Yıllık beyanname (31 Mayıs)
        yearly_due = date(year + 1, 5, 31)
        reminder = Reminder(
            reminder_type="Beyanname",
            title=f"{year} Yıllık Beyanname",
            description=f"{year} yılı için yıllık EÜR beyannamesi hazırlanmalı ve Finanzamt'a gönderilmeli.",
            due_date=yearly_due,
            is_urgent=yearly_due <= date.today() + timedelta(days=30)
        )
        reminders.append(reminder)
        
        return reminders
    
    def get_upcoming_reminders(self, days: int = 30) -> List[Reminder]:
        """Yaklaşan hatırlatmaları getir"""
        end_date = date.today() + timedelta(days=days)
        
        return self.db.query(Reminder).filter(
            Reminder.due_date <= end_date,
            Reminder.is_completed == False
        ).order_by(Reminder.due_date).all()
    
    def get_overdue_reminders(self) -> List[Reminder]:
        """Gecikmiş hatırlatmaları getir"""
        return self.db.query(Reminder).filter(
            Reminder.due_date < date.today(),
            Reminder.is_completed == False
        ).order_by(Reminder.due_date).all()
    
    def mark_completed(self, reminder_id: int):
        """Hatırlatmayı tamamlandı olarak işaretle"""
        reminder = self.db.query(Reminder).filter(Reminder.id == reminder_id).first()
        if reminder:
            reminder.is_completed = True
            self.db.commit()

