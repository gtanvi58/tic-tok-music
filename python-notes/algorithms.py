

from fastapi import FastAPI



app = FastAPI(title="thic-tok Api", description="with FastAPI and ColabCode", version="1.0")

import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Replace these with your actual Spotify API credentials
CLIENT_ID = '84ff4811631e47f7b326bbc00367e34a'
CLIENT_SECRET = 'f3446efc0e78413f88f61f566a918be9'
REDIRECT_URI = 'http://localhost:8888/callback' # Ensure this matches the redirect URI set in your Spotify app

# Define the scope of the permissions your app needs
SCOPE = 'user-library-read user-top-read'

# Create the SpotifyOAuth object
sp_oauth = SpotifyOAuth(client_id=CLIENT_ID,
                        client_secret=CLIENT_SECRET,
                        redirect_uri=REDIRECT_URI,
                        scope=SCOPE)

'''# Get the authorization URL
auth_url = sp_oauth.get_authorize_url()
print("Please navigate here to authorize:", auth_url)

# After authorizing, paste the full redirect URL here
response = input("Paste the full redirect URL here: ")

# Extract the authorization code from the redirect URL
code = sp_oauth.parse_response_code(response)
print(f"Authorization code: {code}")

# Get the access token
token_info = sp_oauth.get_access_token(code, as_dict=False)
access_token = token_info

# Create the Spotify object
sp = spotipy.Spotify(auth=access_token)

print('ACCESS TOKEN!!!!!!:  ',access_token)'''

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import pandas as pd
import numpy as np
import math
import random
from googleapiclient.discovery import build
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import urllib.parse
from typing import List, Optional

# Define the FastAPI app
app = FastAPI()

# Spotify API credentials
CLIENT_ID = '84ff4811631e47f7b326bbc00367e34a'
CLIENT_SECRET = 'f3446efc0e78413f88f61f566a918be9'
REDIRECT_URI = 'http://localhost:8888/callback'
SCOPE = 'user-library-read user-top-read'

# YouTube API key
api_key = 'AIzaSyDW3RrQP-17OMNqE3W2c-OeBanvmkTVeGE'
from googleapiclient.discovery import build
youtube = build('youtube', 'v3', developerKey=api_key)

# Define genres map
genres_map = [
    ["Acoustic pop", "folk", "singer-songwriter"],
    ["Afrobeats", "latin pop", "gospel"],
    ["Soft rock", "indie garage rock", "punk"],
    ["Ambient pop", "new age piano", "study beats"],
    ["anime", "j-pop", "k-pop"],
    ["bluegrass", "country", "honky-tonk"],
    ["blues", "jazz", "soul"],
    ["bossanova", "brazil", "samba"],
    ["dance", "edm", "electronic"],
    ["deep-house", "house", "progressive-house"],
    ["disco", "funk", "groove"],
    ["drum-and-bass", "dub", "dubstep"],
    ["gospel", "holidays", "opera"],
    ["hard-rock", "heavy-metal", "metalcore"],
    ["hip-hop", "r-n-b", "rap"],
    ["indie-pop", "pop", "power-pop"],
    ["psych-rock", "punk", "rock"],
    ["reggae", "reggaeton", "ska"],
    ["show-tunes", "soundtracks", "disney"],
    ["trance", "techno", "trip-hop"]
]

# MongoDB connection URI
username = urllib.parse.quote_plus('tanvigupta')
password = urllib.parse.quote_plus('YolandaBeCool@1234')
cluster_uri = "thic-tok.w1sg5aq.mongodb.net/?retryWrites=true&w=majority&appName=thic-tok"

uri = f"mongodb+srv://{username}:{password}@{cluster_uri}"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Database and collections
db = client['thic-tok']
artist_db = db['artists']
users_db = db['users']
tracks_db = db['videos']

# Fetch and convert collections to Pandas DataFrames
artists = pd.DataFrame(list(artist_db.find()))
if '_id' in artists.columns:
    artists.drop('_id', axis=1, inplace=True)

users = pd.DataFrame(list(users_db.find()))
if '_id' in users.columns:
    users.drop('_id', axis=1, inplace=True)

tracks = pd.DataFrame(list(tracks_db.find()))
if '_id' in tracks.columns:
    tracks.drop('_id', axis=1, inplace=True)



# Function for bootstrap resampling to calculate weights
def bootstrap_resampling(series, num_samples=283):
    bootstrapped_means = np.zeros(num_samples)
    for i in range(num_samples):
        sample = series.sample(frac=1, replace=True)
        bootstrapped_means[i] = sample.mean()
    return bootstrapped_means.mean()

# Function to calculate scaled weighted mean
def calculate_scaled_weighted_mean(filtered_tracks, factors):
    weights = [bootstrap_resampling(filtered_tracks[factor]) for factor in factors]
    weights_dict = dict(zip(factors, weights))
    weighted_means = (filtered_tracks[factors].mean() * pd.Series(weights_dict)).sum()
    min_val = (filtered_tracks[factors].min() * pd.Series(weights_dict)).sum()
    max_val = (filtered_tracks[factors].max() * pd.Series(weights_dict)).sum()

    def scale_value(value, min_val, max_val):
        return (value - min_val) / (max_val - min_val)

    return scale_value(weighted_means, min_val, max_val)

def scale_value_p(value, min_val, max_val):
    return (value - min_val) / (max_val - min_val)

def calculate_user_preferences(user_data, tracks):
    pref = []

    for i in user_data['liked']:
        l = []
        track_ids_list = list(i)
        filtered_tracks = tracks[tracks['Track_ID'].isin(track_ids_list)]

        # Calculate scaled weighted means
        scaled_acousticness = calculate_scaled_weighted_mean(filtered_tracks, ['Acousticness'])
        scaled_danceability = calculate_scaled_weighted_mean(filtered_tracks, ['Danceability'])
        scaled_energy = calculate_scaled_weighted_mean(filtered_tracks, ['Energy'])
        scaled_instrumentalness = calculate_scaled_weighted_mean(filtered_tracks, ['Instrumentalness'])

        # Calculate target popularity using mean values and scale it
        mean_like_count = filtered_tracks['Like_Count'].mean()
        mean_view_count = filtered_tracks['View_Count'].mean()
        mean_share_count = filtered_tracks['Share_Count'].mean()
        mean_popularity = filtered_tracks['Popularity'].mean()

        raw_popularity = (1.5 * mean_like_count + mean_view_count + 1.8 * mean_share_count)
        adjusted_popularity = raw_popularity / (mean_popularity + 10 * mean_popularity)

        min_popularity = (1.5 * filtered_tracks['Like_Count'].min() + filtered_tracks['View_Count'].min() + 1.8 * filtered_tracks['Share_Count'].min()) / (filtered_tracks['Popularity'].min() + 10 * filtered_tracks['Popularity'].min())
        max_popularity = (1.5 * filtered_tracks['Like_Count'].max() + filtered_tracks['View_Count'].max() + 1.8 * filtered_tracks['Share_Count'].max()) / (filtered_tracks['Popularity'].max() + 10 * filtered_tracks['Popularity'].max())

        scaled_popularity = scale_value_p(adjusted_popularity, min_popularity, max_popularity) * 100

        l.extend([scaled_acousticness, scaled_danceability, scaled_energy, scaled_instrumentalness, scaled_popularity])
        pref.append(l)

    return pref

def get_similar_genres(input_genres, genres_map):
        similar_genres = set()  # Using a set to avoid duplicates
        for genre_group in genres_map:
            if any(genre in genre_group for genre in input_genres):
                similar_genres.update(genre_group)
        return list(similar_genres)

def search_youtube_song(api_key, song_name, artist):
    youtube = build('youtube', 'v3', developerKey=api_key)

    # Construct the search query
    query = f"{song_name} {artist} song"  # Adjust query for better results

    try:
        # Make API request to search
        search_response = youtube.search().list(
            q=query,
            part='id,snippet',
            maxResults=1  # You can adjust the number of results as needed
        ).execute()

        # Extract video id from response
        video_id = search_response['items'][0]['id']['videoId']

        # Generate the YouTube link
        youtube_link = f"https://www.youtube.com/watch?v={video_id}"

        return youtube_link

    except Exception as e:
        print(f"An error occurred: {e}")
        pass



def first_20_words(text):
    words = text.split()
    return ' '.join(words[:20])


class RecommendationRequest(BaseModel):
    username: str
    token: str

@app.post("/get_daylist/")
async def get_daylist(request: RecommendationRequest):
    username = request.username
    token = request.token

    # Authenticate with Spotify
    sp = spotipy.Spotify(auth=token)

    # Get user embeddings
    user_data = users[users['username'] == username]
    if user_data.empty:
        raise HTTPException(status_code=404, detail="User not found")

    # Get user preferences
    pref = calculate_user_preferences(user_data, tracks)




    # Calculate target values
    target_acousticness = math.ceil(pref[0][0] * 10) / 10
    target_danceability = math.ceil(pref[0][1] * 10) / 10
    target_energy = math.ceil(pref[0][2] * 10) / 10
    target_instrumentalness = math.ceil(pref[0][3] * 10) / 10
    target_popularity = int(pref[0][4]) / 100  # Convert popularity to 0-1 scale

    # Calculate the distance metric for each track
    tracks['distance'] = np.sqrt(
        (tracks['Acousticness'] - target_acousticness) ** 2 +
        (tracks['Danceability'] - target_danceability) ** 2 +
        (tracks['Energy'] - target_energy) ** 2 +
        (tracks['Instrumentalness'] - target_instrumentalness) ** 2 +
        (tracks['Popularity'] - target_popularity) ** 2
    )

    # Sort tracks by distance and select top 5 closest tracks
    closest_tracks = tracks.nsmallest(5, 'distance')

    # Extract the track genres
    closest_genres = list(set(closest_tracks['Genres'].tolist()))


    similar_genres = get_similar_genres(closest_genres, genres_map)

    # Combine all genres from the genres map
    all_genres = set(genre for group in genres_map for genre in group)

    # Combine closest_genres and similar_genres into one set
    excluded_genres = set(closest_genres) | set(similar_genres)

    # Filter out excluded genres from the all_genres set
    other_genres = list(all_genres - excluded_genres)

    # Randomly pick 5 genres from the remaining genres
    if len(other_genres) >= 5:
        random_genres = random.sample(other_genres, 5)
    else:
        random_genres = other_genres

    # Select 5 similar genres
    similar_genres = random.sample(similar_genres, min(5, len(similar_genres)))

    # Get Spotify recommendations
    recommendations1 = sp.recommendations(
        seed_genres=closest_genres,
        limit=3,
        target_acousticness=target_acousticness,
        target_danceability=target_danceability,
        target_energy=target_energy,
        target_instrumentalness=target_instrumentalness,
        target_popularity=70
    )

    recommendations2 = sp.recommendations(
        seed_genres=similar_genres,
        limit=4,
        target_acousticness=target_acousticness,
        target_danceability=target_danceability,
        target_energy=target_energy,
        target_instrumentalness=target_instrumentalness,
        target_popularity=70
    )

    recommendations3 = sp.recommendations(
        seed_genres=random_genres,
        limit=3,
        target_acousticness=target_acousticness,
        target_danceability=target_danceability,
        target_energy=target_energy,
        target_instrumentalness=target_instrumentalness,
        target_popularity=70
    )

    all_recommendations = recommendations1['tracks'] + recommendations2['tracks'] + recommendations3['tracks']

    # Extract track details
    track_details = []
    for track in all_recommendations:
        track_info = {
            'Track_ID': track['id'],
            'Track_Name': track['name'],
            'Artist_Names': [artist['name'] for artist in track['artists']],
            'Creator_Artist_IDs': [artist['id'] for artist in track['artists']],
            'Creation_Time': track['album']['release_date'],
            'CDN_URL': track['external_urls']['spotify'],
            'youtube_link': None,  # No direct equivalent in Spotify API
        }
        track_details.append(track_info)

    df=pd.DataFrame(track_details)
    # Add YouTube links to DataFrame

    links= []
    for index, row in df.iterrows():
        track_name = row['Track_Name']
        artist_name = row['Artist_Names'][0]  # Assuming the first artist is the main artist

        youtube_link = search_youtube_song(api_key, track_name, artist_name)
        links.append(youtube_link)

    # Add YouTube links to DataFrame

    df['youtube_link']=links

    daylist_json = df.to_dict(orient='records')

    # Return the daylist as JSON object
    return daylist_json

# Define request body model
class ArtistRequest(BaseModel):
    username: str

# Endpoint to fetch new artists based on user preferences
@app.post("/get_new_artist/")
async def get_new_artist(request: ArtistRequest):
    username = request.username

    # Fetch user data
    user_data = users[users['username'] == username]
    if user_data.empty:
        raise HTTPException(status_code=404, detail="User not found")

    # Calculate user preferences (assuming this function is defined elsewhere)
    pref = calculate_user_preferences(user_data, tracks)

    # Extract preference values
    target_acousticness = math.ceil(pref[0][0] * 10) / 10
    target_danceability = math.ceil(pref[0][1] * 10) / 10
    target_energy = math.ceil(pref[0][2] * 10) / 10
    target_instrumentalness = math.ceil(pref[0][3] * 10) / 10
    target_popularity = int(pref[0][4]) / 100  # Convert popularity to 0-1 scale

    # Calculate distance metric for each track
    tracks['distance'] = np.sqrt(
        (tracks['Acousticness'] - target_acousticness) ** 2 +
        (tracks['Danceability'] - target_danceability) ** 2 +
        (tracks['Energy'] - target_energy) ** 2 +
        (tracks['Instrumentalness'] - target_instrumentalness) ** 2 +
        (tracks['Popularity'] - target_popularity) ** 2
    )

    # Sort tracks by distance and select top 5 closest tracks
    closest_tracks = tracks.nsmallest(5, 'distance')

    # Extract track genres
    closest_genres = list(set(closest_tracks['Genres'].explode().tolist()))

    # Get similar genres from genres_map
    def get_similar_genres(closest_genres, genres_map):
        similar_genres = []
        for group in genres_map:
            if any(genre in group for genre in closest_genres):
                similar_genres.extend(group)
        return list(set(similar_genres))

    similar_genres = get_similar_genres(closest_genres, genres_map)

    # Combine all genres into one set
    all_genres = set(closest_genres + similar_genres)

    # Define popularity_new_artists lambda function
    popularity_new_artists = lambda row: (1.5 * row['total_likes_count'] + 2 * row['total_views_count'] + 1.8 * row['total_share_count']) / (3 * (row['spotify_follower_count'] + row['tiktok_follower_count']) + 3 * row['popularity_score'])

    # Apply lambda function to calculate new popularity score
    artists['Popularity_new_artists_score'] = artists.apply(popularity_new_artists, axis=1)

    # Define function to scale values between 0 and 100
    def scale_to_0_100(value):
        min_val = artists['Popularity_new_artists_score'].min()
        max_val = artists['Popularity_new_artists_score'].max()
        scaled_value = ((value - min_val) / (max_val - min_val)) * 100
        return scaled_value

    # Apply scaling function to 'Popularity_new_artists_score' column
    artists['Popularity_new_artists_score'] = artists['Popularity_new_artists_score'].apply(scale_to_0_100)

    # Filter artists dataframe based on genres and popularity score
    filtered_artists = artists[
        artists['genres'].apply(lambda genres: any(genre in all_genres for genre in genres)) &
        (artists['Popularity_new_artists_score'] > 1)
    ]

    # Sort by 'Popularity_new_artists_score' and select top 10 artists
    top_artists = filtered_artists.sort_values(by='Popularity_new_artists_score', ascending=False).head(10)

    # Convert top artists DataFrame to JSON
    top_artists_json = top_artists.to_dict(orient='records')

    return top_artists_json

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000) 

