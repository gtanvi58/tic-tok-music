import DbConnection from './connect.js';
import 'dotenv/config';

//Inserts
/**
 * insert scores
 * @param {*} users array of scores
 */
export async function insertScores(scores) {
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('games');
        const result = await collection.insertMany(scores);
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}


//Reads
export async function getTopScoresForTrack(trackId){
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('games');
        const track = await collection.findOne({ Track_ID: trackId }, { projection: { Scores: 1, _id: 0 } });
        if (track && track.Scores) {
            const topScores = track.Scores.sort((a, b) => b.Score - a.Score).slice(0, 5);
            return topScores;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
        return {"message": "Error while retrieving top scores.. Please contact administrator."};
    }
}


//Updates
export async function updateScore(track, user, score) {
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('games');

        const filter = { 
            Track_ID: track.Track_ID,
            'Scores.SpotifyId': user.SpotifyId 
        };
        const update = {
            $set: {
                'Scores.$.Score': score
            }
        };
        const result = await collection.updateOne(filter,update);

        if(result.matchedCount === 0){
            const addToSetDoc = {
                $addToSet: {
                    Scores: { Username: user.Username, SpotifyId: user.SpotifyId, Score: score }
                }
            };
            const trackFilter = { Track_ID: track.Track_ID };
            const upsertTrackDoc = {
                $setOnInsert: {
                    Track_ID: track.Track_ID,
                    Track_Name: track.Track_Name,
                    Artist: track.Artist
                },
                $addToSet: {
                    Scores: { Username: user.Username, SpotifyId: user.SpotifyId, Score: score }
                }
            };
            const upsertResult = await collection.updateOne(trackFilter, upsertTrackDoc, { upsert: true });

            if (upsertResult.upsertedCount > 0) {
                console.log(`Successfully inserted new track with ID ${track.Track_ID} and score for user with ID ${user.SpotifyId}`);
            } else if (upsertResult.modifiedCount > 0) {
                console.log(`Successfully added new score entry for user with ID ${user.SpotifyId}`);
            } else {
                console.log('Failed to add new score entry');
            }
        } else {
             console.log(`Successfully updated the score for user with ID ${user.SpotifyId}`);
        } 
        return {"message": "Successfully updated the score!"};       
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
        return {"message": "Error while updating the score.. Please contact administrator."};
    }
}