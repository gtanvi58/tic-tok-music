import DbConnection from './connect.js';
import 'dotenv/config';
import { readArtistsStats } from './video.js';

// INSERT

/**
 * insert artists
 * @param {*} users array of artists
 */
export async function insertArtists(artists) {
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('artists');
        const result = await collection.insertMany(artists);
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}

// Reads

//read artist from id
export async function readArtist(id){
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('artists');
        const filter = { SpotifyId: id };
        const projection = {
            _id: 0,
            genres: 1,
            Username: 1
        };
        const cursorArray = await collection.find(filter).project(projection).toArray(); 
        return cursorArray;
    }catch(error){
        console.error('Error in MongoDB operation:', error);
    }
}

/**
 * get new artists with popularity score in a range, sorted by popularity dsc, top 5
 * @returns list of 10 new artists sorted by popularity
 */
export async function readNewArtists(n=5, lower=15, higher=30){
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('artists');
        const projection = {
            _id: 0,
            genres: 1,
            Username: 1,
            spotify_follower_count: 1,
            tiktok_follower_count: 1,
            popularity_score: 1,
            total_views_count:1,
            total_likes_count:1,
            total_share_count:1,
            total_video_count:1,
            SpotifyId:1
        };
        const cursorArray = await collection.find().project(projection).toArray();
        var artistInfo = [];

        cursorArray.map((artist)=>{
             const popularity = (((1.5*artist.total_likes_count) + artist.total_views_count + (1.8*artist.total_share_count))/artist.total_video_count) + artist.popularity_score + artist.tiktok_follower_count + artist.spotify_follower_count;
             const artistInfoObject = {
                "username": artist.Username,
                "spotify_id": artist.SpotifyId,
                "genres": artist.genres,
                "popularity": popularity
             };
             artistInfo.push(artistInfoObject);
        });

        //sort by popularity
        artistInfo.sort((a,b) => a.popularity-b.popularity);

        //find 15th and 30th percentile
        const min = Math.floor((lower/100) * artistInfo.length);
        const max = Math.ceil((higher/100) * artistInfo.length);
        
        var result_asc = artistInfo.slice(min, max);
        return result_asc.slice(-n);    
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
        return {"message": "Error while retrieving new artists.. Please contact administrator."};
    }
}

//helper function to retrieve all artist ids
async function readAllArtistsIds(){
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('artists');
        const projection = {
            SpotifyId: 1
        };
        const cursor = await collection.find().project(projection);
        var spotifyIds = [];
        await cursor.forEach(document => {
            spotifyIds.push(document.SpotifyId);
        });
        return spotifyIds;
    } catch(error){
        console.error('Error in MongoDB operation:', error);
    }

}


export async function updateArtistsStats(id) {
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('artists');
        
        const latestStats = await readArtistsStats(id);

        
        const filter = { SpotifyId: id };
        const update = {
            $set: {
                total_likes_count: latestStats[0],
                total_views_count: latestStats[1],
                total_share_count: latestStats[2],
                total_video_count: latestStats[3]
            }
        };
        const result = await collection.updateOne(filter,update);
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}


export async function updateAllArtistsStats() {
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('artists');
        const spotifyIds = await readAllArtistsIds();
        spotifyIds.forEach((spotify_id)=>{
             updateArtistsStats(spotify_id);
        })
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}

