"""Seed the SQLite database with CSV data from the data/ directory.

Usage:
    cd backend && python -m data.seed
"""

import csv
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "fr8tools.db"
DATA_DIR = Path(__file__).parent

CREATE_TABLES_SQL = """
CREATE TABLE IF NOT EXISTS terminals (
    uid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    longitude REAL NOT NULL,
    latitude REAL NOT NULL,
    country TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS operators (
    uid TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS trains (
    uid TEXT PRIMARY KEY,
    capacities_left INTEGER,
    end_of_booking_iso_weekday INTEGER,
    end_of_booking_time TEXT,
    departure_iso_weekday INTEGER,
    departure_time TEXT,
    departure_day TEXT,
    arrival_iso_weekday INTEGER,
    arrival_time TEXT,
    arrival_day TEXT,
    total_distance REAL,
    transit_label TEXT,
    transit_hours REAL,
    truck_emission_co2e_wtw_ton REAL,
    train_emission_co2e_wtw_ton REAL,
    train_vs_truck_co2e_reduction_percent REAL,
    route_hash_key TEXT,
    text TEXT,
    from_terminal_uid TEXT REFERENCES terminals(uid),
    to_terminal_uid TEXT REFERENCES terminals(uid),
    from_terminal_name TEXT,
    from_terminal_city TEXT,
    from_terminal_country TEXT,
    to_terminal_name TEXT,
    to_terminal_city TEXT,
    to_terminal_country TEXT,
    distance REAL,
    transit_time_hours REAL,
    sequence_number INTEGER,
    operator_uid TEXT REFERENCES operators(uid),
    operator_name TEXT,
    container20 INTEGER,
    container30 INTEGER,
    container40 INTEGER,
    container45 INTEGER,
    swap_body INTEGER,
    tank_container INTEGER,
    semi_trailer INTEGER,
    nikrasa INTEGER,
    bulk INTEGER,
    ro_la INTEGER,
    hazardous_goods INTEGER
);

CREATE INDEX IF NOT EXISTS idx_trains_from_city ON trains(from_terminal_city);
CREATE INDEX IF NOT EXISTS idx_trains_to_city ON trains(to_terminal_city);
CREATE INDEX IF NOT EXISTS idx_trains_from_country ON trains(from_terminal_country);
CREATE INDEX IF NOT EXISTS idx_trains_to_country ON trains(to_terminal_country);
CREATE INDEX IF NOT EXISTS idx_trains_route_hash ON trains(route_hash_key);
CREATE INDEX IF NOT EXISTS idx_trains_operator ON trains(operator_name);
"""


def parse_bool(val: str) -> int:
    return 1 if val.strip().lower() == "true" else 0


def parse_float(val: str) -> float | None:
    try:
        return float(val) if val.strip() else None
    except ValueError:
        return None


def parse_int(val: str) -> int | None:
    try:
        return int(val) if val.strip() else None
    except ValueError:
        return None


def seed():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")

    try:
        conn.executescript(CREATE_TABLES_SQL)
        print("Tables created.")

        # Clear existing data
        conn.execute("DELETE FROM trains")
        conn.execute("DELETE FROM terminals")
        conn.execute("DELETE FROM operators")

        # Seed terminals
        with open(DATA_DIR / "terminals.csv") as f:
            reader = csv.DictReader(f)
            terminals = [
                (
                    row["uid"],
                    row["name"],
                    row["city"],
                    float(row["longitude"]),
                    float(row["latitude"]),
                    row["country"],
                )
                for row in reader
            ]
        conn.executemany(
            "INSERT OR IGNORE INTO terminals (uid, name, city, longitude, latitude, country) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            terminals,
        )
        print(f"Inserted {len(terminals)} terminals.")

        # Seed operators
        with open(DATA_DIR / "operators.csv") as f:
            reader = csv.DictReader(f)
            operators = [(row["uid"], row["name"]) for row in reader]
        conn.executemany(
            "INSERT OR IGNORE INTO operators (uid, name) VALUES (?, ?)",
            operators,
        )
        print(f"Inserted {len(operators)} operators.")

        # Seed trains
        with open(DATA_DIR / "trains.csv") as f:
            reader = csv.DictReader(f)
            trains = []
            for row in reader:
                trains.append(
                    (
                        row["uid"],
                        parse_bool(row["capacities_left"]),
                        parse_int(row["end_of_booking_iso_weekday"]),
                        row["end_of_booking_time"] or None,
                        parse_int(row["departure_iso_weekday"]),
                        row["departure_time"] or None,
                        row["departure_day"] or None,
                        parse_int(row["arrival_iso_weekday"]),
                        row["arrival_time"] or None,
                        row["arrival_day"] or None,
                        parse_float(row["total_distance"]),
                        row["transit_label"] or None,
                        parse_float(row["transit_hours"]),
                        parse_float(row["truck_emission_CO2e_WTW_TON"]),
                        parse_float(row["train_emission_CO2e_WTW_TON"]),
                        parse_float(row["train_vs_truck_CO2e_reduction_percent"]),
                        row["route_hash_key"] or None,
                        row["text"] or None,
                        row["from_terminal_uid"] or None,
                        row["to_terminal_uid"] or None,
                        row["from_terminal_name"] or None,
                        row["from_terminal_city"] or None,
                        row["from_terminal_country"] or None,
                        row["to_terminal_name"] or None,
                        row["to_terminal_city"] or None,
                        row["to_terminal_country"] or None,
                        parse_float(row["distance"]),
                        parse_float(row["transit_time_hours"]),
                        parse_int(row["sequence_number"]),
                        row["operator_uid"] or None,
                        row["operator_name"] or None,
                        parse_bool(row["container20"]),
                        parse_bool(row["container30"]),
                        parse_bool(row["container40"]),
                        parse_bool(row["container45"]),
                        parse_bool(row["swapBody"]),
                        parse_bool(row["tankContainer"]),
                        parse_bool(row["semiTrailer"]),
                        parse_bool(row["nikrasa"]),
                        parse_bool(row["bulk"]),
                        parse_bool(row["roLa"]),
                        parse_bool(row["hazardousGoods"]),
                    )
                )

        conn.executemany(
            """INSERT OR IGNORE INTO trains (
                uid, capacities_left, end_of_booking_iso_weekday, end_of_booking_time,
                departure_iso_weekday, departure_time, departure_day,
                arrival_iso_weekday, arrival_time, arrival_day,
                total_distance, transit_label, transit_hours,
                truck_emission_co2e_wtw_ton, train_emission_co2e_wtw_ton,
                train_vs_truck_co2e_reduction_percent, route_hash_key, text,
                from_terminal_uid, to_terminal_uid, from_terminal_name, from_terminal_city,
                from_terminal_country, to_terminal_name, to_terminal_city, to_terminal_country,
                distance, transit_time_hours, sequence_number,
                operator_uid, operator_name,
                container20, container30, container40, container45,
                swap_body, tank_container, semi_trailer, nikrasa, bulk, ro_la, hazardous_goods
            ) VALUES (
                ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
                ?,?,?,?,?,?,?,?,?,?,?,?,?,
                ?,?,?,?,?,?,?,?,?,?,?
            )""",
            trains,
        )
        print(f"Inserted {len(trains)} trains.")

        conn.commit()

    finally:
        conn.close()

    print(f"Seed complete! Database at {DB_PATH}")


if __name__ == "__main__":
    seed()
