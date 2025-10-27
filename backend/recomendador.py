import pandas as pd

ratings = None
animes = None
userRatings = None
corrMatrix = None

def entrenar_modelo():
    global ratings, animes, userRatings, corrMatrix
    
    print("Iniciando entrenamiento del modelo...")

    # Cargar archivos
    print("Cargando CSV...")
    ratings = pd.read_csv('./data/rating.csv', encoding="ISO-8859-1")
    animes = pd.read_csv('./data/anime.csv', encoding="ISO-8859-1")

    print(f"Ratings cargados: {len(ratings)} filas")
    print(f"Animes cargados: {len(animes)} filas")

    # Filtrar ratings inválidos
    ratings = ratings[ratings['rating'] != -1]
    print(f"Ratings válidos: {len(ratings)}")

    # Merge con nombres
    ratings = pd.merge(ratings, animes[['anime_id', 'name']], on='anime_id', how='left')
    print("Merge realizado")

    # Pivot table
    print("Generando tabla de usuario-anime...")
    userRatings = ratings.pivot_table(index='user_id', columns='name', values='rating')
    print(f"userRatings generado: {userRatings.shape}")

    # Matriz de correlaciones
    print("Calculando matriz de correlación...")
    corrMatrix = userRatings.corr(method='pearson', min_periods=30)
    print(f"correlación lista: {corrMatrix.shape}")

    print("Modelo entrenado exitosamente")
    return "Modelo entrenado"


def recomendar(animes_list, ratings_list):
    global corrMatrix, userRatings

    # Verificar que el modelo haya sido entrenado
    if corrMatrix is None:
        print("ERROR: Modelo no entrenado")
        raise Exception("Modelo no entrenado")

    print("Iniciando recomendación para:")
    for a, r in zip(animes_list, ratings_list):
        print(f"   → {a} (rating {r})")

    # Serie para acumular similitudes ponderadas
    simCandidates = pd.Series(dtype=float)

    # Buscar animes similares a los proporcionados por el usuario
    for anime, rate in zip(animes_list, ratings_list):
        if anime not in corrMatrix.columns:
            print(f"Anime no encontrado en la matriz: {anime}")
            continue

        print(f"Añadiendo animes similares a: {anime}")
        sims = corrMatrix[anime].dropna()
        sims = sims.map(lambda x: x * rate)
        simCandidates = pd.concat([simCandidates, sims])

    if simCandidates.empty:
        print(" Ninguna similitud encontrada")
        return []

    print("Ordenando candidatos...")
    simCandidates = simCandidates.groupby(simCandidates.index).sum()
    simCandidates = simCandidates.sort_values(ascending=False)

    recs = [a for a in simCandidates.index if a not in animes_list][:10]

    print("Recomendaciones finales:")
    for r in recs:
        print(f"   {r}")

    return recs
