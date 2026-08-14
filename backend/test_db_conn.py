import pymysql

try:
    conn = pymysql.connect(
        host='127.0.0.1',
        port=3307,
        user='root',
        password='',
        connect_timeout=3
    )
    print("SUCCESS CONNECTED TO 3307!")
    cursor = conn.cursor()
    cursor.execute("SHOW DATABASES;")
    databases = [r[0] for r in cursor.fetchall()]
    print("Databases on 3307:", databases)
    if 'safe_track_ai_db' in databases:
        conn.select_db('safe_track_ai_db')
        cursor.execute("SHOW TABLES;")
        tables = [r[0] for r in cursor.fetchall()]
        print("Tables in safe_track_ai_db:", tables)
    conn.close()
except Exception as e:
    print("FAILED TO CONNECT TO 3307:", e)
