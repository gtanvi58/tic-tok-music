import DbConnection from './connect.js';
import 'dotenv/config';
import { readVideoStats } from './video.js'


// INSERTS

/**
 * insert users
 * @param {*} users array of users
 */
export async function insertUsers(users) {
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('users');
        const result = await collection.insertMany(users);
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}

// UPDATES

/**
 * update liked tracks of the user
 * @param {*} id spotify id of the user
 * @param {*} tracks array of tracks user has liked
 */
export async function updateLikedTracks(id, tracks) {
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('users');
        const filter = { spotify_id: id };
        const update = {
            $addToSet: {
                liked: {
                    $each: tracks
                }
            }
        };
        const result = await collection.updateOne(filter,update);
        console.log('Matched documents:', result.matchedCount);
        console.log('Modified documents:', result.modifiedCount);        
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}

/**
 * update user's following artists
 * @param {*} id spotify id of the user
 * @param {*} artists array of artists
 */
export async function updateFollowingArtists(id, artists) {
    
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('users');
        const filter = { spotify_id: id };
        const update = {
            $addToSet: {
                following_artists: {
                    $each: artists
                }
            }
        };
        const result = await collection.updateOne(filter,update);
        console.log('Matched documents:', result.matchedCount);
        console.log('Modified documents:', result.modifiedCount);        
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}

async function calculateUserPreference(userLikedVideos){
    var likedVideoStats = [];
    var result = {
        "Acousticness" : 0,
        "Danceability": 0,
        "Energy": 0,
        "Instrumentalness": 0,
        "Liveness": 0,
        "Loudness": 0,
        "Speechiness": 0,
        "Tempo": 0,
        "Valence": 0,
        "Duration_ms": 0,
        "Popularity": 0,
        "Genres": new Set()
    };
    try{
        let promises =  userLikedVideos.map(async(video)=>{
            //retrieve artists followed by friends
            const stats = await readVideoStats(video);
            likedVideoStats.push(stats);
        });
        await Promise.all(promises);

        const features = ['Acousticness', 'Danceability', 'Energy', 'Instrumentalness', 'Liveness', 'Loudness', 'Speechiness', 'Tempo', 'Valence', 'Duration_ms'];

        for(let stat of likedVideoStats){
            for(let feature of features){
                result[feature] += stat[feature];
            }
            result['Popularity'] += ((1.5*stat.Like_Count)+(stat.View_Count)+(1.8*stat.Share_Count)+(stat.Popularity));
            result["Genres"].add(stat.Genres);
        }
        for(let feature of features){
            result[feature] /= likedVideoStats.length;
            result["Genres"] = Array.from(result["Genres"]);
        }
        return result;
    } catch(error){
        throw error;
    }

}

/**
 * calculate user's preferences from liked tracks and populate this array in database
 * @param {*} id spotify id of the user
 * following are the indices and the values they represent
    [0:acousticness
    1:danceability
    2:energy
    3:instrumentalness
    4:liveness
    5:loudness
    6:speechiness
    7:tempo
    8:valence
    9:duration_ms
    10:genres]
 */
export async function updateUserPreference(id) {
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('users');
        const userLikedVideos = (await getLikedVideos(client, id)).liked;
        const userPreference = await calculateUserPreference(userLikedVideos);
        const filter = { spotify_id: id };
        const update = {
            $set: {
                preference: userPreference
            }
        };
        const result = await collection.updateOne(filter, update);
        console.log('Matched documents:', result.matchedCount);
        console.log('Modified documents:', result.modifiedCount);        
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}


// READS

//helper for readFollowingArtists
async function getFollowingArtists(client, id){
    var userInfo;
    try{
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('users');
        const filter = { spotify_id: id };
        const projection = {
            _id: 0,
            following_artists: 1,
            username: 1,
            spotify_id: 1
        };
        const cursor = collection.find(filter).project(projection);
        await cursor.forEach(document => {
            userInfo = document;
        });
    } catch(error){
        throw error;
    }
    return userInfo;
}

/**
 * get user's following artists
 * @param {*} id spotify id of the user
 * @returns user's following artists
 */
export async function readFollowingArtists(id){
    try {
        const client = await DbConnection.Get();
        return getFollowingArtists(client,id);
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}


//helper for readFollowingFriends
async function getFollowingFriends(client, id){
    var userInfo;
    try{
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('users');
        const filter = { spotify_id: id };
        const projection = {
            _id: 0,
            following_friends: 1,
            username: 1,
            spotify_id: 1
        };
        const cursor = collection.find(filter).project(projection);
        await cursor.forEach(document => {
            userInfo = document;
        });
    } catch(error){
        throw error;
    }
    return userInfo;
}

/**
 * get user's following friends
 * @param {*} id spotify id of the user
 * @returns user's following friends
 */
export async function readFollowingFriends(id){
    try {
        const client = await DbConnection.Get();
        return getFollowingFriends(client, id);
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}

//helper for readLikedVideos
async function getLikedVideos(client, id){
    var userInfo;
    try{
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('users');
        const filter = { spotify_id: id };
        const projection = {
            _id: 0,
            liked: 1,
            username: 1,
            spotify_id: 1
        };
        const cursor = collection.find(filter).project(projection);
        await cursor.forEach(document => {
            userInfo = document;
        });
    } catch(error){
        throw error;
    }
    return userInfo;
}

/**
 * get user's liked videos
 * @param {*} id spotify id of the user
 * @returns user's liked videos
 */
export async function readLikedVideos(id){
    try {
        const client = await DbConnection.Get();
        return getLikedVideos(client, id);  
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}

//helper for readPreference
async function getPreference(client, id){
    var userInfo;
    try{
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('users');
        const filter = { spotify_id: id };
        const projection = {
            _id: 0,
            preference: 1,
            username: 1,
            spotify_id: 1
        };
        const cursor = collection.find(filter).project(projection);
        var userInfo;
        await cursor.forEach(document => {
            userInfo = document;
        });
    } catch(error){
        throw error;
    }
    return userInfo;
}

/**
 * get user's preference
 * @param {*} id spotify id of the user
 * @returns user's preference
 */
export async function readPreference(id){
    try {
        const client = await DbConnection.Get();
        return getPreference(client, id);        
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}

//helper function to get artists followed by user's friends
async function getArtistsFollwedByFriends(usersFriends, userCollection){
        var artistsFollowedByFriends = [];
        var result = [];
        if(usersFriends){
            //get following friends artists
           let promises =  usersFriends.following_friends.map(async(friend)=>{
                //retrieve artists followed by friends
                const spotifyId = friend.spotify_id;
                const filter = { spotify_id: spotifyId };
                const projection = {
                    _id: 0,
                    following_artists: 1,
                };
                let followedArtists =  await userCollection.find(filter).project(projection).toArray();
                if(followedArtists.length>0){
                    artistsFollowedByFriends.push(followedArtists);
                }
            });
            await Promise.all(promises);
            for(let artistsInfo of artistsFollowedByFriends){
                if(artistsInfo.length > 0){
                    for(let artist of artistsInfo[0].following_artists){
                           result.push(artist);
                    }
                }
            }
        } else {
            console.log("User has no friends..");
        }
        result = new Set(result);
        result = Array.from(result);
        return result;
    }

/**
 * get artists followed by friends but not by user
 * @param {*} id user's spotify id
 * @returns artists followed by friend but not by user
 */    
export async function readArtistsFollowedByFriendsButNotByUser(id){
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);

        const userCollection = database.collection("users");
        const artistCollection = database.collection("artists");
        
        //get current users friends
        const userInfo = await getFollowingFriends(client, id);
        //get artists followed by user
        const artistsFollowedByUser = await getFollowingArtists(client, id);
        //get artists followed by friends
        const artistsFollowedByFriends = await getArtistsFollwedByFriends(userInfo, userCollection);

        let artistsFollowedByUser_id = artistsFollowedByUser.following_artists.map(obj => obj.spotify_id);
        const artistsFollowedByFriendButNotByUser = artistsFollowedByFriends.filter(obj => !artistsFollowedByUser_id.includes(obj.spotify_id));

        return artistsFollowedByFriendButNotByUser;

    } catch (error) {
        console.error('Error in MongoDB operation:', error);
        return {"message":"Error while retrieving artists.. please contact administrator"};
    }
}


