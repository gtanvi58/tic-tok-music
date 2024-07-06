from fastapi import FastAPI, HTTPException, Form
from pytube import YouTube
from pydub import AudioSegment
import os
import logging
from datetime import datetime

app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Directory to save downloaded files
DOWNLOAD_DIR = 'downloaded_files'

# Ensure the directory exists
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Function to download YouTube video and convert to MP3
def download_youtube_to_mp3(url, output_path):
    try:
        yt = YouTube(url)
        audio_stream = yt.streams.filter(only_audio=True).first()
        audio_file_path = os.path.join(DOWNLOAD_DIR, 'audio')
        audio_stream.download(filename=audio_file_path)

        # Convert to MP3
        audio = AudioSegment.from_file(audio_file_path)
        audio.export(output_path, format='mp3')

        # Clean up the downloaded file
        os.remove(audio_file_path)
    except Exception as e:
        logger.error(f"Error downloading or converting YouTube video: {e}")
        raise

@app.post("/download_mp3/")
async def download_mp3(youtube_url: str = Form(...)):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    output_filename = f'output.mp3'
    output_path = os.path.join(DOWNLOAD_DIR, output_filename)
    
    try:
        download_youtube_to_mp3(youtube_url, output_path)
        
        if not os.path.exists(output_path):
            raise HTTPException(status_code=500, detail="Failed to create MP3 file")
        
        return {"detail": "File downloaded and saved", "file_path": output_path}
    except Exception as e:
        logger.error(f"Failed to download and convert YouTube video: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to download and convert YouTube video: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

