from flask import Flask, render_template, request, redirect, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import mariadb

app = Flask(__name__)
app.secret_key = 'e5b8c2a16c4e421ebd6a20f4f89b69c3'  # Set your secret key

# Database connection
def get_db_connection():
    return mariadb.connect(
        user="appuser",
        password="password1",
        host="10.2.3.130",
        database="game_platform"
    )



# Home page route (select game)
@app.route('/')
def index():
    if 'user_id' in session:
        return render_template('index.html', username=session['username'])
    else:
        flash("Du må logge inn for å få tilgang til spillene.", "error")
        return redirect('/login')  # Hardcoded URL

# Register page
@app.route('/registrer', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        password_hash = generate_password_hash(password)

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, password_hash))
            conn.commit()
            flash("Registrering vellykket! Logg inn nå.", "success")
            return redirect('/login')  # Hardcoded URL
        except mariadb.IntegrityError:
            flash("Brukernavn er allerede i bruk.", "error")
        finally:
            cursor.close()
            conn.close()

    return render_template('registrer.html')

# Login page
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id, password_hash FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and check_password_hash(user[1], password):
            session['user_id'] = user[0]
            session['username'] = username
            flash(f"Velkommen tilbake, {username}!", "success")
            return redirect('/')  # Hardcoded URL
        else:
            flash("Feil brukernavn eller passord.", "error")

    return render_template('login.html')

# Logout route
@app.route('/logout')
def logout():
    session.clear()
    flash("Du har logget ut.", "success")
    return redirect('/login')  # Hardcoded URL

# Cookie Clicker Game
@app.route('/javacriptcookieclicker')
def cookie_clicker():
    if 'user_id' not in session:
        flash("Du må logge inn for å spille.", "error")
        return redirect('/login')  # Hardcoded URL
    return render_template('cookieclicker.html')

# Reaction Time Test Game
@app.route('/reaction_test')
def reaction_test():
    if 'user_id' not in session:
        flash("Du må logge inn for å spille.", "error")
        return redirect('/login')  # Hardcoded URL
    return render_template('reactiontest.html')

# Fetch high score for a game
@app.route('/get_highscore', methods=['GET'])
def get_highscore():
    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 401

    game_name = request.args.get('game_name')
    username = session['username']

    if not game_name:
        return jsonify({"error": "Invalid game name"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch the high score for the user and the specified game
    cursor.execute(
        "SELECT score FROM highscores WHERE username = ? AND game_name = ?", 
        (username, game_name)
    )
    result = cursor.fetchone()
    cursor.close()
    conn.close()

    if result:
        return jsonify({"highscore": result[0]})
    else:
        return jsonify({"highscore": 0})  # Default to 0 if no score exists

# Submit score route
@app.route('/submit_score', methods=['POST'])
def submit_score():
    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 401

    data = request.get_json()
    game_name = data['game_name']
    score = data['score']
    username = session['username']

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if the player already has a high score for the game
    cursor.execute(
        "SELECT score FROM highscores WHERE username = ? AND game_name = ?", 
        (username, game_name)
    )
    result = cursor.fetchone()

    if result:
        if score < result[0]:  # If the new score is better, update it
            cursor.execute(
                "UPDATE highscores SET score = ? WHERE username = ? AND game_name = ?", 
                (score, username, game_name)
            )
            conn.commit()
            message = "New high score!"
        else:
            message = "Score is not a new high score."
    else:
        # If the player doesn't have a score for the game, insert the new score
        cursor.execute(
            "INSERT INTO highscores (username, game_name, score) VALUES (?, ?, ?)", 
            (username, game_name, score)
        )
        conn.commit()
        message = "New high score!"

    cursor.close()
    conn.close()

    return jsonify({"message": message})

if __name__ == "__main__":
    app.run(debug=True)
