import { readFile } from 'fs/promises';
import { updateUserPreference, insertUsers, updateFollowingArtists, readFollowingArtists, readFollowingFriends, readArtistsFollowedByFriendsButNotByUser, updateLikedTracks } from './user.js';
import { insertArtists, readNewArtists, updateArtistsStats, updateAllArtistsStats, readArtist } from './artist.js';
import { insertVideos, readArtistsStats, readVideoStats, readAllVideos, readArtistsVideos } from './video.js';
import { insertScores, updateScore, getTopScoresForTrack } from './game.js';
import express from "express";
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import helmet from "helmet";
import cors from 'cors';
import DbConnection from './connect.js';
import 'dotenv/config';



async function createCollection(collection_name) {
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = await database.createCollection(collection_name);
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}

async function insertData(collection_name, data) {
    try {
        const client = await DbConnection.Get();
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection(collection_name);
        const result = await collection.insertMany(data);
    } catch (error) {
        console.error('Error in MongoDB operation:', error);
    }
}


await createCollection('artists');
await createCollection('games');
await createCollection('users');
await createCollection('videos');

const data1 = await readFile('./data/artists.json', 'utf8');
const jsonData1 = JSON.parse(data1);
await insertData('artists', jsonData1);

const data2 = await readFile('./data/games.json', 'utf8');
const jsonData2 = JSON.parse(data2);
await insertData('games', jsonData2);

const data3 = await readFile('./data/users.json', 'utf8');
const jsonData3 = JSON.parse(data3);
await insertData('users', jsonData3);

const data4 = await readFile('./data/videos.json', 'utf8');
const jsonData4 = JSON.parse(data4);
await insertData('videos', jsonData4);

console.log("completed running init script")