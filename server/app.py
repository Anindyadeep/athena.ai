from flask import Flask
from dotenv import load_dotenv
from utils.main import generate_content
import os

load_dotenv()

app = Flask(__name__)
app.config['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
app.config['AWS_ACCESS_KEY_ID'] = os.getenv('AWS_ACCESS_KEY_ID')
app.config['AWS_SECRET_ACCESS_KEY'] = os.getenv('AWS_SECRET_ACCESS_KEY')
app.config['AWS_REGION'] = os.getenv('AWS_REGION')

@app.route('/story')
def home():
    data = generate_content()
    return data

if __name__ == "__main__":
    app.run(debug=True)
