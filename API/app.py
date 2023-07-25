from flask import Flask, request

app=Flask(__name__)

@app.route('/category', methods=['GET', 'POST'])
def data():
    if request.method == 'GET':
        cat=request.args.get('type')
        location=request.args.get('location')

        return {'data' : [cat, location] }

if __name__ == 'main':
    app.run()
