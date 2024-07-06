import { readFile } from 'fs/promises';
import { updateUserPreference, insertUsers, updateFollowingArtists, readFollowingArtists, readFollowingFriends, readArtistsFollowedByFriendsButNotByUser, updateLikedTracks } from './user.js';
import { insertArtists, readNewArtists, updateArtistsStats, updateAllArtistsStats, readArtist } from './artist.js';
import { insertVideos, readArtistsStats, readVideoStats, readAllVideos } from './video.js';
import { insertScores, updateScore, getTopScoresForTrack } from './game.js';
import express from "express";
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import helmet from "helmet";

// Handle process termination and gracefully close the Redis client
// process.on('SIGINT', () => {
//     console.log('Shutting down server...');
//     redisClient.quit(() => {
//         console.log('Redis client closed');
//         process.exit(0);
//     });
// });


/**one time operation to create the required collections
async function init() {
    createCollections();
}
init();

const track1 = {
    "Track_ID" : "2iNqdCchlUZEgjJbQyZf8T",
    "Track_Name": "Teri Deewani",
    "Artist": "Kailash Kher"
};   

const track0 = {
    "Track_ID" : "7k9GuJYLp2AzqokyEdwEw2",
    "Track_Name": "Give Me Your Forever",
    "Artist": "Zack Tabudlo"
}

const user = {
    "SpotifyId": "7b04vuazql0yr1co3xty8v484",
    "Username": "Jackie Chan"
};

updateScore(track0, user, 16);
getTopScoresForTrack("2DHDuADAHoUW6n0z80RLQF");

console.log(await readAllVideos())

console.log(await readArtist('04TycqJU9QoZ0DRQfuDM5S'));

console.log(await readNewArtists(15,90,100));

const data = await readFile('./data/artists.json', 'utf8');
const jsonData = JSON.parse(data);
insertArtists(jsonData);

const data = ["5BlGmys9VqmHZbf7eswxG1", "4LB4jwPoxbuWUBJL5gVFsj", "2nRMW95dnOILirpjbksLTs", "1LbBOhicFmu7ktJqIHCELt", "7mpdNiaQvygj2rHoxkzMfa"];
updateLikedTracks('31ebdfyjsh5x5b3rejfp3akxdz3a', data);

// updateFollowingArtists("7b04vuazql0yr1co3xty8v474", data);
updateFollowingArtists("31ebdfyjsh5x5b3rejfp3akxdz3a", data)

var result = await readFollowingFriends("7b04vuazql0yr1co3xty8v474");
console.log(result);
result = await readFollowingFriends("7b04vuazql0yr1co3xty8v474");
console.log(result);

const data = await readNewArtists(0.15,0.50);
console.log(data);

readArtistsFollowedByFriendsButNotByUser("31ebdfyjsh5x5b3rejfp3akxdz3a");

readArtistsStats('3Isy6kedDrgPYoTS1dazA9')

updateAllArtistsStats();

readVideoStats('5BlGmys9VqmHZbf7eswxG1');

updateUserPreference("31ebdfyjsh5x5b3rejfp3akxdz3a");

// const cacheKey = `topScores:${track_id}`;
    //const cachedScores = cache.get(cacheKey);
    // if (cachedScores) {
    //     console.log('Returning cached data');
    //     res.json(cachedScores);
    // } else{

    //cache.set(cacheKey, scores);
*/

const app = express();
const port = parseInt(process.env.EXPRESS_PORT);
const cache = new NodeCache({ stdTTL: 900 });

// Global rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, 
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(apiLimiter);
app.use(helmet());
app.use(express.json());

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

/**
 * query parameter id is track id
*/
app.get("/games/scores", async (req, res) => {
    const track_id = req.query.track_id;
    const scores = await getTopScoresForTrack(track_id);
    res.json(scores);
});


// const track0 = {
//     "Track_ID" : "7k9GuJYLp2AzqokyEdwEw2",
//     "Track_Name": "Give Me Your Forever",
//     "Artist": "Zack Tabudlo"
// }

// const user = {
//     "SpotifyId": "7b04vuazql0yr1co3xty8v484",
//     "Username": "Jackie Chan"
// };
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

app.listen(port, () => {
    console.log(`Successfully started backend server on port ${port}.`);
});








