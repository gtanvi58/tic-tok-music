# from flask import Flask, jsonify           # import flask
# import librosa
# import numpy as np
# from flask_cors import CORS  # Import CORS from flask_cors module

# app = Flask(__name__)
# CORS(app, resources={r"/notes/*": {"origins": "http://localhost:3000"}})

# print("helloo")
# @app.route('/notes/<string:id>', methods = ['GET']) 
# def get_notes(id):
#     print("inside func!")
#     # Load the audio file
#     y, sr = librosa.load(id)

#     # Compute the chroma features and onset envelope
#     chroma = librosa.feature.chroma_stft(y=y, sr=sr)
#     onset_env = librosa.onset.onset_strength(y=y, sr=sr, aggregate=np.median, fmax=8000, n_mels=256)

#     # Smooth the onset envelope
#     onset_env_smooth = librosa.util.normalize(librosa.effects.harmonic(onset_env), axis=0)

#     # Detect onset frames with adjusted parameters
#     onset_frames = librosa.onset.onset_detect(onset_envelope=onset_env_smooth, sr=sr, backtrack=True, pre_max=10, post_max=10, pre_avg=30, post_avg=30, delta=0.2, wait=30)

#     # Convert onset frames to time
#     onset_times = librosa.frames_to_time(onset_frames, sr=sr)

#     # Calculate the length of each note and filter short notes
#     min_note_duration = 0.2  # Minimum note duration in seconds

#     note_lengths = []
#     valid_onset_frames = [onset_frames[0]]
#     for i in range(1, len(onset_times)):
#         note_length = onset_times[i] - onset_times[i - 1]
#         if note_length >= min_note_duration:
#             note_lengths.append(note_length)
#             valid_onset_frames.append(onset_frames[i])

#     # Handle the last note's length
#     last_note_length = len(y) / sr - onset_times[-1]
#     if last_note_length >= min_note_duration:
#         note_lengths.append(last_note_length)
#         valid_onset_frames.append(onset_frames[-1])

#     # Extract notes based on the valid onset frames
#     first = True
#     notes = []
#     for onset in valid_onset_frames:
#         chroma_at_onset = chroma[:, onset]
#         note_pitch = chroma_at_onset.argmax()
#         if not first:
#             note_duration = librosa.frames_to_time(onset, sr=sr)
#             notes.append((note_pitch, onset, note_duration - prev_note_duration))
#             prev_note_duration = note_duration
#         else:
#             prev_note_duration = librosa.frames_to_time(onset, sr=sr)
#             first = False

#     # Print the results
#     # print("Note pitch \t Onset frame \t Note duration")
#     res = []
#     for entry in notes:
#         print(entry[2]+",")
#         res.append(entry[2])

#     return jsonify({'data': res}) 
# if __name__ == "__main__":        # on running python app.py
#     app.run(debug=True, port=8080)     


from fastapi import FastAPI, File, UploadFile,Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import librosa
from librosa.util import peak_pick
import numpy as np

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/notes/{audio_id}")
async def root(audio_id: str):
    print("printing id ", audio_id)
    print("printing audio ", audio_id)
 
# import soundfile as sf

# Load audio file and compute onset strength
    audio_file = audio_id+'.mp3'
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

    # Write audio with clicks
    # sf.write('audio_with_clicks_filtered.wav', y + clicks, sr)
    # return {"message": "Hello World!!!! Lets Transcribe"}
    return filtered_final_onsets

