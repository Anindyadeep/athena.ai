import boto3
from contextlib import closing
from botocore.exceptions import NoCredentialsError
from pydub import AudioSegment
import os
from datetime import datetime


AudioSegment.converter = os.getenv('FFMPEG_PATH')
os.environ["PATH"] += os.pathsep + 'C:/ffmpeg/bin'


s3 = boto3.client('s3')
polly = boto3.client('polly')


def chunk_text(text, chunk_size):
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]


def text_to_speech(text):
    try:
        # Adjust chunk size according to your requirements
        chunks = chunk_text(text, 3000)

        timestamp = datetime.now().strftime('%Y-%m-%d-%H%M%S')
        output = f"speech_{timestamp}.mp3"
        path = os.getcwd()+f"\speech_{timestamp}.mp3"
        for i, chunk in enumerate(chunks[:1]):
            response = polly.synthesize_speech(
                Text=chunk, OutputFormat='mp3', VoiceId='Ruth', Engine='neural')
            if "AudioStream" in response:
                with closing(response["AudioStream"]) as stream:
                    try:
                        # Open a file for writing the output as a binary stream
                        with open(path, "wb") as file:
                            file.write(stream.read())
                    except IOError as ioe:
                        print(ioe)
                        return "Could not write to file", 500

        resp = s3.upload_file(path, 'gen-ai-storage', output)
        print(resp)
        os.remove(path)
        url = "https://gen-ai-storage.s3.ap-south-1.amazonaws.com/"+output

        return {"audio_url": url}

    except NoCredentialsError:
        return "No AWS credentials found", 400
