import os 
import base64
import json 
import pickle 
import requests
from tqdm import tqdm 
from dotenv import load_dotenv
from google_images_search import GoogleImagesSearch

# imports from different files 
from src.prompt_storage import PromptStorageForChains

class ImageGenFromSummary:
    def __init__(self, project_name : str, artifact_folder : str) -> None:
        """_summary_

        Args:
            project_name (str): _description_
            artifact_folder (str): _description_

        Structure of the artifact 

        /artifacts/sample_artifact
            - /images
                - image1.png 
                - image2.png 
                ... 
            - /audios
                - audio1.mp3
                - audio2.mp3
                ... 
            - audio_metadata.pkl
            - story_summary.pkl 
            - image_metadata.pkl 
        """
        self.project_name = project_name 
        self.artifact_folder = artifact_folder 
        self.story_summary_path = os.path.join(self.artifact_folder, self.project_name, "story_summary.pkl")
        self.image_gen_artifact_path = os.path.join(self.artifact_folder, self.project_name, "images")
        self.image_gen_artifact_metadata = os.path.join(self.artifact_folder, self.project_name, "image_metadata.pkl")
        
        # loading google and hugging face environments 

        load_dotenv(dotenv_path='.env/hugging_face.env')
        load_dotenv(dotenv_path='.env/google.env')

        self._hugging_face_api_key = os.getenv("API_TOKEN")
        self._google_api_key = os.getenv("GOOGLE_IMAGE_SEARCH_API_KEY")
        self._cx = os.getenv("CX")
        
        self._hugging_face_url = "https://api-inference.huggingface.co/models/dslim/bert-base-NER"
        self._headers = {
            "Authorization": f"Bearer {self._hugging_face_api_key}"
        }

        self._gis = GoogleImagesSearch(self._google_api_key, self._cx)

        # creating the artifact folder for images
        try:
            if not os.path.exists(self.image_gen_artifact_path):
                os.mkdir(self.image_gen_artifact_path)
            else:
                print(f"Image artifact folder already exists at {self.image_gen_artifact_path}")
        except Exception as e:
            print(f"Exception occured at: {e}")
            return None

        # loading the story summary
        try:
            with open(self.story_summary_path, "rb") as f:
                self.story_summary = pickle.load(f)
        except Exception as e:
            print(f"Exception occured at: {e}")
            return None
        
        self.prompt_storage = PromptStorageForChains()
        self._search_params = {
            "q": "",
            "num": 1,
        }

        self.image_metadata = {}

    def query(self, payload):
        response = requests.post(self._hugging_face_url, headers=self._headers, json=payload)
        return response.json()


    def text_to_image(self, prompt, path_to_save : str):
        response = requests.post(
            "https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer sk-HqppqkuKYv1kJvCvdeGbwKtTXGzBxCBdbkEZxlSw9TL53JX0"
            },
            json={
                "text_prompts": [
                    {
                        "text": prompt
                    }
                ]
                },
        )
        if response.status_code != 200:
            return "err"

        try:
            data = response.json()
            with open(f"{path_to_save}", "wb") as f:
                f.write(base64.b64decode(data["artifacts"][0]["base64"]))
            return "./img.png"
        except:
            return "err1"


    def fetch_and_save_image(self):
        """_fetch_and_save_image_

        Args:
            text (str): _description_
        """

        # sanity check before proceeding

        if not os.path.exists(self.image_gen_artifact_metadata):
            for chunk_num, chunk in tqdm(enumerate(self.story_summary['summary_chunks']), total=len(self.story_summary['summary_chunks'])):
                output_ner_step = self.query(
                    {"inputs" : str(chunk)}
                )

                top3_ner = [ner['word'] for ner in output_ner_step[:3]]

                image_query = self.prompt_storage.fetch_image_search_prompt(top3_ner)
                self._search_params['q'] = image_query
                
                path_to_save = os.path.join(
                    self.artifact_folder, self.project_name, "images"
                )
                
                # self._gis.search(
                #     search_params=self._search_params, 
                #     path_to_dir=path_to_save, width=500, height=500, 
                #     custom_image_name=f"{chunk_num}"
                # )
                
                image_path_to_save = os.path.join(path_to_save, f"{chunk_num}.jpg")
                self.text_to_image(
                    prompt = image_query,
                    path_to_save=image_path_to_save
                )
                self.image_metadata[chunk_num] = image_path_to_save
            
            with open(self.image_gen_artifact_metadata, "wb") as f:
                pickle.dump(self.image_metadata, f)

            return self.image_metadata

        else:
            print("=> Image metadata already exists, loading the metadata")
            with open(self.image_gen_artifact_metadata, "rb") as f:
                return pickle.load(f)
        