# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# import io
# import requests
# import librosa
# from librosa.util import peak_pick
# import numpy as np
# from pytube import YouTube
# from pydantic import BaseModel
# from pydub import AudioSegment

# app = FastAPI()

# origins = [
#     "http://localhost.tiangolo.com",
#     "https://localhost.tiangolo.com",
#     "http://localhost",
#     "http://localhost:5173",
#     "http://localhost:3000",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class Url(BaseModel):
#     url: str

# @app.get("/notes/{audio_id}")
# async def get_notes(audio_id: str):
#     try:
#         youtube_url = f"https://www.youtube.com/watch?v={audio_id}"
#         print(f"Processing URL: {youtube_url}")
#         mp3_file, filtered_final_onsets = process_audio(youtube_url)
        
#         # Convert mp3_file BytesIO to a temporary file path
#         temp_mp3_file = save_temp_file(mp3_file)
        
#         # Return JSON response with filtered_final_onsets and temporary file path
#         return JSONResponse(content={"filtered_final_onsets": filtered_final_onsets, "mp3_file": temp_mp3_file})
    
#     except Exception as e:
#         print(f"Error: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to process audio: {e}")

# def download_youtube_to_mp3(url):
#     try:
#         yt = YouTube(url)
#         audio_stream = yt.streams.filter(only_audio=True).first()
#         audio_file = io.BytesIO()
#         audio_stream.stream_to_buffer(audio_file)
#         audio_file.seek(0)

#         # Convert to MP3
#         audio = AudioSegment.from_file(audio_file)
#         mp3_file = io.BytesIO()
#         audio.export(mp3_file, format='mp3')
#         mp3_file.seek(0)
        
#         return mp3_file
    
#     except Exception as e:
#         print(f"Error downloading or converting YouTube video: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to download or convert YouTube video: {e}")

# def process_audio(url):
#     try:
#         # Download and convert to MP3
#         mp3_file = download_youtube_to_mp3(url)
        
#         # Load the audio file from BytesIO
#         y, sr = librosa.load(mp3_file, sr=None)
#         onset_strength = librosa.onset.onset_strength(y=y, sr=sr)

#         # Define parameters for onset detection and peak picking
#         pre_max = 0.03
#         post_max = 0.03
#         pre_avg = 0.50
#         post_avg = 0.50
#         wait = 1
#         delta = 0.7

#         # Compute initial onsets
#         onset_idx = librosa.onset.onset_detect(onset_envelope=onset_strength, sr=sr, units='time',
#                                                backtrack=False, pre_max=pre_max, post_max=post_max,
#                                                pre_avg=pre_avg, post_avg=post_avg, wait=wait)

#         # Suppress multiple onsets of the same note using peak picking
#         final_onsets_idx = peak_pick(onset_strength, pre_max=pre_max, post_max=post_max,
#                                      pre_avg=pre_avg, post_avg=post_avg, wait=wait, delta=delta)

#         # Convert indices to time
#         final_onsets_times = librosa.frames_to_time(final_onsets_idx, sr=sr)

#         # Ensure onsets are at least 0.5 seconds apart
#         min_interval = 0.3
#         filtered_final_onsets = [final_onsets_times[0]]  # Start with the first onset

#         for onset_time in final_onsets_times[1:]:
#             if onset_time - filtered_final_onsets[-1] >= min_interval:
#                 filtered_final_onsets.append(onset_time)

#         print("Filtered final onsets:", filtered_final_onsets)

#         return mp3_file, filtered_final_onsets
    
#     except Exception as e:
#         print(f"Error processing audio: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to process audio: {e}")

# def save_temp_file(mp3_file):
#     try:
#         # Write BytesIO content to a temporary file
#         temp_file_path = "/tmp/temp_audio.mp3"  # Example temporary file path
#         with open(temp_file_path, "wb") as temp_file:
#             temp_file.write(mp3_file.getvalue())

#         return temp_file_path
    
#     except Exception as e:
#         print(f"Error saving temporary file: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to save temporary file: {e}")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8080)




from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import librosa
from librosa.util import peak_pick
import numpy as np
from pytube import YouTube
from pydub import AudioSegment
import os
import logging
from datetime import datetime
from pydantic import BaseModel

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:8001",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DOWNLOAD_DIR1 = '../src/play-music'
DOWNLOAD_DIR2 = './'

# Ensure the directory exists
os.makedirs(DOWNLOAD_DIR1, exist_ok=True)

class Url(BaseModel):
    url: str

last_audio_id = None
last_audio_file_path1 = None
last_audio_file_path2 = None

def download_youtube_to_mp3(url, output_path1, output_path2):
    try:
        yt = YouTube(url)
        audio_stream = yt.streams.filter(only_audio=True).first()
        audio_file_path = os.path.join(DOWNLOAD_DIR2, 'audio')
        audio_stream.download(filename=audio_file_path)

        # Convert to MP3
        audio = AudioSegment.from_file(audio_file_path)
        audio.export(output_path1, format='mp3')
        audio.export(output_path2, format='mp3')

        # Clean up the downloaded file
        os.remove(audio_file_path)
    except Exception as e:
        logger.error(f"Error downloading or converting YouTube video: {e}")
        raise

def download_mp3(request: Url):
    global last_audio_id, last_audio_file_path1, last_audio_file_path2

    output_filename = f'output.mp3'
    output_path1 = os.path.join(DOWNLOAD_DIR1, output_filename)
    output_path2 = os.path.join(DOWNLOAD_DIR2, output_filename)

    # Remove existing files if they exist
    if os.path.exists(output_path1):
        os.remove(output_path1)
    if os.path.exists(output_path2):
        os.remove(output_path2)

    try:
        download_youtube_to_mp3(request.url, output_path1, output_path2)
        
        if not os.path.exists(output_path1) or not os.path.exists(output_path2):
            raise HTTPException(status_code=500, detail="Failed to create MP3 file")
        
        last_audio_id = request.url
        last_audio_file_path1 = output_path1
        last_audio_file_path2 = output_path2
        
        return {"file1_path": output_path1, "file2_path": output_path2}
    except Exception as e:
        logger.error(f"Failed to download and convert YouTube video: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to download and convert YouTube video: {e}")

@app.get("/notes/{audio_id}")
async def root(audio_id: str):
    global last_audio_id, last_audio_file_path1, last_audio_file_path2

    if audio_id == last_audio_id:
        audio_file = last_audio_file_path2
    else:
        url_param = Url(url=f"https://www.youtube.com/watch?v={audio_id}")
        audio_file_paths = download_mp3(url_param)
        audio_file = audio_file_paths["file2_path"]
        last_audio_id = audio_id
        last_audio_file_path1 = audio_file_paths["file1_path"]
        last_audio_file_path2 = audio_file

    y, sr = librosa.load(audio_file)
    onset_strength = librosa.onset.onset_strength(y=y, sr=sr)

    # Define parameters for onset detection and peak picking
    pre_max = 0.03
    post_max = 0.03
    pre_avg = 0.50
    post_avg = 0.50
    wait = 1
    delta = 0.7

    # Compute initial onsets
    onset_idx = librosa.onset.onset_detect(onset_envelope=onset_strength, sr=sr, units='time',
                                           backtrack=False, pre_max=pre_max, post_max=post_max,
                                           pre_avg=pre_avg, post_avg=post_avg, wait=wait)

    # Suppress multiple onsets of the same note using peak picking
    final_onsets_idx = peak_pick(onset_strength, pre_max=pre_max, post_max=post_max,
                                 pre_avg=pre_avg, post_avg=post_avg, wait=wait, delta=delta)

    # Convert indices to time
    final_onsets_times = librosa.frames_to_time(final_onsets_idx, sr=sr)

    # Ensure onsets are at least 0.5 seconds apart
    min_interval = 0.3
    filtered_final_onsets = [final_onsets_times[0]]  # Start with the first onset

    for onset_time in final_onsets_times[1:]:
        if onset_time - filtered_final_onsets[-1] >= min_interval:
            filtered_final_onsets.append(onset_time)

    print("Filtered final onsets:", filtered_final_onsets)

    # Generate clicks at filtered onsets
    clicks = librosa.clicks(times=filtered_final_onsets, sr=sr, length=len(y))

    # Return the filtered final onsets as a JSON response
    return JSONResponse(content=jsonable_encoder(filtered_final_onsets))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
