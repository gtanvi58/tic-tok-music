import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './PlayList.scss';
import config from '../../config';
import { FaTrophy, FaGamepad } from 'react-icons/fa';
import axios from 'axios';

const cx = classNames.bind(styles);

const scoreData = [
    {
        "Track_ID": "7k9GuJYLp2AzqokyEdwEw2",
        "youtube_link": "https://www.youtube.com/watch?v=NfvqVxoJIaE",
        "Track_Name": "Give Me Your Forever",
        "Artist": "Zack Tabudlo",
        "Scores": [
            {
                "Username": "Tanvi",
                "SpotifyId": "7b04vuazql0yr1co3xta12313",
                "Score": 25 
            },
            {
                "Username": "Siddarth",
                "SpotifyId": "31ebdfyjsh5x5jkahdb123sad3akxdz3a",
                "Score": 15
            },
            {
                "Username": "Rithika",
                "SpotifyId": "31abuz3whthijklyqetyepv7f26ouajmne",
                "Score": 20
            }
        ]
    },
    {
        "Track_ID": "2DHDuADAHoUW6n0z80RLQF",
        "Track_Name": "Hold On",
        "Artist": "Chord Overstreet",
        "youtube_link":"https://www.youtube.com/watch?v=wTIX8leKa9c",
        "Scores": [
            {
                "Username": "Tanvi",
                "SpotifyId": "7b04vuazql0yr1co3xta12313",
                "Score": 20
            },
            {
                "Username": "Siddarth",
                "SpotifyId": "31ebdfyjsh5x5jkahdb123sad3akxdz3a",
                "Score": 15
            },
            {
                "Username": "Rithika",
                "SpotifyId": "31abuz3whthijklyqetyepv7f26ouajmne",
                "Score": 25
            }
        ]
    }
];

const songs = [
    {
        "Track_ID": "4um6ZMnib1I7VuG3c6jGm5",
        "Track_Name": "Open The Eyes Of My Heart - Live",
        "Artist_Names": [
            "Michael W. Smith"
        ],
        "Creator_Artist_IDs": [
            "5aBxFPaaGk9204ssHUvXWN"
        ],
        "Creation_Time": "2001",
        "CDN_URL": "https://open.spotify.com/track/4um6ZMnib1I7VuG3c6jGm5",
        "youtube_link": "https://www.youtube.com/watch?v=yxq_6prPABs"
    },
    {
        "Track_ID": "1F3d4lh6ukhP4GWb1cX49U",
        "Track_Name": "Love",
        "Artist_Names": [
            "Gods Property"
        ],
        "Creator_Artist_IDs": [
            "3xtft29VZ2knyu7dEC9N7X"
        ],
        "Creation_Time": "1997",
        "CDN_URL": "https://open.spotify.com/track/1F3d4lh6ukhP4GWb1cX49U",
        "youtube_link": "https://www.youtube.com/watch?v=wazZoA4CnqA"
    },
    {
        "Track_ID": "1jwTbXQa3GJWgBCNxxuL0g",
        "Track_Name": "Holy Spirit, Come Fill This Place",
        "Artist_Names": [
            "CeCe Winans"
        ],
        "Creator_Artist_IDs": [
            "3qfrrrSO7utFdJkM2tvMRb"
        ],
        "Creation_Time": "2001-01-01",
        "CDN_URL": "https://open.spotify.com/track/1jwTbXQa3GJWgBCNxxuL0g",
        "youtube_link": "https://www.youtube.com/watch?v=LFhUUQQ7PC0"
    }
];

function PlayList(props) {
    const [playlistData, setPlaylistData] = useState([]);

    const getPlaylistData = async () => {
        // Extract fields from scoreData
        const scoreDataContent = scoreData.map((s) => ({
            trackId: s.Track_ID,
            trackName: s.Track_Name,
            artistName: s.Artist,
            youtubeLink: s.youtube_link
        }));

        // Extract fields from songs
        const songsContent = songs.map((s) => ({
            trackId: s.Track_ID,
            trackName: s.Track_Name,
            artistName: s.Artist_Names[0],
            youtubeLink: s.youtube_link
        }));

        // Combine the two arrays
        const combinedData = [...scoreDataContent, ...songsContent];

        setPlaylistData(combinedData);
    };

    const getVideoId = (url) => {
        // Example URL: https://www.youtube.com/watch?v=yxq_6prPABs
        const params = new URLSearchParams(new URL(url).search);
        return params.get('v'); // Extracts 'yxq_6prPABs'
    };

    const getTrackScores = async (trackId, trackName) => {
        console.log("printing track id and name ", trackId, trackName)
        const res = await axios.get('http://localhost:8080/games/scores', {
            params: { track_id: trackId }
        })

        props.updateLeaderBoardItems(trackName, res.data);
    }

    useEffect(() => {
        getPlaylistData();
    }, []);

    return (
        <div className={cx('playlist')}>
            <div id="playlistContainer" className={cx('playlist-container')}>
                <div className={cx('playlist-header')}>SELECT A SONG TO BEGIN!</div>
                {playlistData.map(item => {
                    const videoId = getVideoId(item.youtubeLink);
                    return (
                        <div key={item.trackId} className={cx('playlist-row')}>
                            <NavLink
                                to={config.routes.magicTiles(videoId)}
                                className={cx('playlist-link')}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className={cx('playlist-details')}>
                                    <div className={cx('details')}>
                                        <p className={cx('playlist-title')}>{item.trackName}</p>
                                        <p className={cx('playlist-artist')} dangerouslySetInnerHTML={{ __html: item.artistName }}></p>
                                    </div>
                                </div>
                            </NavLink>
                            <div className={cx('playlist-actions')}>
                                <button className={cx('action-button')} onClick={() => getTrackScores(item.trackId, item.trackName)}>
                                    <FaTrophy /> View Leaderboard
                                </button>
                                {/* <button className={cx('action-button')} onClick={() => <NavLink
                                to={config.routes.magicTiles(videoId)}
                                key={videoId}
                                target="_blank"
                                rel="noopener noreferrer"
                            ></NavLink>}> */}
                                    {/* <FaGamepad /> Play Game
                                </button> */}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PlayList;
