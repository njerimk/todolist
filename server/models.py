from app import db

class Task(db.Model):
    id = db.Column(db.String, primary_key=True)
    text = db.Column(db.String, nullable=False)
    date = db.Column(db.String, nullable=False)
    selected = db.Column(db.Boolean, default=False)
    checked = db.Column(db.Boolean, default=False)
    is_new = db.Column(db.Boolean, default=True)

