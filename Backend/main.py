from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid

app = FastAPI()

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
    
    return {"filename": unique_filename}
