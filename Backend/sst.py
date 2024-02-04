

import assemblyai as aai

aai.settings.api_key = "4e8f82a6d5454ecb8116bc9195f26ebb"
transcriber = aai.Transcriber()

transcript = transcriber.transcribe("https://storage.googleapis.com/aai-web-samples/news.mp4")
# transcript = transcriber.transcribe("./my-local-audio-file.wav")

print(transcript.text)

# Save the transcript to a file
with open('transcript.txt', 'w', encoding='utf-8') as file:
    file.write(transcript.text)

# Send the transcript to main.py


print("Transcript saved and sent to main.py")
