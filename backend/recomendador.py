import pandas as pd
import os


def main():
    ratings = pd.read_csv('.\\data\\rating.csv', sep=',', encoding="ISO-8859-1")
    animes = pd.read_csv('.\\data\\anime.csv', sep=',', encoding="ISO-8859-1")

    ratings = ratings[ratings['rating'] != -1]

    ratings = ratings[ratings.groupby('user_id')['user_id'].transform('count') >= 1]

    ratings = pd.merge(ratings, animes[['anime_id', 'name']], on='anime_id', how='left')

    print(ratings)

    #---------------------------------------

    userRatings = ratings.pivot_table(index=['user_id'],columns=['name'],values='rating')
    userRatings.head()

    #---------------------------------------

    corrMatrix = userRatings.corr(method='pearson', min_periods=50)
    corrMatrix.head()

    #---------------------------------------

    print(corrMatrix.shape)
    myRatings = userRatings.loc[0].dropna()
    myRatings

    simCandidates = pd.Series()
    print(simCandidates)
    for i in range(0, len(myRatings.index)):
        print ("Añadiendo pelis similares a " + myRatings.index[i] + "...")
        sims = corrMatrix[myRatings.index[i]].dropna()
        sims = sims.map(lambda x: x * myRatings[i])
        simCandidates = pd.concat([simCandidates, sims])

    #---------------------------------------
        
    print ("Ordenando...")
    simCandidates.sort_values(inplace = True, ascending = False)
    print (simCandidates.head(10)) 

    #---------------------------------------

    simCandidates = simCandidates.groupby(simCandidates.index).sum()

    simCandidates.sort_values(inplace = True, ascending = False)
    simCandidates.head(10)

    #---------------------------------------

    filteredSims = simCandidates.drop(myRatings.index, errors='ignore')
    filteredSims.head(10)



if __name__ == "__main__":
    main()