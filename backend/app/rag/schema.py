"""Database schema description for LLM prompts."""

STATIC_SCHEMA = """TABLE terminals:
  uid TEXT PRIMARY KEY
  name TEXT NOT NULL — terminal name (e.g. "Rotterdam Europoort")
  city TEXT NOT NULL — city where terminal is located
  longitude REAL NOT NULL
  latitude REAL NOT NULL
  country TEXT NOT NULL — country name (e.g. "Netherlands", "Germany", "Italy")

TABLE operators:
  uid TEXT PRIMARY KEY
  name TEXT NOT NULL — rail freight operator company name

TABLE trains:
  uid TEXT PRIMARY KEY
  capacities_left INTEGER — 1=has capacity, 0=full
  departure_iso_weekday INTEGER — 1=Monday, 7=Sunday
  departure_time TEXT — HH:MM format
  departure_day TEXT — day name (e.g. "Wednesday")
  arrival_iso_weekday INTEGER
  arrival_time TEXT
  arrival_day TEXT
  total_distance REAL — km
  transit_label TEXT — human-readable transit time
  transit_hours REAL — total transit time in hours
  truck_emission_co2e_wtw_ton REAL — CO2 emissions if shipped by truck (tons)
  train_emission_co2e_wtw_ton REAL — CO2 emissions by train (tons)
  train_vs_truck_co2e_reduction_percent REAL — % CO2 saved vs truck
  route_hash_key TEXT — hash identifier for the route geometry
  from_terminal_uid TEXT REFERENCES terminals(uid)
  to_terminal_uid TEXT REFERENCES terminals(uid)
  from_terminal_name TEXT
  from_terminal_city TEXT
  from_terminal_country TEXT
  to_terminal_name TEXT
  to_terminal_city TEXT
  to_terminal_country TEXT
  distance REAL — segment distance in km
  transit_time_hours REAL — segment transit time
  sequence_number INTEGER — leg sequence in multi-stop routes
  operator_uid TEXT REFERENCES operators(uid)
  operator_name TEXT
  container20 INTEGER — 1=accepts 20ft containers
  container30 INTEGER
  container40 INTEGER
  container45 INTEGER
  swap_body INTEGER
  tank_container INTEGER
  semi_trailer INTEGER
  nikrasa INTEGER
  bulk INTEGER
  ro_la INTEGER — rolling highway (trucks on trains)
  hazardous_goods INTEGER"""
