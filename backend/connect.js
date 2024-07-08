import { MongoClient } from 'mongodb';
import 'dotenv/config';
import { parse } from 'url';

var uri = process.env.DATABASE_URL;
const parsedUrl = parse(uri);
const [username, password] = parsedUrl.auth.split(':');
const encodedUsername = encodeURIComponent(username);
const encodedPassword = encodeURIComponent(password);
const encodedMongoUrl = `mongodb+srv://${encodedUsername}:${encodedPassword}@${parsedUrl.hostname}${parsedUrl.path}`;

const DbConnection = function () {

    var db = null;
    var instance = 0;

    async function DbConnect() {
        try {
            let _db = await MongoClient.connect(encodedMongoUrl);
            return _db
        } catch (e) {
            return e;
        }
    }

   async function Get() {
        try {
            instance++;     // this is just to count how many times our singleton is called.
            console.log(`DbConnection called ${instance} times`);

            if (db != null) {
                console.log(`db connection is already alive..`);
                return db;
            } else {
                console.log(`getting new db connection..`);
                db = await DbConnect();
                console.log('connected to mongoDB!')
                console.log("printing db object ", db)
                return db; 
            }
        } catch (e) {
            console.error("error while connecting to database..");
            return e;
        }
    }

    return {
        Get: Get
    }
};

export default DbConnection();


