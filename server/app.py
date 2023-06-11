from flask import Flask, request
from dotenv import load_dotenv
from utils.main import generate_content
from flask_cors import CORS

import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
app.config['AWS_ACCESS_KEY_ID'] = os.getenv('AWS_ACCESS_KEY_ID')
app.config['AWS_SECRET_ACCESS_KEY'] = os.getenv('AWS_SECRET_ACCESS_KEY')
app.config['AWS_REGION'] = os.getenv('AWS_REGION')

@app.route('/story',methods=['POST'])
def home():
    data = request.get_json()  # get data from POST request
    if not data: 
        return "Bad Request", 400
    else:
        pdf_url = data['url']
        data = generate_content(pdf_url)
        return data

if __name__ == "__main__":
    app.run(debug=True)
