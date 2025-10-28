Sistema de Recomendación de Animes
------------------------------------
Prerrequisitos:
------------------------------------
Python 3.8 o superior y pip (gestor de paquetes de Python)

Pasos de instalación:
------------------------------------
(Descargar de kaggle el dataset de recomendación de animes, y añadirlo a la carpeta data. Son 2 archivos: anime.csv y rating.csv)
https://www.kaggle.com/datasets/CooperUnion/anime-recommendations-database

(Clonar el repositorio)
git clone <url-del-repositorio>
cd anime-recommender

(Instalar dependencias)
pip install flask flask-cors pandas numpy scikit-learn

(Iniciar servidor)
cd backend
py -m app

(En carpeta frontend)
Abrir index.html

Uso:
----------------------------------

Primero entrenar el algoritmo.
Esperar hasta que se entrene.

Obtener recomendaciones usando el formulario, ejemplo (usar sin comillas):
"Naruto, One Piece"
"9, 8"