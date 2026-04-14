import pandas as pd
import os
import psycopg2
from psycopg2.extras import execute_values

DATA_FOLDER = "data"
DB_URL = os.environ.get("DATABASE_URL")

if not DB_URL:
    raise Exception("DATABASE_URL not set")

print("Reading Excel files...")

files = os.listdir(DATA_FOLDER)
all_data = []

for file in files:
    if file.endswith(".xls"):
        path = os.path.join(DATA_FOLDER, file)
        print("Reading:", path)
        df = pd.read_excel(path, engine="xlrd")
        all_data.append(df)

df = pd.concat(all_data, ignore_index=True)

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

conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

# STATES
states = df[['state_code','state_name']].drop_duplicates()
execute_values(
    cur,
    '''
    INSERT INTO "State"(code,name)
    VALUES %s
    ON CONFLICT (code) DO NOTHING
    ''',
    [(str(r.state_code), r.state_name) for _, r in states.iterrows()]
)
conn.commit()
print("States inserted")

# DISTRICTS
cur.execute('SELECT code,id FROM "State"')
state_map = dict(cur.fetchall())

districts = df[['district_code','district_name','state_code']].drop_duplicates()

district_data = []
for _, r in districts.iterrows():
    sid = state_map.get(str(r.state_code))
    if sid:
        district_data.append((str(r.district_code), r.district_name, sid))

execute_values(
    cur,
    '''
    INSERT INTO "District"(code,name,"stateId")
    VALUES %s
    ON CONFLICT (code) DO NOTHING
    ''',
    district_data
)
conn.commit()
print("Districts inserted")

# SUBDISTRICTS
cur.execute('SELECT code,id FROM "District"')
district_map = dict(cur.fetchall())

sub = df[['subdistrict_code','subdistrict_name','district_code']].drop_duplicates()

sub_data = []
for _, r in sub.iterrows():
    did = district_map.get(str(r.district_code))
    if did:
        sub_data.append((str(r.subdistrict_code), r.subdistrict_name, did))

execute_values(
    cur,
    '''
    INSERT INTO "SubDistrict"(code,name,"districtId")
    VALUES %s
    ON CONFLICT (code) DO NOTHING
    ''',
    sub_data
)
conn.commit()
print("SubDistricts inserted")

# build subdistrict map
cur.execute('SELECT code,id FROM "SubDistrict"')
sub_map = dict(cur.fetchall())

# VILLAGES
cur.execute('SELECT code FROM "Village"')
existing = set(x[0] for x in cur.fetchall())

villages = []

for _, r in df.iterrows():
    code = str(r.village_code)

    if code in existing:
        continue

    sid = sub_map.get(str(r.subdistrict_code))

    if sid:
        villages.append((code, r.village_name, sid))

chunk = 2000   # smaller chunk avoids crash

for i in range(0, len(villages), chunk):
    execute_values(
        cur,
        '''
        INSERT INTO "Village"(code,name,"subDistrictId")
        VALUES %s
        ON CONFLICT (code) DO NOTHING
        ''',
        villages[i:i+chunk]
    )
    conn.commit()
    print(f"Inserted more: {i+chunk}")