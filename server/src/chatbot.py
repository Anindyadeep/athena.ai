import os 
import pickle 
from dotenv import load_dotenv

import llama_index
from langchain import OpenAI
from langchain.embeddings import OpenAIEmbeddings
from llama_index import LLMPredictor, ServiceContext
from llama_index import SimpleDirectoryReader, LangchainEmbedding, GPTVectorStoreIndex

class IndexChatBot:
    def __init__(self, project_name : str, artifact_folder : str) -> None:
        self.story_summary_path = os.path.join(artifact_folder, project_name, "story_summary.pkl")
        self.story_summary = pickle.load(
            open(self.story_summary_path, "rb")
        )
        chunks = self.story_summary['summary_chunks']
        self.documents = [llama_index.Document(t) for t in chunks]

        load_dotenv(dotenv_path='.env/openai.env')
        try:
            _openai_key = os.getenv("OPENAI_API_KEY")
            self.llm_predictor = LLMPredictor(
                llm = OpenAI(openai_api_key=_openai_key, temperature=0),
            )
            openai_embedding = OpenAIEmbeddings(openai_api_key=_openai_key)
            self.embed_model = LangchainEmbedding(openai_embedding)

            self.service_context = ServiceContext.from_defaults(
                llm_predictor=self.llm_predictor,embed_model=self.embed_model
            )

            self.vector_store_index = GPTVectorStoreIndex.from_documents(
                self.documents, service_context=self.service_context
            )
        except Exception as e:
            print(f"Certain exception occured as {e}")
        
        self.query_engine = self.vector_store_index.as_query_engine()
        print("=> Everything loaded successfully")
    
    def get_response(self, query : str) -> str:
        return self.query_engine.query(query)