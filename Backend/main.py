from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
from test import emotion_model
app = FastAPI()
#from pydub import AudioSegment
import numpy as np
file_path=[] #list of audio files we has
for a in os.listdir('files'):
    file_path.append(f"files/{a}")

temp =len(file_path)

origins = [
    "http://127.0.0.1:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    # Generate a unique filename using UUID
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    
    # Create the uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)
    
    # Save the file with the unique filename
    with open(os.path.join("uploads", unique_filename + ".ogg"), "wb") as buffer:
        buffer.write(await file.read())
    file.close()    
    #audio = AudioSegment.from_ogg(os.path.join("uploads", unique_filename + ".ogg"))
    #audio.export(os.path.join("uploads", unique_filename + ".ogg"), format='wav')
    
    #return emo_pred(os.path.join("uploads", unique_filename + ".ogg"))
    return 1



@app.get("/predict/")
async def get_prediction():
    """
    Get a prediction for a given file.

    Parameters:
    file_path (str): The file path to process.

    Returns:
    Any: The prediction for the given file.
    """
    # Process the file and get the prediction
    num=np.random.randint(0,temp)
    prediction = emotion_model(file_path[num])
    return prediction

