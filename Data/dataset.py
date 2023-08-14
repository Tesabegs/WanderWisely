import os

from flask import jsonify


import pandas as pd
data_dir = os.path.dirname(os.path.abspath(__file__))

csv_hotels_path = os.path.join(data_dir, 'Raw', 'Hotels_in_Canada.csv')
csv_hotels_review_path = os.path.join(data_dir, 'Raw', 'Hotels_in_Canada_Reviews.csv')


#Loading the dataset
category = pd.read_csv(csv_hotels_path)

reviews = pd.read_csv(csv_hotels_review_path)

def processed(category, reviews) -> pd.DataFrame:

    #Performing data cleaning by handling all missing values
    # Fill missing values in "Hotel rating" with the mean of available ratings
    mean_rating = category['hotel_rating'].mean()
    category['hotel_rating'].fillna(mean_rating, inplace=True)

    # Remove data with empty amenities ('[]') to further clean the data
    category = category[category['amenities'] != '[]']

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
    hotels_with_popularity.sort_values(by='Review Count', ascending=False)
    sorted_hotels_by_rating = hotels_with_popularity.sort_values(by='Average Rating', ascending=False)

    # # Drop hotel_experience column
    sorted_hotels_by_rating = sorted_hotels_by_rating.drop('hotel_experience', axis=1)

    # # Convert country column to lower case
    sorted_hotels_by_rating['country'] = sorted_hotels_by_rating['country'].str.lower()

    return sorted_hotels_by_rating



def fetchHotelsByLocation(location : str) -> dict[str, list[any]] :

    hotels = processed(category, reviews)

    hotels_by_location = hotels[hotels['country'] == location]
    
    #Select the top 30 hotels from the sorted DataFrame, I am using 30 to provide users with a sufficient number of options while still maintaining a manageable list that avoids overwhelming them.
    data = hotels_by_location.head(30)

    if data.empty:
        return {"error": 1, "message":f"No data exists yet for {location}"}

    data = data.to_dict(orient='records')
    
    return data
