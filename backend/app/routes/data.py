"""Data endpoints for terminals and routes."""

from fastapi import APIRouter, Query

from app.db import execute_parameterized

router = APIRouter()


@router.get("/terminals")
async def list_terminals(
    country: str | None = Query(None, description="Filter by country name"),
    limit: int = Query(100, ge=1, le=500),
):
    """List terminals, optionally filtered by country."""
    if country:
        return await execute_parameterized(
            "SELECT uid, name, city, longitude, latitude, country "
            "FROM terminals WHERE country LIKE ? ORDER BY city LIMIT ?",
            (f"%{country}%", limit),
        )
    return await execute_parameterized(
        "SELECT uid, name, city, longitude, latitude, country "
        "FROM terminals ORDER BY city LIMIT ?",
        (limit,),
    )


@router.get("/routes")
async def list_routes(
    from_city: str | None = Query(None, description="Filter by origin city"),
    to_city: str | None = Query(None, description="Filter by destination city"),
    limit: int = Query(50, ge=1, le=200),
):
    """List train routes with optional origin/destination filtering."""
    conditions = []
    params: list = []

    if from_city:
        conditions.append("from_terminal_city LIKE ?")
        params.append(f"%{from_city}%")
    if to_city:
        conditions.append("to_terminal_city LIKE ?")
        params.append(f"%{to_city}%")

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    params.append(limit)

    sql = (
        f"SELECT uid, from_terminal_city, to_terminal_city, from_terminal_country, "
        f"to_terminal_country, operator_name, distance, transit_time_hours, "
        f"train_vs_truck_co2e_reduction_percent "
        f"FROM trains {where} ORDER BY from_terminal_city LIMIT ?"
    )
    return await execute_parameterized(sql, params)
