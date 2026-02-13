import aiosqlite

from app.config import settings

_db: aiosqlite.Connection | None = None


async def init_db() -> aiosqlite.Connection:
    global _db
    _db = await aiosqlite.connect(settings.database_path)
    _db.row_factory = aiosqlite.Row
    await _db.execute("PRAGMA journal_mode=WAL")
    await _db.execute("PRAGMA foreign_keys=ON")
    return _db


async def close_db() -> None:
    global _db
    if _db:
        await _db.close()
        _db = None


async def get_db() -> aiosqlite.Connection:
    if _db is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return _db


async def execute_query(sql: str) -> list[dict]:
    """Execute a read-only SQL query and return results as list of dicts."""
    db = await get_db()
    async with db.execute(sql) as cursor:
        columns = [d[0] for d in cursor.description]
        rows = await cursor.fetchall()
        return [dict(zip(columns, row)) for row in rows]


async def execute_parameterized(sql: str, params: tuple | list = ()) -> list[dict]:
    """Execute a parameterized query safely."""
    db = await get_db()
    async with db.execute(sql, params) as cursor:
        columns = [d[0] for d in cursor.description]
        rows = await cursor.fetchall()
        return [dict(zip(columns, row)) for row in rows]
