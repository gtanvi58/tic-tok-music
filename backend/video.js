import DbConnection from './connect.js';
import 'dotenv/config';
import { readArtist } from './artist.js';

// INSERTS

/**
 * insert videos
 * @param {*} videos array of videos
 */
export async function insertVideos(videos) {
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('videos');
        const result = await collection.insertMany(videos);     
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}

// READS

/**
 * return artist's statistics from his videos
 * @param {*} id spotify id of the artist
 * @returns array [total_likes, total_views, total_shares, total_count]
 */
export async function readArtistsStats(id){
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('videos');

        const pipeline = [
            {
                $match: {
                    "Creator_Artist_IDs": { $elemMatch: { $eq: id } }
                  }
            },
            {
                $group: {
                    _id: null, // Group by a specific field
                    total_likes: { $sum: "$Like_Count" },
                    total_views: { $sum: "$View_Count" },
                    total_shares: { $sum: "$Share_Count" },
                    total_count: { $sum: 1 }
                  }
            }
        ];

        const results = await collection.aggregate(pipeline).toArray();
        const stats = [results[0].total_likes, results[0].total_views, results[0].total_shares, results[0].total_count]
        return stats;
                
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}

/**
 * return video stats
 * @param {*} id Track_ID of the video
 * @returns array
 * [0:acousticness
    1:danceability
    2:energy
    3:instrumentalness
    4:liveness
    5:loudness
    6:speechiness
    7:tempo
    8:valence
    9:duration_ms]
 */
export async function readVideoStats(id){
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('videos');

        const filter = { Track_ID: id };
        const projection = {
            _id: 0,
            Track_ID: 1,
            Track_Name: 1,
            Acousticness: 1,
            Danceability: 1,
            Energy: 1,
            Instrumentalness: 1,
            Liveness: 1,
            Loudness: 1,
            Speechiness: 1,
            Tempo: 1,
            Valence: 1,
            Duration_ms: 1,
            Genres: 1,
            Popularity: 1,
            Like_Count: 1,
            Share_Count: 1,
            View_Count: 1,
        };
        var trackInfo;
        const cursor = await collection.find(filter).project(projection);
        await cursor.forEach(document => {
            trackInfo = document;
        });

        console.log("Track Info Retrieved!");
        return trackInfo;
                
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}

//read all tracks
export async function readAllVideos(){
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('videos');

        const projection = {
            _id: 0,
            Track_ID: 1,
            Track_Name: 1,
            Genres: 1,
            Creator_Artist_IDs:1,
            Popularity: 1,
            youtube_link: 1
        };
        var tracks = [];
        const cursor = await collection.find().project(projection);
        await cursor.forEach(document => {
            tracks.push(document);
        });

        var results = [];
        let promises =  tracks.map(async(video)=>{
            //retrieve artists followed by friends
            var artists = [];
            let inner_promises = video.Creator_Artist_IDs.map(async (artist_id) => {
                const artist = await readArtist(artist_id);
                artists.push(artist[0].Username);
            });
            await Promise.all(inner_promises);
            results.push(
                {
                    "Track_ID" : video.Track_ID,
                    "Track_Name" : video.Track_Name,
                    "Genres": video.Genres,
                    "Popularity": video.Popularity,
                    "Artists": artists,
                    "Youtube": video.youtube_link
                }
            );
        });
        await Promise.all(promises);
        console.log("Tracks Retrieved!");
        return results;
                
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}

// UPDATES