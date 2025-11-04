Sistema de Recomendación de Animes
------------------------------------
Prerrequisitos:
------------------------------------
Python 3.8 o superior y pip (gestor de paquetes de Python)

Mysql Workbench instalado

Pasos de instalación:
------------------------------------
1. Montar base de datos:

    En Mysql Workbench ejecutar el dump.sql de la carpeta "db"


2. Clonar el repositorio:

    git clone https://github.com/Mohaaa7/RecomendadorAnime.git


3. Descargar de kaggle el dataset de recomendación de animes, y añadirlo a la carpeta data. Son 2 archivos: anime.csv y rating.csv:

    https://www.kaggle.com/datasets/CooperUnion/anime-recommendations-database


4. Instalar dependencias:

    pip install flask flask-cors pandas numpy scikit-learn


5. Iniciar servidor:

    cd backend

    py -m app

    Abrir direccion del servidor

Uso:
----------------------------------
1. Iniciar sesión con el usuario especificado.

2. Antes de usar el recomendador entrenar el algoritmo.

3. Esperar hasta que se entrene.

4. Obtener recomendaciones usando el formulario, ejemplo (usar sin comillas):

    "Naruto, One Piece"
    "9, 8"