import mysql.connector

def setup_db():
    db_config = {
        "host": "localhost",
        "user": "root",  # Endre hvis brukeren din er annerledes
        "password": "your_password",  # Sett inn ditt passord
    }

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # lager databasen hvis den ikke eksisterer
    cursor.execute("CREATE DATABASE IF NOT EXISTS game_platform")

    # Velg databasen
    conn.database = "game_platform"

    # tabellen for highscores
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS highscores (
            id INT AUTO_INCREMENT PRIMARY KEY,
            game_name VARCHAR(100),
            username VARCHAR(100),
            score INT
        )
    ''')

    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    setup_db()
