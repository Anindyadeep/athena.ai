from flask import Flask, request
from dotenv import load_dotenv
from flask_cors import CORS

import os
import os 
import json 
import boto3 
from pathlib import Path

from src.chains import SummarizeChain
from src.image_gen import ImageGenFromSummary
from src.chatbot import IndexChatBot
from src.mcq_gen import MCQgenChain

load_dotenv(dotenv_path='.env/aws.env')

app = Flask(__name__)
CORS(app)

app.config['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
app.config['ARTIFACT_FOLDER'] = str(Path.home() / 'artifacts')
app.config['AWS_ACCESS_KEY_ID'] = os.getenv('AWS_ACCESS_KEY_ID')
app.config['AWS_SECRET_ACCESS_KEY'] = os.getenv('AWS_SECRET_ACCESS_KEY')

# @app.route('/story',methods=['POST'])
# def home():
#     data = request.get_json()  # get data from POST request
#     if not data: 
#         return "Bad Request", 400
#     else:
#         pdf_url = data['url']
#         data = generate_content(pdf_url)
#         return data
# setting defaut name:
name = "french_revolution"

@app.route('/generate_story', methods = ['POST'])
def generate_story():
    data = request.get_json()
    aws_public_file_link = data.get("url")
    #name = data.get("name")
    
    print("Downloading ...")
    s3 = boto3.client(
        's3', 
        aws_access_key_id=app.config['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=app.config['AWS_SECRET_ACCESS_KEY']
    )
    print("=> Download finished")

    bucket_name = 'gen-ai-storage' # FIXME: Right now, coding it hardcoded but have to change it later
    file_path = aws_public_file_link.split('/')[-1]
    local_downloaded_file_path = os.path.join(str(Path.home()), file_path)

    s3.download_file(
        bucket_name, file_path, local_downloaded_file_path
    )

    # Creating the summarize chain
    print("=> Story telling chain started")
    chain = SummarizeChain(
        project_name = name, 
        artifact_folder = app.config['ARTIFACT_FOLDER'],
        source_path = local_downloaded_file_path
    ) 
    story_response_content = chain.run_story_summary_chain()
    
    print("=> Story telling chain finished")

    imag_gen = ImageGenFromSummary(project_name = name, artifact_folder = app.config['ARTIFACT_FOLDER'])
    image_metadata = imag_gen.fetch_and_save_image() 
    image_metadata_keys = list(image_metadata.keys())

    imagen_aws_metadata = {}

    print("=> Uploading images to aws")
    for key in image_metadata_keys:
        file_path_to_upload = image_metadata[key]
        object_name = file_path_to_upload.split('/')[-1]
        try:
            s3.upload_file(
                file_path_to_upload, bucket_name, object_name
            )

            bucket_location = s3.get_bucket_location(Bucket=bucket_name)
            region = bucket_location['LocationConstraint']
            public_link = f"https://s3-{region}.amazonaws.com/{bucket_name}/{object_name}"
            imagen_aws_metadata[key] = public_link

        except Exception as e:
            continue
        

    # TODO: An additional step is to generate the audio and upload it to aws 

    response = {
        "status" : 200, 
        "story_response_content" : story_response_content,
        "image_metadata" : imagen_aws_metadata 
    }

    return json.dumps(response)


@app.route('/chatbot', methods = ['POST'])
def chatbot():
    data = request.get_json()
    query = data.get("query")
    #name = data.get("name")

    print("=> Chatbot started")
    chatbot = IndexChatBot(
        project_name = name, 
        artifact_folder = app.config['ARTIFACT_FOLDER']
    )
    response = chatbot.get_response(query)
    print("=> Chatbot finished")
    return json.dumps({"status" : 200, "response" : response})


@app.route('/get_mcq', methods = ['POST'])
def generate_mcq():
    data = request.get_json()
    #name = data.get("name")

    mcq_chain = MCQgenChain(
        project_name=name, artifact_folder=app.config['ARTIFACT_FOLDER']
    )
    response = mcq_chain.generate_mcqs()
    return response 

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

