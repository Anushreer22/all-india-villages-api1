import pandas as pd
from sqlalchemy import create_engine, text
import os
import psycopg2
from psycopg2.extras import execute_values

# ------------------------------
# CONFIGURATION
# ------------------------------
DATA_FOLDER = "data"
DB_URL = "postgresql://postgres:Anushree%40123@localhost:5432/village_db"

# ------------------------------
# CONNECT TO POSTGRESQL
# ------------------------------
engine = create_engine(DB_URL)

# ------------------------------
# READ ALL EXCEL FILES
# ------------------------------
print("Reading Excel files...")

files = os.listdir(DATA_FOLDER)
print("Files found:", files)

all_data = []

for file in files:
    if file.endswith(".xls") and not file.startswith("._"):
        path = os.path.join(DATA_FOLDER, file)
        print("Reading:", path)

        df = pd.read_excel(path, engine="xlrd")
        all_data.append(df)

if len(all_data) == 0:
    raise Exception("No Excel files found in data folder")

df = pd.concat(all_data, ignore_index=True)

# ------------------------------
# RENAME COLUMNS
# ------------------------------
column_mapping = {
    'MDDS STC': 'state_code',
    'STATE NAME': 'state_name',
    'MDDS DTC': 'district_code',
    'DISTRICT NAME': 'district_name',
    'MDDS Sub_DT': 'subdistrict_code',
    'SUB-DISTRICT NAME': 'subdistrict_name',
    'MDDS PLCN': 'village_code',
    'Area Name': 'village_name'
}

df = df.rename(columns=column_mapping)

df = df[
    [
        'state_code',
        'state_name',
        'district_code',
        'district_name',
        'subdistrict_code',
        'subdistrict_name',
        'village_code',
        'village_name'
    ]
]

df.dropna(inplace=True)

print(f"Loaded {len(df)} records")

# ------------------------------
# INSERT STATES
# ------------------------------
states = df[['state_code', 'state_name']].drop_duplicates()

with engine.begin() as conn:
    for _, row in states.iterrows():
        conn.execute(
            text("""
                INSERT INTO "State"(code,name)
                VALUES (:code,:name)
                ON CONFLICT (code) DO NOTHING
            """),
            {"code": str(row.state_code), "name": row.state_name}
        )

print("States inserted")

# ------------------------------
# INSERT DISTRICTS
# ------------------------------
districts = df[['district_code', 'district_name', 'state_code']].drop_duplicates()

with engine.begin() as conn:
    for _, row in districts.iterrows():

        state_id = conn.execute(
            text('SELECT id FROM "State" WHERE code=:code'),
            {"code": str(row.state_code)}
        ).scalar()

        if state_id:
            conn.execute(
                text("""
                    INSERT INTO "District"(code,name,"stateId")
                    VALUES (:code,:name,:state_id)
                    ON CONFLICT (code) DO NOTHING
                """),
                {
                    "code": str(row.district_code),
                    "name": row.district_name,
                    "state_id": state_id
                }
            )

print("Districts inserted")

# ------------------------------
# INSERT SUBDISTRICTS
# ------------------------------
subdistricts = df[
    ['subdistrict_code', 'subdistrict_name', 'district_code']
].drop_duplicates()

with engine.begin() as conn:
    for _, row in subdistricts.iterrows():

        district_id = conn.execute(
            text('SELECT id FROM "District" WHERE code=:code'),
            {"code": str(row.district_code)}
        ).scalar()

        if district_id:
            conn.execute(
                text("""
                    INSERT INTO "SubDistrict"(code,name,"districtId")
                    VALUES (:code,:name,:district_id)
                    ON CONFLICT (code) DO NOTHING
                """),
                {
                    "code": str(row.subdistrict_code),
                    "name": row.subdistrict_name,
                    "district_id": district_id
                }
            )

print("SubDistricts inserted")

# ------------------------------
# INSERT VILLAGES (FAST)
# ------------------------------
conn = psycopg2.connect(DB_URL)
cursor = conn.cursor()

villages = []

for _, row in df.iterrows():

    cursor.execute(
        'SELECT id FROM "SubDistrict" WHERE code=%s',
        (str(row.subdistrict_code),)
    )

    result = cursor.fetchone()

    if result:
        villages.append((
            str(row.village_code),
            row.village_name,
            result[0]
        ))

chunk_size = 5000

for i in range(0, len(villages), chunk_size):

    chunk = villages[i:i + chunk_size]

    execute_values(
        cursor,
        '''
        INSERT INTO "Village"(code,name,"subDistrictId")
        VALUES %s
        ON CONFLICT (code) DO NOTHING
        ''',
        chunk
    )

    conn.commit()
    print(f"Inserted {i+len(chunk)} / {len(villages)}")

cursor.close()
conn.close()

print("Import completed successfully")