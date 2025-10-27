from flask import Flask, jsonify, request
import recomendador as rec

app = Flask(__name__)
VERSION = "1.0.1"


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

        return jsonify({"recomendaciones": recomendaciones})
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
