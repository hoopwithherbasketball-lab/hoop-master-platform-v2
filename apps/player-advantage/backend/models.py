from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base, get_db_connection
import datetime

class Player(Base):
    __tablename__ = 'players'

    id = Column(String, primary_key=True)
    player_name = Column(String, nullable=False)
    grad_class = Column(Integer)
    gender = Column(String)
    school = Column(String)
    city = Column(String)
    state = Column(String)
    primary_position = Column(String)
    height = Column(String)
    weight = Column(String)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Coach(Base):
    __tablename__ = 'coaches'

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String)
    name = Column(String)
    school = Column(String)
    title = Column(String)
    state = Column(String)
    is_verified = Column(Boolean, default=False)
    saved_players = Column(JSON, default=[])
