import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './RecommendedArtists.scss';
import { FaHeart, FaRegHeart, FaMusic } from 'react-icons/fa';
import axios from 'axios';
import { useState } from 'react';

const cx = classNames.bind(styles);

// const recommendedArtists = [
//     'Siddarth',
//     'Rithika',
//     'Tanvi',
//     'Baar Baar Dine Yeh Aaye',
//     'Baar Baar Din Yeh Jaaye'
// ];

const RecommendedArtists = (props) => {

    const [recommendedArtists, setRecommendedArtists] = useState([]);

    const getRecommendedArtists = async () => {
        // const response = await axios.post('http://localhost:8001/artists/recommended', {username: "Tanvi" });
        let recArtists = [
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
            }]
        let updatedResp = recArtists.map(artist => ({
            ...artist,
            isFollowed: false
        }));
        setRecommendedArtists(updatedResp);
    }

    const updateRecommendedArtist = (artist) => {
        console.log("Inside update recommended for artist:", artist);
        setRecommendedArtists(prevFollowingArtists => {
            let updatedArtists = prevFollowingArtists.map(data =>
                artist.SpotifyId === data.SpotifyId ? { ...data, isFollowed: !data.isFollowed } : data
            );
            console.log("Updated artists:", updatedArtists);
            return updatedArtists;
        });
        props.handleFollowClick(artist);
    }
      useEffect(() => {
        getRecommendedArtists();
    }, []);

    return (
        <div className={cx('rec-artists')}>
            <div className={cx('rec-artists-container')}>
                <div className={cx('rec-artists-header')}>RECOMMENDED ARTISTS</div>    
                {recommendedArtists.map((artist, index) => (
                    <div key={index} className={cx('rec-artists-row')}>
                        <div className={cx('rec-artists-details')}>
                            <p className={cx('rec-artists-title')}>{artist.Username}</p>
                        </div>
                        <div className={cx('rec-artists-actions')}>
                            <button 
                                className={cx('action-button', 'follow-button')} 
                                onClick={() => updateRecommendedArtist(artist)}
                            >
                                {artist.isFollowed ? <FaHeart /> : <FaRegHeart />}
                            </button>
                            <button 
                                className={cx('action-button', 'view-music-button')} 
                                onClick={() => props.handleViewMusicClick(artist.SpotifyId)}
                            >
                                <FaMusic />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecommendedArtists;
