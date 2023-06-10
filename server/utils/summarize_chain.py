import pickle
import textwrap 
from typing import List 

from PyPDF2 import PdfReader
from langchain import OpenAI
from langchain.prompts import PromptTemplate
from langchain.docstore.document import Document
from langchain.chains.summarize import load_summarize_chain

# import from files 
from utils.prompts import Prompt

class SummarizeChain:
    def __init__(self, source_path : str, open_ai_temp : int = 0) -> None:
        self.source_path = source_path
        self.prompt = Prompt() 

        try:
            self.llm = OpenAI(temperature=open_ai_temp)
        except Exception as e:
            print(f"Open AI Exception occured at: {e}")
            return None 

        try: 
            self._document_loader =  PdfReader(self.source_path)
            self.pages = self._document_loader.pages 

            self.doc_texts = []
            for text in self.pages:
                self.doc_texts.append(
                    text.extract_text(0)
                )
            self.docs = [Document(page_content=t) for t in self.doc_texts]
        except Exception as e:
            print(f"Document Exception occured at: {e}")
            return None
        print("=> LLM and target document loaded successfully")

    def get_summary_based_on_prompt(self, prompt_type : str = "refine", save_response_dict : bool = True) -> dict:
        if prompt_type == "refine":
            self.base_prompt_template, self.refined_prompt_template = self.prompt.fetch_summarize_prompt_template() 
            self.BASE_PROMPT = PromptTemplate(
                template = self.base_prompt_template, input_variables=["text"]
            )
            self.REFINED_PROMPT = PromptTemplate(
                input_variables=["existing_answer", "text"],
                template=self.refined_prompt_template,
            )

            self.chain = load_summarize_chain(self.llm, 
                             chain_type="refine", 
                             return_intermediate_steps=True, 
                             question_prompt=self.BASE_PROMPT, 
                             refine_prompt=self.REFINED_PROMPT, verbose=True)
            self.output_summary = self.chain({
                "input_documents": self.docs
            }, return_only_outputs=True)

            wrapped_text = textwrap.fill(self.output_summary['output_text'], 
                             width=100,
                             break_long_words=False,
                             replace_whitespace=False)  
            intermediate_steps = []
            for step in self.output_summary['intermediate_steps']:
                intermediate_steps.append(step)
            
            response_dict = {
                'summary' : wrapped_text, 
                "chunks" : intermediate_steps
            }

            if save_response_dict:
                with open("intermediate_steps", "wb") as fp:
                    pickle.dump(response_dict, fp)

            return response_dict    