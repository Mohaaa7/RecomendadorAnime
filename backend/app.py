from flask import Flask, jsonify, request, render_template, redirect, url_for, flash, session
from flask_cors import CORS
import recomendador as rec
import mysql.connector
from usuario import Usuario 

app = Flask(__name__)
CORS(app)
app.secret_key = "clave_super_secreta"
VERSION = "1.0.1"

# Configuración DB
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "123456",
    "database": "recomendador-anime"
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        nombre_input = request.form["nombre"]
        contrasena_input = request.form["contrasena"]

        conexion = get_db_connection()
        cursor = conexion.cursor()
        cursor.execute("SELECT nombre, contrasena FROM usuarios WHERE nombre=%s AND contrasena=%s",
                       (nombre_input, contrasena_input))
        usuario_db = cursor.fetchone()
        cursor.close()
        conexion.close()

        if usuario_db:
            usuario = Usuario(usuario_db[0], usuario_db[1])
            session["usuario"] = usuario.get_nombre()
            return redirect(url_for("recomendaciones"))
        else:
            flash("Usuario o contraseña incorrectos", "error")

    return render_template("login.html")


@app.route("/recomendaciones")
def recomendaciones():
    if "usuario" not in session:
        return redirect(url_for("login"))
    return render_template("index.html", usuario=session["usuario"])

@app.route("/logout")
def logout():
    session.pop("usuario", None)
    return redirect(url_for("login"))

# Rutas de API
@app.route("/entrenar", methods=["POST"])
def entrenar():
    try:
        msg = rec.entrenar_modelo()
        return jsonify({"message": msg})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/obtener-recomendaciones")
def obtener_recomendaciones():
    try:
        animes_input = request.args.get("animes", "")
        ratings_input = request.args.get("ratings", "")

        if not animes_input or not ratings_input:
            return jsonify({"error": "Faltan parámetros animes/ratings"}), 400

        animes_list = [a.strip() for a in animes_input.split(",")]
        ratings_list = [float(r.strip()) for r in ratings_input.split(",")]

        recomendaciones = rec.recomendar(animes_list, ratings_list)

        return jsonify(recomendaciones)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/test")
def test():
    return jsonify({"message": "API funcionando"})

@app.route("/version")
def version():
    return jsonify({"version": VERSION})

if __name__ == "__main__":
    app.run(debug=True)
