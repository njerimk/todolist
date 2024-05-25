# models/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define the database URL, for example:
# 'sqlite:///path/to/database.db' for SQLite or
# 'postgresql://username:password@localhost/database_name' for PostgreSQL

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"  # Example for SQLite

# Create the SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for declarative models
Base = declarative_base()
