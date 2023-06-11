import os 
import pickle
from tqdm import tqdm 
from gtts import gTTS

class AudioGen:
    def __init__(self, project_name : str, artifact_folder : str) -> None:
        self.project_name = project_name 
        self.artifact_folder = artifact_folder 
        self.story_summary_path = os.path.join(self.artifact_folder, self.project_name, "story_summary.pkl")
        self.story_summary = pickle.load(open(self.story_summary_path, "rb"))
        self.chunks = self.story_summary['summary_chunks'][:2]
        self.audio_artifact_path = os.path.join(self.artifact_folder, self.project_name, "audios")

        if os.path.exists(self.audio_artifact_path):
            print(f"Audio artifact folder already exists at {self.audio_artifact_path}")
        else:
            os.mkdir(self.audio_artifact_path)

    def generate_audio(self) -> None:
        metadata = {}
        for idx, chunk in tqdm(enumerate(self.chunks), total=len(self.chunks)):
            try:
                tts = gTTS(text=chunk, lang='en')
                audio_save_path = os.path.join(self.audio_artifact_path, f"audio_{idx}.mp3")
                tts.save(audio_save_path)
                metadata[idx] = audio_save_path
            except Exception as e:
                continue 
        return metadata
        