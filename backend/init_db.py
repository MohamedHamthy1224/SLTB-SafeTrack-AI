import os
import pymysql

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = int(os.environ.get("DB_PORT", 3307))
DB_USER = os.environ.get("DB_USER", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
DB_NAME = os.environ.get("DB_NAME", "safe_track_ai_db")

def init_database():
    print(f"Connecting to MySQL server at {DB_HOST}:{DB_PORT} as {DB_USER}...")
    connection = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        autocommit=True
    )
    try:
        with connection.cursor() as cursor:
            print(f"Creating database '{DB_NAME}' if not exists...")
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            cursor.execute(f"USE `{DB_NAME}`;")

            sql_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "safe_track_ai_db (3).sql")
            if not os.path.exists(sql_file_path):
                sql_file_path = os.path.join(os.getcwd(), "safe_track_ai_db (3).sql")

            print(f"Reading SQL dump from {sql_file_path}...")
            with open(sql_file_path, "r", encoding="utf-8") as f:
                sql_content = f.read()

            statements = []
            current = []
            in_multi_line_comment = False
            
            for line in sql_content.splitlines():
                stripped = line.strip()
                if not stripped or stripped.startswith("--") or stripped.startswith("//"):
                    continue
                if stripped.startswith("/*") and not stripped.endswith("*/"):
                    in_multi_line_comment = True
                    continue
                if in_multi_line_comment:
                    if stripped.endswith("*/"):
                        in_multi_line_comment = False
                    continue
                
                current.append(line)
                if stripped.endswith(";"):
                    stmt = "\n".join(current).strip()
                    if stmt:
                        statements.append(stmt)
                    current = []

            print(f"Executing {len(statements)} SQL statements...")
            executed_count = 0
            for stmt in statements:
                try:
                    cursor.execute(stmt)
                    executed_count += 1
                except Exception as e:
                    print(f"Statement execution notice: {e}")

            print(f"Successfully executed {executed_count}/{len(statements)} SQL statements into database '{DB_NAME}'.")
    finally:
        connection.close()

if __name__ == "__main__":
    init_database()
