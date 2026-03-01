import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.db.session import Base, engine
from app.models import models  # noqa: F401


def pytest_sessionstart(session):
    Base.metadata.create_all(bind=engine)
