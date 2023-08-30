import os
import sys

import pandas as pd

app_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(app_dir)
sys.path.append(project_root)

from flask import Flask, request
from flask_cors import CORS

from Data.dataset import fetchAllData

app=Flask(__name__)

CORS(app)

# Fetch hotels by location
@app.route('/hotels', methods=['POST'])  
def fetchHotels():
    
    location=request.args.get('location').lower()
    cookie_data = request.get_json().get("cookie_data")

    

    print("cookieData is ======> ", cookie_data)

    return fetchAllData(location, cookie_data)
         

if __name__ == 'main':
    app.run()
 