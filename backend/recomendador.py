import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

ratings = None
animes = None
content_similarity = None
anime_features = None
anime_indices = None
anime_popularity = None

def entrenar_modelo():
    global ratings, animes, content_similarity, anime_features, anime_indices, anime_popularity

    ratings = pd.read_csv('./data/rating.csv', encoding="ISO-8859-1")
    animes = pd.read_csv('./data/anime.csv', encoding="ISO-8859-1")
    print(f"Animes cargados: {len(animes)}")

    # Limpiar datos
    animes_clean = animes.copy()
    animes_clean = animes_clean[animes_clean['genre'].notna()]
    animes_clean = animes_clean[animes_clean['type'].notna()]
    
    animes_clean['features'] = (
        animes_clean['genre'].str.lower() + ' ' + 
        animes_clean['type'].str.lower() + ' ' +
        animes_clean['name'].str.lower()
    )
    
    tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
    anime_features = tfidf.fit_transform(animes_clean['features'])
    
    # Matriz de similitud
    print("Calculando similitud...")
    content_similarity = cosine_similarity(anime_features, anime_features)
    
    # Índice para búsqueda rápida
    animes_clean = animes_clean.reset_index(drop=True)
    anime_indices = pd.Series(animes_clean.index, index=animes_clean['name']).to_dict()
    
    # Lista de animes populares para fallback
    anime_popularity = animes.sort_values('rating', ascending=False)['name'].tolist()
    
    print(f"Algoritmo entrenado: {len(animes_clean)} animes")
    return "Algoritmo entrenado"

def recomendar(animes_list, ratings_list, top_n=10):
    global content_similarity, anime_indices, animes, anime_popularity

    if content_similarity is None:
        raise Exception("Algoritmo no entrenado")

    print(f"Buscando recomendaciones para: {list(zip(animes_list, ratings_list))}")

    # Filtrar animes existentes en la base
    animes_existentes = []
    ratings_existentes = []
    
    for anime_name, rating in zip(animes_list, ratings_list):
        if anime_name in anime_indices:
            animes_existentes.append(anime_name)
            ratings_existentes.append(rating)
        else:
            print(f"Anime no encontrado: {anime_name}")

    # Fallback si no hay animes válidos
    if not animes_existentes:
        print("Usando fallback: animes populares")
        recs = [a for a in anime_popularity if a not in animes_list][:top_n]
        return {"recomendaciones": recs, "fallback": True, "mensaje": "Anime no encontrado, mostrando animes populares"}

    # Perfil de usuario teniendo en cuenta el rating
    user_profile = np.zeros(content_similarity.shape[0])
    
    for anime_name, rating in zip(animes_existentes, ratings_existentes):
        idx = anime_indices[anime_name]
        weight = (rating - 5) / 5.0
        user_profile += content_similarity[idx] * weight

    # Excluir animes ya vistos
    watched_indices = [anime_indices[name] for name in animes_existentes]
    for idx in watched_indices:
        user_profile[idx] = -100

    top_indices = np.argsort(user_profile)[::-1][:top_n + len(watched_indices)]
    
    # Filtrar resultados
    recommendations = []
    for idx in top_indices:
        anime_name = animes.iloc[idx]['name']
        score = user_profile[idx]
        if anime_name not in animes_list and score > -0.1:
            recommendations.append(anime_name)
        if len(recommendations) >= top_n:
            break

    # Fallback si no hay recomendaciones
    if not recommendations:
        print("Usando fallback: sin similitudes")
        recs = [a for a in anime_popularity if a not in animes_list][:top_n]
        return {"recomendaciones": recs, "fallback": True, "mensaje": "No se encontraron similitudes"}

    print(f"Recomendaciones encontradas: {recommendations}")
    return {"recomendaciones": recommendations, "fallback": False}