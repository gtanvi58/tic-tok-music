import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './FollowingArtists.scss';
import { FaHeart, FaRegHeart, FaMusic } from 'react-icons/fa';
import axios from 'axios';
import { useState } from 'react';
import DayList from './DayList';


const cx = classNames.bind(styles);

const spotifyId = '31abuz3whtktugepv7f26ouajmne'

const FollowingArtists = (props) => {

    const [followingArtists, setFollowingArtists] = useState([]);

    const getFollowingArtists = async () => {
        const response = await axios.get('http://localhost:8080/artists/friends', {
            params: { spotify_id: spotifyId }, // Pass spotifyId as a query parameter
        });
        console.log("printing response data in following ", response)
        setFollowingArtists(response.data)
    }
      useEffect(() => {
        getFollowingArtists();
    }, []);

    const handleFollowClick = (artist) => {
        console.log(`Follow clicked for: ${artist.username}`);
        // Perform follow action here
    };

    return(
        <div className={cx('following-artists')}>
        <div className={cx('following-artists-container')}>
                <div className={cx('following-artists-header')}>YOUR FRIENDS ALSO FOLLOW</div>
                {followingArtists.map((artist, index) => (
                    <div key={index} className={cx('following-artists-row')}>
                        <div className={cx('following-artists-details')}>
                            <p className={cx('following-artists-title')}>{artist.username}</p>
                        </div>
                        <div className={cx('following-artists-actions')}>
                            <button 
                                className={cx('action-button', 'follow-button')} 
                                onClick={() => handleFollowClick(artist)}
                            >
                                <FaRegHeart />
                            </button>
                            <button 
                                className={cx('action-button', 'view-music-button')} 
                                onClick={() => props.handleViewMusicClick(artist.spotify_id)}
                            >
                                <FaMusic />
                            </button>
                        </div>
                    </div>
                ))}
        </div>
    </div>
    )
}

export default FollowingArtists;