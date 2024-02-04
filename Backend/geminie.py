# from fastapi import FastAPI, UploadFile, File
# import os
# import google.generativeai as genai
# from fastapi import FastAPI, Request, Form
# from fastapi.templating import Jinja2Templates

# os.environ['GOOGLE_API_KEY'] = "AIzaSyAiI7S9eVXJyI6_2vxKqkWIblRZzrWi2og"
# genai.configure(api_key=os.environ['AIzaSyAiI7S9eVXJyI6_2vxKqkWIblRZzrWi2og'])

# model = genai.GenerativeModel('gemini-pro')

# app = FastAPI()

# @app.post("/")

# def root():
#     return {"Status": "Success"}


# @app.post("/uploadfile")
# async def uploadfile(file: UploadFile = File(...)):
#     return {"file_name": file.filename}

# @app.post("/prompt")
# async def handle_input(request: Request, user_input: str = Form(...)):
#     response_data = model.generate_content(user_input)
#     return templates.TemplateResponse("index.html", {"request": request, "response_data": response_data.text})



from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.responses import UJSONResponse
import os
import google.generativeai as genai
import shutil

os.environ['GOOGLE_API_KEY'] = "AIzaSyAiI7S9eVXJyI6_2vxKqkWIblRZzrWi2og"
genai.configure(api_key=os.environ['GOOGLE_API_KEY'])

model = genai.GenerativeModel('gemini-pro')

app = FastAPI()

@app.post("/")
async def root():
    return UJSONResponse({"Status": "Success"})

@app.post("/uploadfile")
async def uploadfile(file: UploadFile = File(...)):
    with open(f'{file.filename}', "wb") as buffer:
        shutil.copyfileobj(file.file , buffer)
        return {"file_name": file.filename}

@app.post("/prompt")
async def handle_input(request: Request):
    try:
        # Read the content of transcript.txt
        with open("transcript.txt", "r") as transcript_file:
            user_input = transcript_file.read()
        
        base_prompt = "Pretend that you are a really intelligent dog named Oreo, and respond to the user's input as such. Make sure your answers are really small and do not include actions."
        full_prompt = user_input + base_prompt
        response_data = model.generate_content(full_prompt)
        return UJSONResponse({"prompt": response_data.text})
    
    except Exception as e:
        return UJSONResponse({"error": str(e)})
    
    