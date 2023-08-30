import os

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import numpy as np
import random
import json

import pandas as pd

data_dir = os.path.dirname(os.path.abspath(__file__))

csv_hotels_path = os.path.join(data_dir, 'Raw/Hotels', 'Hotel.csv')
csv_hotels_review_path = os.path.join(data_dir, 'Raw/Hotels','Hotel_reviews.csv')

csv_attractions_path = os.path.join(data_dir, 'Raw/Attractions', 'attractions.csv')
csv_attractions_review_path = os.path.join(data_dir, 'Raw/Attractions','attraction_reviews.csv')

csv_restaurants_path = os.path.join(data_dir, 'Raw/Restaurants', 'Restaurants.csv')
csv_restaurants_review_path = os.path.join(data_dir, 'Raw/Restaurants','Restaurants_reviews.csv')

csv_country= os.path.join(data_dir, 'Raw', 'country_description.csv')

def processedHotel() -> pd.DataFrame:

    #Loading the dataset
    category = pd.read_csv(csv_hotels_path)

    reviews = pd.read_csv(csv_hotels_review_path) 

    #Performing data cleaning by handling all missing values
    # Fill missing values in "Hotel rating" with the mean of available ratings
    mean_rating = category['hotel_rating'].mean()
    category['hotel_rating'].fillna(mean_rating, inplace=True)

    # Remove data with empty amenities ('[]') to further clean the data
    #category = category[category['amenities'] != '[]']

    # Fill missing values in "User rating" with the mean of available ratings
    mean_user_rating = reviews['user_rating'].mean()
    reviews['user_rating'].fillna(mean_user_rating, inplace=True)

    # Removing duplicates for more accurate result
    #Remove duplicates from the "Hotels" dataset based on "Hotel ID"
    category.drop_duplicates(subset='id', keep='first', inplace=True)

    # Remove duplicates from the "Hotel reviews" dataset based on all columns
    reviews.drop_duplicates(keep='first', inplace=True)

    #Grouping the dataframe by the ID
    reviews_count = reviews.groupby('id').size().reset_index(name='Review Count')


    # Group the DataFrame by "Id" and calculate the mean of the "User rating" for each hotel
    average_ratings = reviews.groupby('id')['user_rating'].mean()

    # Convert the result to a DataFrame allowing it to have two columns: 'Id' and 'Average Rating'
    average_ratings_df = average_ratings.reset_index(name='Average Rating')
    

    # Group by 'id', and aggregate user names and reviews
    agg_dict = {
        'user_name': list, 
        'user_review': list,
        'user_rating': list
    }
    top_reviews_df = reviews.groupby('id').agg(agg_dict).reset_index()
    
    # Create the custom 'review_data' field containing arrays of user names and reviews
    top_reviews_df['review_data'] = top_reviews_df.apply(lambda row: [{'user_name': name, 'user_review': review, 'user_rating': num} for name, review, num in zip(row['user_name'], row['user_review'], row['user_rating'])], axis=1)

    # Sort the reviews within each group and select the top 3 reviews
    top_reviews_df['review_data'] = top_reviews_df['review_data'].apply(lambda reviews: sorted(reviews, key=lambda x: len(x['user_review']), reverse=True)[:3])
   
    # Drop the individual 'user_name' and 'user_review' columns
    top_reviews_df = top_reviews_df.drop(['user_name', 'user_review', 'user_rating'], axis=1)
    

    # Merging the "Hotels", "top_reviews" and "average_ratings" DataFrames based on the common "Id" column
    hotels_with_popularity = category.merge(reviews_count, on='id', how='left')
    hotels_with_popularity = hotels_with_popularity.merge(average_ratings_df, on='id', how='left')
    hotels_with_popularity = hotels_with_popularity.merge(top_reviews_df, on='id', how='left')


    # Sort the DataFrame by 'Review Count' and 'Average Rating' column in descending order to allow the highest-rated hotels will be ranked at the top.
    hotels_with_popularity = hotels_with_popularity.sort_values(by='Review Count', ascending=False)
    sorted_hotels_by_rating = hotels_with_popularity.sort_values(by='Average Rating', ascending=False)

    # # Drop hotel_experience column
    sorted_hotels_by_rating = sorted_hotels_by_rating.drop('hotel_experience', axis=1)

    #rename hotel_name and hotel_rating
    sorted_hotels_by_rating.rename(columns={'hotel_name': "name"}, inplace=True)
    sorted_hotels_by_rating.rename(columns={'hotel_rating': "rating"}, inplace=True)

    # # Convert country column to lower case
    sorted_hotels_by_rating['country'] = sorted_hotels_by_rating['country'].str.lower()

    return sorted_hotels_by_rating

def processedAttractions() -> pd.DataFrame:

    #Loading the dataset
    category = pd.read_csv(csv_attractions_path)

    reviews = pd.read_csv(csv_attractions_review_path) 

    #Performing data cleaning by handling all missing values
    # Fill missing values in "Hotel rating" with the mean of available ratings
    mean_rating = category['attraction_rating'].mean()
    category['attraction_rating'].fillna(mean_rating, inplace=True)

    # Remove data with empty amenities ('[]') to further clean the data
    #category = category[category['amenities'] != '[]']

    # Fill missing values in "User rating" with the mean of available ratings
    mean_user_rating = reviews['user_rating'].mean()
    reviews['user_rating'].fillna(mean_user_rating, inplace=True)

    # Removing duplicates for more accurate result
    #Remove duplicates from the "Hotels" dataset based on "Hotel ID"
    category.drop_duplicates(subset='id', keep='first', inplace=True)

    # Remove duplicates from the "Hotel reviews" dataset based on all columns
    reviews.drop_duplicates(keep='first', inplace=True)

    #Grouping the dataframe by the ID
    reviews_count = reviews.groupby('id').size().reset_index(name='Review Count')


    # Group the DataFrame by "Id" and calculate the mean of the "User rating" for each hotel
    average_ratings = reviews.groupby('id')['user_rating'].mean()

    # Convert the result to a DataFrame allowing it to have two columns: 'Id' and 'Average Rating'
    average_ratings_df = average_ratings.reset_index(name='Average Rating')
    

    # Group by 'id', and aggregate user names and reviews
    agg_dict = {
        'user_name': list, 
        'user_review': list,
        'user_rating': list
    }
    top_reviews_df = reviews.groupby('id').agg(agg_dict).reset_index()
    
    # Create the custom 'review_data' field containing arrays of user names and reviews
    top_reviews_df['review_data'] = top_reviews_df.apply(lambda row: [{'user_name': name, 'user_review': review, 'user_rating': num} for name, review, num in zip(row['user_name'], row['user_review'], row['user_rating'])], axis=1)

    # Sort the reviews within each group and select the top 3 reviews
    top_reviews_df['review_data'] = top_reviews_df['review_data'].apply(lambda reviews: sorted(reviews, key=lambda x: len(x['user_review']), reverse=True)[:3])
   
    # Drop the individual 'user_name' and 'user_review' columns
    top_reviews_df = top_reviews_df.drop(['user_name', 'user_review', 'user_rating'], axis=1)
    

    # Merging the "Attractions", "top_reviews" and "average_ratings" DataFrames based on the common "Id" column
    attractions_with_popularity = category.merge(reviews_count, on='id', how='left')
    attractions_with_popularity = attractions_with_popularity.merge(average_ratings_df, on='id', how='left')
    attractions_with_popularity = attractions_with_popularity.merge(top_reviews_df, on='id', how='left')


    # Sort the DataFrame by 'Review Count' and 'Average Rating' column in descending order to allow the highest-rated hotels will be ranked at the top.
    attractions_with_popularity = attractions_with_popularity.sort_values(by='Review Count', ascending=False)
    sorted_attractions_by_rating = attractions_with_popularity.sort_values(by='Average Rating', ascending=False)

    # # Drop attraction_experience column
    sorted_attractions_by_rating = sorted_attractions_by_rating.drop('attraction_experience', axis=1)

    #rename attraction_name and attraction_rating
    sorted_attractions_by_rating.rename(columns={'attraction_name': "name"}, inplace=True)
    sorted_attractions_by_rating.rename(columns={'attraction_rating': "rating"}, inplace=True)

    # # Convert country column to lower case
    sorted_attractions_by_rating['country'] = sorted_attractions_by_rating['country'].str.lower()

    return sorted_attractions_by_rating

def processedRestaurants() -> pd.DataFrame:

    #Loading the dataset
    category = pd.read_csv(csv_restaurants_path)

    reviews = pd.read_csv(csv_restaurants_review_path) 

    #Performing data cleaning by handling all missing values
    # Fill missing values in "Hotel rating" with the mean of available ratings
    mean_rating = category['restaurant_rating'].mean()
    category['restaurant_rating'].fillna(mean_rating, inplace=True)

    # Remove data with empty amenities ('[]') to further clean the data
    #category = category[category['amenities'] != '[]']

    # Fill missing values in "User rating" with the mean of available ratings
    mean_user_rating = reviews['user_rating'].mean()
    reviews['user_rating'].fillna(mean_user_rating, inplace=True)

    # Removing duplicates for more accurate result
    #Remove duplicates from the "Hotels" dataset based on "Hotel ID"
    category.drop_duplicates(subset='id', keep='first', inplace=True)

    # Remove duplicates from the "Hotel reviews" dataset based on all columns
    reviews.drop_duplicates(keep='first', inplace=True)

    #Grouping the dataframe by the ID
    reviews_count = reviews.groupby('id').size().reset_index(name='Review Count')


    # Group the DataFrame by "Id" and calculate the mean of the "User rating" for each hotel
    average_ratings = reviews.groupby('id')['user_rating'].mean()

    # Convert the result to a DataFrame allowing it to have two columns: 'Id' and 'Average Rating'
    average_ratings_df = average_ratings.reset_index(name='Average Rating')
    

    # Group by 'id', and aggregate user names and reviews
    agg_dict = {
        'user_name': list, 
        'user_review': list,
        'user_rating': list
    }
    top_reviews_df = reviews.groupby('id').agg(agg_dict).reset_index()
    
    # Create the custom 'review_data' field containing arrays of user names and reviews
    top_reviews_df['review_data'] = top_reviews_df.apply(lambda row: [{'user_name': name, 'user_review': review, 'user_rating': num} for name, review, num in zip(row['user_name'], row['user_review'], row['user_rating'])], axis=1)

    # Sort the reviews within each group and select the top 3 reviews
    top_reviews_df['review_data'] = top_reviews_df['review_data'].apply(lambda reviews: sorted(reviews, key=lambda x: len(x['user_review']), reverse=True)[:3])
   
    # Drop the individual 'user_name' and 'user_review' columns
    top_reviews_df = top_reviews_df.drop(['user_name', 'user_review', 'user_rating'], axis=1)
    

    # Merging the "Restaurants", "top_reviews" and "average_ratings" DataFrames based on the common "Id" column
    restaurants_with_popularity = category.merge(reviews_count, on='id', how='left')
    restaurants_with_popularity = restaurants_with_popularity.merge(average_ratings_df, on='id', how='left')
    restaurants_with_popularity = restaurants_with_popularity.merge(top_reviews_df, on='id', how='left')


    # Sort the DataFrame by 'Review Count' and 'Average Rating' column in descending order to allow the highest-rated hotels will be ranked at the top.
    restaurants_with_popularity = restaurants_with_popularity.sort_values(by='Review Count', ascending=False)
    sorted_restaurants_by_rating = restaurants_with_popularity.sort_values(by='Average Rating', ascending=False)

    # # Drop restaurant_experience column
    sorted_restaurants_by_rating = sorted_restaurants_by_rating.drop('restaurant_experience', axis=1)

    # rename restaurant_name and restaurant_rating
    sorted_restaurants_by_rating.rename(columns={'restaurant_name': "name"}, inplace=True)
    sorted_restaurants_by_rating.rename(columns={'restaurant_rating': "rating"}, inplace=True)

    # # Convert country column to lower case
    sorted_restaurants_by_rating['country'] = sorted_restaurants_by_rating['country'].str.lower()

    return sorted_restaurants_by_rating


def processedItemsUb(cookie_data : str, category, reviews) -> any:

    # Merge the datasets using a common column, e.g., 'id'
    merged_data = pd.merge(reviews, category, on='id', how='inner')

    train = merged_data.iloc[1:]  
    test = merged_data.iloc[0]

    #cosine similarity task
    # Initialize and fit the TF-IDF vectorizer, using feature made of words
    vectorizer = TfidfVectorizer(analyzer='word')
    tfidf_matrix = vectorizer.fit_transform(train['user_review'].values)

    # Calculate cosine similarities for the original dataset
    # cosine_similarities = cosine_similarity(tfidf_matrix)

    #Save the trained vectorizer for future use
    with open('vectorizer.pkl', 'wb') as vectorizer_file:
        pickle.dump(vectorizer, vectorizer_file)

    # Load the previously trained vectorizer
    with open('vectorizer.pkl', 'rb') as vectorizer_file:
        loaded_vectorizer = pickle.load(vectorizer_file)

    # Randomly select one user's review for testing
    # selected_entry = random.choice(cookie_data)
    # selected_review = selected_entry["user_review"]

    # Transform new text reviews into TF-IDF vectors using the existing vocabulary
    new_tfidf_matrix = loaded_vectorizer.transform([cookie_data])

    # Calculate cosine similarities between new and old data
    cosine_similarities = cosine_similarity(new_tfidf_matrix, tfidf_matrix)
    most_similar_indices = np.argsort(cosine_similarities, axis=1)[:, -3:]

    # Display the most similar entries from the original dataset for each entry in the new dataset
    for i, new_entry in enumerate([cookie_data]):
        most_similar_index = most_similar_indices[i]
        most_similar_entry = train.values[most_similar_index]
    
    return most_similar_entry



def fetchHotelsByLocation(location : str) -> dict[str, list[any]] :

    hotels = processedHotel()

    hotels_by_location = hotels[hotels['country'] == location]
    
    #Select the top 30 hotels from the sorted DataFrame, I am using 30 to provide users with a sufficient number of options while still maintaining a manageable list that avoids overwhelming them.
    data = hotels_by_location.head(12)

    # if data.empty:
    #     return {"error": 1, "message":f"No data exists yet for {location}"}

    data = data.to_dict(orient='records')
    
    return data

def fetchRestaurantsByLocation(location : str) -> dict[str, list[any]] :

    restaurants = processedRestaurants()

    restaurants_by_location = restaurants[restaurants['country'] == location]
    
    #Select the top 10 restaurants from the sorted DataFrame, I am using 30 to provide users with a sufficient number of options while still maintaining a manageable list that avoids overwhelming them.
    data = restaurants_by_location.head(12)

    # if data.empty:
    #     return {"error": 1, "message":f"No data exists yet for {location}"}

    data = data.to_dict(orient='records')
    
    return data

def fetchAttractionsByLocation(location : str) -> dict[str, list[any]] :

    attractions = processedAttractions()

    attractions_by_location = attractions[attractions['country'] == location]
    
    #Select the top 10 attractions from the sorted DataFrame, I am using 30 to provide users with a sufficient number of options while still maintaining a manageable list that avoids overwhelming them.
    data = attractions_by_location.head(12)

    data = data.to_dict(orient='records')
    
    return data

def fetchHotelsUb(cookie_data : str, location = None) -> dict[str, list[any]] :

    if not cookie_data:
        return []

    #Loading the dataset
    category = pd.read_csv(csv_hotels_path)
    reviews = pd.read_csv(csv_hotels_review_path) 

    hotels = processedItemsUb(cookie_data, category, reviews)

    # Create a DataFrame
    column_names = [
        'id', 'user_rating', 'user_name', 'user_review', 'name', 'rating',
        'experience', 'amenities', 'address', 'country',
        'description_link', 'discover_link', 'image_link'
    ]
    hotels_df = pd.DataFrame(hotels, columns=column_names)

    # Group user-related columns into a list of dictionaries
    user_data = hotels_df[['user_name', 'user_review', 'user_rating']].apply(lambda row: {
        'user_name': row['user_name'],
        'user_review': row['user_review'],
        'user_rating': row['user_rating']
    }, axis=1)

    # Create the 'review_data' column as an array of user data
    hotels_df['review_data'] = user_data.tolist()

    # Drop the 'user_name', 'user_review', and 'user_rating' columns
    hotels_df.drop(columns=['user_name', 'user_review', 'user_rating'], inplace=True)

    #convert countries to lower case
    hotels_df['country'] = hotels_df['country'].str.lower()

    # filter by location
    hotels_df = hotels_df[hotels_df['country'] == location]
    
    #Select the top 10 hotels from the sorted DataFrame, I am using 30 to provide users with a sufficient number of options while still maintaining a manageable list that avoids overwhelming them.
    data = hotels_df.head(12)

    data = data.to_dict(orient='records')
    
    return data

def fetchAttractionsUb(cookie_data : str, location = None) -> dict[str, list[any]] :
    
    if not cookie_data:
        return []

    #Loading the dataset
    category = pd.read_csv(csv_attractions_path)
    reviews = pd.read_csv(csv_attractions_review_path) 

    attraction = processedItemsUb(cookie_data, category, reviews)

    # Create a DataFrame
    column_names = [
        'id', 'Average Rating', 'user_name', 'user_review', 'name', 'rating',
        'experience', 'amenities', 'address', 'country',
        'description_link', 'discover_link', 'image_link'
    ]
    attractions_df = pd.DataFrame(attraction, columns=column_names)

    # convert countries to lower case
    attractions_df['country'] = attractions_df['country'].str.lower()

    # filter by location
    attractions_df = attractions_df[attractions_df['country'] == location]

    
    #Select the top 10 attraction from the sorted DataFrame, I am using 30 to provide users with a sufficient number of options while still maintaining a manageable list that avoids overwhelming them.
    data = attractions_df.head(12)

    data = data.to_dict(orient='records')
    
    return data

def fetchRestaurantsUb(cookie_data : str, location = None) -> dict[str, list[any]] :

    if not cookie_data:
        return []

    #Loading the dataset
    category = pd.read_csv(csv_restaurants_path)
    reviews = pd.read_csv(csv_restaurants_review_path) 

    restaurant = processedItemsUb(cookie_data, category, reviews)

    # Create a DataFrame
    column_names = [
        'id', 'Average Rating', 'user_name', 'user_review', 'name', 'rating',
        'experience', 'amenities', 'address', 'country',
        'description_link', 'discover_link', 'image_link'
    ]
    restaurants_df = pd.DataFrame(restaurant, columns=column_names)

    # convert countries to lower case
    restaurants_df['country'] = restaurants_df['country'].str.lower()

    # filter by location
    restaurants_df = restaurants_df[restaurants_df['country'] == location]
    
    #Select the top 10 restaurant from the sorted DataFrame, I am using 30 to provide users with a sufficient number of options while still maintaining a manageable list that avoids overwhelming them.
    data = restaurants_df.head(12)

    data = data.to_dict(orient='records')
    
    return data

def fetchCountry(location) -> dict[str, list[any]] :
    
   
    #Loading the dataset
    country = pd.read_csv(csv_country)

    # Create a DataFrame
    column_names = [
        'country', 'description', 'image'
    ]
    country_df = pd.DataFrame(country, columns=column_names)

    # convert countries to lower case
    country_df['country'] = country_df['country'].str.lower()

    # filter by location
    country_df = country_df[country_df['country'] == location]

    
    #Select the top 10 attraction from the sorted DataFrame, I am using 30 to provide users with a sufficient number of options while still maintaining a manageable list that avoids overwhelming them.
    data = country_df.head(1)

    data = data.to_dict(orient='records')
    
    return data

def fetchAllData (location : str, cookieData: str = None) -> dict[str, list[any]]:
    data = {
        "hotel_data": fetchHotelsByLocation(location),
        "restaurant_data": fetchRestaurantsByLocation(location),
        "attraction_data": fetchAttractionsByLocation(location),
        "hotel_data_ub" : fetchHotelsUb(cookieData, location),
        # "attractions_data_ub" : fetchAttractionsUb(cookieData, location),
        # "restaurants_data_ub" : fetchRestaurantsUb(cookieData, location),
        "country_data" : fetchCountry(location)
    }
    return data
