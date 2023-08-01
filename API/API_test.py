from flask import Flask, request, jsonify
import pandas as pd
from data_processing import processed

app=Flask(__name__)

#Loading the dataset
category = pd.read_csv('../Raw/Hotels_in_Canada.csv')

reviews = pd.read_csv('../Raw/Hotels_in_Canada_Reviews.csv')


@app.route('/category', methods=['GET', 'POST'])
def data():
    if request.method == 'GET':
        cat=request.args.get('type')
        location=request.args.get('location')

        sorted_hotels = processed(category, reviews)
        top_N_hotels = sorted_hotels.head(30)

        recommended_hotels = top_N_hotels.to_dict(orient='records')


        return jsonify(recommended_hotels)

if __name__ == 'main':
    app.run()
