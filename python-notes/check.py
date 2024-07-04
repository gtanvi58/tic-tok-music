import librosa
import numpy as np

audio_id = 'all-of-me'
y, sr = librosa.load(audio_id)
        # Compute the chroma features and onset envelope
chroma = librosa.feature.chroma_stft(y=y, sr=sr)
onset_env = librosa.onset.onset_strength(y=y, sr=sr, aggregate=np.median, fmax=8000, n_mels=256)

# Smooth the onset envelope
onset_env_smooth = librosa.util.normalize(librosa.effects.harmonic(onset_env), axis=0)

# Detect onset frames with adjusted parameters
onset_frames = librosa.onset.onset_detect(onset_envelope=onset_env_smooth, sr=sr, backtrack=True, pre_max=10, post_max=10, pre_avg=30, post_avg=30, delta=0.2, wait=30)

# Convert onset frames to time
onset_times = librosa.frames_to_time(onset_frames, sr=sr)

# Calculate the length of each note and filter short notes
min_note_duration = 0.2  # Minimum note duration in seconds

note_lengths = []
valid_onset_frames = [onset_frames[0]]
for i in range(1, len(onset_times)):
    note_length = onset_times[i] - onset_times[i - 1]
    if note_length >= min_note_duration:
        note_lengths.append(note_length)
        valid_onset_frames.append(onset_frames[i])

# Handle the last note's length
last_note_length = len(y) / sr - onset_times[-1]
if last_note_length >= min_note_duration:
    note_lengths.append(last_note_length)
    valid_onset_frames.append(onset_frames[-1])

# Extract notes based on the valid onset frames
first = True
notes = []
for onset in valid_onset_frames:
    chroma_at_onset = chroma[:, onset]
    note_pitch = chroma_at_onset.argmax()
    if not first:
        note_duration = librosa.frames_to_time(onset, sr=sr)
        notes.append((note_pitch, onset, note_duration - prev_note_duration))
        prev_note_duration = note_duration
    else:
        prev_note_duration = librosa.frames_to_time(onset, sr=sr)
        first = False

# Print the results
# print("Note pitch \t Onset frame \t Note duration")
res = []
for entry in notes:
    print(entry[2]+",")
    res.append(entry[2])