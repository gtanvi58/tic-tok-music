# import librosa
# import numpy as np
# import soundfile as sf

# # Load the audio file
# audio_file = './7-years.mp3'
# y, sr = librosa.load(audio_file)

# # Compute the chroma features and onset envelope
# chroma = librosa.feature.chroma_stft(y=y, sr=sr)
# onset_env = librosa.onset.onset_strength(y=y, sr=sr, aggregate=np.median, fmax=8000, n_mels=256)

# # Smooth the onset envelope
# onset_env_smooth = librosa.util.normalize(librosa.effects.harmonic(onset_env), axis=0)

# # Detect onset frames with more sensitive parameters
# onset_frames = librosa.onset.onset_detect(onset_envelope=onset_env_smooth, sr=sr, backtrack=True, 
#                                           pre_max=5, post_max=5, pre_avg=20, post_avg=20, 
#                                           delta=0.1, wait=10)

# # Convert onset frames to time
# onset_times = librosa.frames_to_time(onset_frames, sr=sr)

# # Calculate the length of each note and filter short notes
# min_note_duration = 0.1  # Minimum note duration in seconds

# note_lengths = []
# valid_onset_frames = [onset_frames[0]]
# for i in range(1, len(onset_times)):
#     note_length = onset_times[i] - onset_times[i - 1]
#     if note_length >= min_note_duration:
#         note_lengths.append(note_length)
#         valid_onset_frames.append(onset_frames[i])

# # Handle the last note's length
# last_note_length = len(y) / sr - onset_times[-1]
# if last_note_length >= min_note_duration:
#     note_lengths.append(last_note_length)
#     valid_onset_frames.append(onset_frames[-1])

# # Extract notes based on the valid onset frames
# first = True
# notes = []
# note_times = []
# for onset in valid_onset_frames:
#     chroma_at_onset = chroma[:, onset]
#     note_pitch = chroma_at_onset.argmax()
#     if not first:
#         note_duration = librosa.frames_to_time(onset, sr=sr)
#         notes.append((note_pitch, onset, note_duration - prev_note_duration))
#         note_times.append(note_duration + prev_note_duration)
#         prev_note_duration = note_duration
#     else:
#         prev_note_duration = librosa.frames_to_time(onset, sr=sr)
#         first = False

# # Print the results
# click_vis = librosa.clicks(times=note_times, sr=sr, click_freq=660,
#                                click_duration=0.25, length=len(y))
# sf.write('audio_with_clicks.wav', y+click_vis, sr)
# # sf.write('audio_with_clicks-1.wav', y, sr)
# print("Note pitch \t Onset frame \t Note duration")
# for entry in notes:
#     print(entry[0], '\t\t', entry[1], '\t\t', entry[2])

# # Save the note durations to a file
# with open("notes.txt", 'w') as f:
#     for entry in notes:
#         f.write(f"{entry[2]},")


import librosa
import numpy as np

def get_notes(song_id):
    
    # Load the audio file
    y, sr = librosa.load(song_id)

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
    for entry in notes:
        print(entry[2]+",")

    # Save the note durations to a file
    with open("notes.txt", 'w') as f:
        for entry in notes:
            f.write(f"{entry[2]},")


# import librosa
# import numpy as np

# # Load the audio file
# audio_file = './7-years.mp3'
# y, sr = librosa.load(audio_file)

# # Compute the chroma features and onset envelope
# chroma = librosa.feature.chroma_stft(y=y, sr=sr)
# onset_env = librosa.onset.onset_strength(y=y, sr=sr, aggregate=np.median, fmax=8000, n_mels=256)

# # Smooth the onset envelope
# onset_env_smooth = librosa.util.normalize(librosa.effects.harmonic(onset_env), axis=0)

# # Detect onset frames with a higher backtrack parameter
# onset_frames = librosa.onset.onset_detect(onset_envelope=onset_env_smooth, sr=sr, backtrack=True, pre_max=20, post_max=20, pre_avg=50, post_avg=50, delta=0.3, wait=50)

# # Convert onset frames to time
# onset_times = librosa.frames_to_time(onset_frames, sr=sr)

# # Calculate the length of each note and filter short notes
# min_note_duration = 0.1  # Minimum note duration in seconds

# note_lengths = []
# valid_onset_frames = [onset_frames[0]]
# for i in range(1, len(onset_times)):
#     note_length = onset_times[i] - onset_times[i - 1]
#     if note_length >= min_note_duration:
#         note_lengths.append(note_length)
#         valid_onset_frames.append(onset_frames[i])

# # Handle the last note's length
# last_note_length = len(y) / sr - onset_times[-1]
# if last_note_length >= min_note_duration:
#     note_lengths.append(last_note_length)
#     valid_onset_frames.append(onset_frames[-1])

# # Extract notes based on the valid onset frames
# first = True
# notes = []
# for onset in valid_onset_frames:
#     chroma_at_onset = chroma[:, onset]
#     note_pitch = chroma_at_onset.argmax()
#     if not first:
#         note_duration = librosa.frames_to_time(onset, sr=sr)
#         notes.append((note_pitch, onset, note_duration - prev_note_duration))
#         prev_note_duration = note_duration
#     else:
#         prev_note_duration = librosa.frames_to_time(onset, sr=sr)
#         first = False

# # Print the results
# print("Note pitch \t Onset frame \t Note duration")
# for entry in notes:
#     print(entry[0], '\t\t', entry[1], '\t\t', entry[2])

# # Save the note durations to a file
# with open("notes.txt", 'w') as f:
#     for entry in notes:
#         f.write(f"{entry[2]},")

# import librosa
# import numpy as np

# # Loading the audio file 
# audio_file = './7-years.mp3'
# y, sr = librosa.load(audio_file)

# # Extracting the chroma features and onsets 
# chroma = librosa.feature.chroma_stft(y=y, sr=sr)
# onset_frames = librosa.onset.onset_detect(y=y, sr=sr)

# first = True
# notes = []
# for onset in onset_frames:
#   chroma_at_onset = chroma[:, onset]
#   note_pitch = chroma_at_onset.argmax()
#   # For all other notes
#   if not first:
#       note_duration = librosa.frames_to_time(onset, sr=sr)
#       notes.append((note_pitch,onset, note_duration - prev_note_duration))
#       prev_note_duration = note_duration
#   # For the first note
#   else:
#       prev_note_duration = librosa.frames_to_time(onset, sr=sr)
#       first = False
# print("Note pitch \t Onset frame \t Note duration")
# print(len(notes))

# f = open("notes.txt", 'w')
# for entry in notes:
#   f.write(str(entry[2])+",")
#   print(entry[0],'\t\t',entry[1],'\t\t',entry[2])

# # import librosa
# # import librosa.display
# # import matplotlib.pyplot as plt
# # import sounddevice as sd
# # import time

# # Load the audio file
# audio_path = './7-years.mp3'
# y, sr = librosa.load(audio_path, sr=None)

# onset_env = librosa.onset.onset_strength(y=y, sr=sr,
#                                          aggregate=np.median,
#                                          fmax=8000, n_mels=256)
# # Detect onset frames
# onset_frames = librosa.onset.onset_detect(y=y, sr=sr, onset_envelope = onset_env, backtrack=True)

# # Convert onset frames to time
# onset_times = librosa.frames_to_time(onset_frames, sr=sr)

# # Calculate the length of each note
# note_lengths = []
# for i in range(len(onset_times) - 1):
#     note_length = onset_times[i + 1] - onset_times[i]
#     note_lengths.append(note_length)

# # Handle the last note's length
# last_note_length = len(y) / sr - onset_times[-1]
# note_lengths.append(last_note_length)

# print("printing note lengths ", len(note_lengths))

# Function to update the plot during playback
# def update_plot(current_time):
#     plt.clf()
#     librosa.display.waveshow(y, sr=sr, alpha=0.6)
#     plt.title('Audio waveform with detected notes')
#     plt.xlabel('Time (s)')
#     plt.ylabel('Amplitude')

#     for i in range(len(onset_times)):
#         start = onset_times[i]
#         end = start + note_lengths[i]
#         plt.axvspan(start, end, color='r', alpha=0.3 if current_time < end else 0.5)
    
#     plt.axvline(current_time, color='b', linestyle='--')
#     plt.pause(0.01)

# # Start playback and update plot in real-time
# sd.play(y, sr)
# start_time = time.time()

# plt.ion()
# plt.figure(figsize=(14, 5))

# while True:
#     current_time = time.time() - start_time
#     update_plot(current_time)
    
#     # Print note information if current_time is within a note's duration
#     for i in range(len(onset_times)):
#         start = onset_times[i]
#         end = start + note_lengths[i]
#         if start <= current_time <= end:
#             print(f'Playing Note {i + 1}: {current_time - start:.2f} / {note_lengths[i]:.2f} seconds', end='\r')
#             break

#     if current_time >= len(y) / sr:
#         break

# plt.ioff()
# plt.show()
# sd.stop()


# import librosa
# import numpy as np
# import matplotlib.pyplot as plt

# # Load the audio file
# audio_path = './7-years.mp3'
# y, sr = librosa.load(audio_path, sr=None)

# # Detect onset frames
# onset_frames = librosa.onset.onset_detect(y=y, sr=sr, backtrack=True)

# # Convert onset frames to time
# onset_times = librosa.frames_to_time(onset_frames, sr=sr)

# # For demonstration, let's plot the onset times on the waveform
# plt.figure(figsize=(14, 5))
# librosa.display.waveshow(y, sr=sr)
# plt.vlines(onset_times, -1, 1, color='r', linestyle='--')
# plt.title('Onset detection')
# plt.show()

# # Detect the length of each note
# note_lengths = []
# for i in range(len(onset_times) - 1):
#     note_length = onset_times[i + 1] - onset_times[i]
#     note_lengths.append(note_length)

# # Print the length of each note
# for i, length in enumerate(note_lengths):
#     print(f'Note {i + 1}: {length:.2f} seconds')

# # Handling the last note's length (optional)
# # Assuming the last note continues till the end of the audio
# last_note_length = len(y) / sr - onset_times[-1]
# note_lengths.append(last_note_length)
# print(f'Note {len(onset_times)}: {last_note_length:.2f} seconds')


# import numpy as np
# import librosa
# import matplotlib.pyplot as plt
# from IPython.display import Audio
# import soundfile as sf

# y, sr = librosa.load('./7-years.mp3')

# librosa.onset.onset_detect(y=y, sr=sr, units='time')

# tempo_dynamic = librosa.feature.tempo(y=y, sr=sr, aggregate=None, std_bpm=5)
# onset_env = librosa.onset.onset_strength(y=y, sr=sr,
#                                          aggregate=np.median)
# tempo, beats_static = librosa.beat.beat_track(y=y, sr=sr, units='time', trim=False)

# tempo, beats_dynamic = librosa.beat.beat_track(y=y, sr=sr, onset_envelope = onset_env, units='time',
#                                                bpm=tempo_dynamic, trim=False)


# print("printing beats dynamic ", beats_dynamic)
# click_dynamic = librosa.clicks(times=beats_dynamic, sr=sr, click_freq=660,
#                                click_duration=0.25, length=len(y))
# sf.write('audio_with_clicks.wav', y+click_dynamic, sr)
# sf.write('audio_with_clicks-1.wav', y, sr)

# Audio(data=y+click_dynamic, rate=sr)

# Audio(data=y, rate=sr)


# import librosa
# import soundfile as sf

# # # Load audio file
# x, sr = librosa.load('./MUSIC.mp3')

# # Detect tempo and beat frames
# tempo, beat_frames = librosa.beat.beat_track(y=x, sr=sr, start_bpm=60)
# print("printing tempo ", tempo)
# beat_times = librosa.frames_to_time(beat_frames, sr=sr)

# # Generate clicks at beat frames with the correct length
# clicks = librosa.clicks(frames=beat_frames, sr=sr, length=len(x))  # Ensure length matches x
# clicks *= 5
# # Write audio with clicks to WAV file
# sf.write('audio_with_clicks.wav', x + clicks, sr)


# import modules
# import madmom 

# # Load audio file
# x, sr = librosa.load('./MUSIC.mp3')

# # Process audio with madmom for beat tracking
# proc = madmom.features.beats.DBNBeatTrackingProcessor(fps=100)
# act = madmom.features.beats.RNNBeatProcessor()(x)

# # Extract beat times
# beat_times = proc(act)

# # Generate clicks at beat times
# clicks = librosa.clicks(frames=beat_times * sr, sr=sr, length=len(x))

# # Adjust clicks amplitude if needed
# clicks *= 5  # Adjust the amplitude multiplier as needed

# # Create combined audio with clicks
# audio_with_clicks = x + clicks

# Create IPython Audio object for playback
# sf.write('audio_with_clicks.wav', audio_with_clicks, sr)


# import madmom
# import librosa
# import soundfile as sf
# import IPython.display as ipd
# import numpy as np  # Import NumPy


# Load audio file
# Load audio file
# Load audio file
# x, sr = librosa.load('./MUSIC.mp3')

# # Process audio with madmom for beat tracking
# proc = madmom.features.beats.DBNBeatTrackingProcessor(fps=100)
# act = madmom.features.beats.RNNBeatProcessor()(x)

# # Extract beat times
# beat_times = proc(act)
# # Convert beat frames to time using librosa
# # Generate clicks at specified times
# click_times = librosa.frames_to_time(beat_times, sr=sr)
# clicks = librosa.clicks(times=click_times, sr=sr, length=len(x))

# # Ensure clicks array has the same length as the original audio
# if len(clicks) > len(x):
#     clicks = clicks[:len(x)]
# else:
#     clicks = np.pad(clicks, (0, len(x) - len(clicks)), mode='constant')

# # Adjust clicks amplitude if needed
# clicks *= 0.5  # Adjust the amplitude multiplier as needed

# # Combine audio with clicks
# audio_with_clicks = x + clicks


# # Save audio with clicks to a WAV file
# sf.write('audio_with_clicks.wav', audio_with_clicks, sr)


# import librosa
# import os

# file_path = './MUSIC.mp3'
# x, sr = librosa.load(file_path)

# # Correct usage of onset_detect with keyword arguments
# onset_frames = librosa.onset.onset_detect(y=x, sr=sr, wait=1, pre_avg=1, post_avg=1, pre_max=1, post_max=1)
# onset_times = librosa.frames_to_time(onset_frames)

# # Remove extension, .mp3, .wav etc.
# file_name_no_extension, _ = os.path.splitext(file_path)
# output_name = file_name_no_extension + '.beatmap.txt'

# # Write onset times to a file
# with open(output_name, 'wt') as f:
#     f.write('\n'.join(['%.4f' % onset_time for onset_time in onset_times]))


# import librosa
# import os
# import sounddevice as sd
# import numpy as np

# # Load the audio file
# file_path = './MUSIC.mp3'
# x, sr = librosa.load(file_path)

# # Detect onset frames
# onset_frames = librosa.onset.onset_detect(y=x, sr=sr, wait=1, pre_avg=1, post_avg=1, pre_max=1, post_max=1)
# onset_times = librosa.frames_to_time(onset_frames)

# # Generate a click sound
# click_duration = 0.1  # 100 ms
# click_frequency = 1000  # 1 kHz
# t = np.linspace(0, click_duration, int(sr * click_duration), endpoint=False)
# click_sound = 0.5 * np.sin(2 * np.pi * click_frequency * t)

# # Play click sound at each onset time
# def play_clicks(onset_times, click_sound, sr):
#     for onset in onset_times:
#         sd.play(click_sound, samplerate=sr)
#         sd.wait()  # Wait until the sound is done playing
#         # Wait for the next onset time
#         time_to_next_onset = (onset - sd.get_stream().time) if onset > sd.get_stream().time else 0
#         sd.sleep(int(time_to_next_onset * 1000))

# # Remove file extension and create output file
# file_name_no_extension, _ = os.path.splitext(file_path)
# output_name = file_name_no_extension + '.beatmap.txt'

# # Write onset times to a file
# with open(output_name, 'wt') as f:
#     f.write('\n'.join(['%.4f' % onset_time for onset_time in onset_times]))

# # Play the clicks
# play_clicks(onset_times, click_sound, sr)





