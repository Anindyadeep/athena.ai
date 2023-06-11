# Athena.ai
Welcome to Athena.ai! We revolutionize the way school students learn tough concepts by converting them into engaging and immersive story podcasts and storybooks.

## The Codebase
- There are two folders: frontend and server
### Server Setup
- To setup the server, move into the server directory and create a virtual environment. 
- For windows, run `python -m venv venv` and then `./venv/Scripts/activate` to activate the virtual environment.
- Install all the dependencies using `pip install -r requirements.txt`
- Configure the environment variables in the .env file
    ```
        OPENAI_API_KEY=sk-<your-openai-api-key>
        AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
        AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
        AWS_REGION=<your-aws-region>
    ```
- Run the server using `flask run`
### Frontend Setup
- To setup the frontend, move into the frontend directory and install all the dependencies using `yarn`
- Configure the environment variables in the .env file
- Run the frontend using `yarn start`

## Tools used
- Langchain, LlamaIndex, Stability AI, OpenAI
- AWS
- React, Flask 
