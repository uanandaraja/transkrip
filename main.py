from flask import Flask, request, render_template
import openai
from io import BytesIO
import os

app = Flask(__name__)

token = os.getenv("token")
openai.api_key = token

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/transcribe', methods=['POST'])
def transcribe():
    file = request.files['file']
    audio = file.read()

    try:
        audio_file = BytesIO(audio)
        audio_file.name = "audio.mp3"  # Set the name attribute
        transcription = openai.Audio.transcribe("whisper-1", audio_file)
        text = transcription['text']
        return text
    except Exception as e:
        return str(e)


if __name__ == '__main__':
  app.run(debug=True)
