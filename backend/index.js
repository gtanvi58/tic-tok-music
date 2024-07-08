import { readFile } from 'fs/promises';
import { updateUserPreference, insertUsers, updateFollowingArtists, readFollowingArtists, readFollowingFriends, readArtistsFollowedByFriendsButNotByUser, updateLikedTracks } from './user.js';
import { insertArtists, readNewArtists, updateArtistsStats, updateAllArtistsStats, readArtist } from './artist.js';
import { insertVideos, readArtistsStats, readVideoStats, readAllVideos, readArtistsVideos } from './video.js';
import { insertScores, updateScore, getTopScoresForTrack } from './game.js';
import express from "express";
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import helmet from "helmet";
import cors from 'cors'


const app = express();
const port = parseInt(process.env.EXPRESS_PORT) || 8080;
const cache = new NodeCache({ stdTTL: 900 });
console.log("printing port ", port)
// Global rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, 
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(apiLimiter);
app.use(helmet());
app.use(express.json());
app.use(cors())

//videos api
app.get("/videos/all", async (req, res) => {
    const cacheKey = 'videos';
    const cachedVideos = cache.get(cacheKey);
    if (cachedVideos) {
        res.json(cachedVideos);
    } else {
        const videos = await readAllVideos();
        cache.set(cacheKey, videos);
        res.json(videos);
    }
});

//games api
app.get("/games/scores", async (req, res) => {
    const track_id = req.query.track_id;
    const scores = await getTopScoresForTrack(track_id);
    res.json(scores);
});

app.put("/games/scores",async (req, res) => {
    const track = {
        "Track_ID": req.body.Track_ID,
        "Track_Name": req.body.Track_Name,
        "Artist": req.body.Artist 
    };
    const user = {
        "SpotifyId": req.body.SpotifyId,
        "Username": req.body.Username,
    };
    const score = req.body.Score;
    const result = await updateScore(track, user, score);
    res.json(result);
});

//artists api
app.get("/artists/new", async (req, res) => {
    const cacheKey = 'newArtists';
    const cachedArtists = cache.get(cacheKey);
    if (cachedArtists) {
        res.json(cachedArtists);
    } else {
        const newArtists = await readNewArtists();
        cache.set(cacheKey, newArtists);
        res.json(newArtists);
    }
});

app.get("/artists/friends", async (req, res) => {
    console.log("received request helloooo ", req)
    const id = req.query.spotify_id;
    console.log("printing id ", id)
    const cacheKey = `friendsArtists:${id}`;
    const cachedArtists = cache.get(cacheKey);
    if (cachedArtists) {
        res.json(cachedArtists);
    } else {
        const friendsArtists = await readArtistsFollowedByFriendsButNotByUser(id);
        cache.set(cacheKey, friendsArtists);
        res.json(friendsArtists);
    }
});

app.get("/artists/videos", async (req, res) => {
    const id = req.query.spotify_id;
    const cacheKey = `artistsVideos:${id}`;
    const cachedVideos = cache.get(cacheKey);
    if (cachedVideos) {
        res.json(cachedVideos);
    } else {
        const artistsvideos = await readArtistsVideos(id);
        cache.set(cacheKey, artistsvideos);
        res.json(artistsvideos);
    }
});

//user api
app.put("/users/followingArtists", async (req, res) => {
    const user_id = req.body.user_id;
    const artist = [{
        "spotify_id": req.body.artist_id,
        "username": req.body.username,
        "genres": req.body.genres
    }];
    const result = await updateFollowingArtists(user_id, artist);
    res.json(result);    
});

app.listen(port, () => {
    console.log(`Successfully started backend server on port ${port}.`);
});








