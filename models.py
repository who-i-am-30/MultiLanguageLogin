import random
import string
from datetime import datetime
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(5), unique=True, nullable=False)  # 5-digit unique ID
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)  # Email for full login
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to code snippets
    snippets = db.relationship('CodeSnippet', backref='author', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    @staticmethod
    def generate_unique_id():
        """Generate a unique 5-digit ID"""
        while True:
            user_id = ''.join(random.choices(string.digits, k=5))
            if not User.query.filter_by(user_id=user_id).first():
                return user_id

class CodeSnippet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    language = db.Column(db.String(50), nullable=False)
    code = db.Column(db.Text, nullable=False)
    share_id = db.Column(db.String(16), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    @staticmethod
    def generate_share_id():
        """Generate a unique share ID for the snippet"""
        while True:
            share_id = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
            if not CodeSnippet.query.filter_by(share_id=share_id).first():
                return share_id
