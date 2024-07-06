import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './NewArtistsLeaderBoard.scss';
import { FaHeart, FaMusic } from 'react-icons/fa';
import config from '~/config';
import axios from 'axios';
import { useState } from 'react';

const cx = classNames.bind(styles);

const NewArtistsLeaderBoard = (props) => {
    console.log("inside new artists")

    const [newArtistsLeaderBoard, setNewArtistsLeaderBoard] = useState([]);

    const getNewArtistsLeaderBoard = async () => {
        const response = await axios.get('http://localhost:8080/artists/new');
        console.log("printing response data ", response)
        setNewArtistsLeaderBoard(response.data)
    }
      useEffect(() => {
        getNewArtistsLeaderBoard();
    }, []);

    const handleFollowClick = (artist) => {
        console.log(`Follow clicked for: ${artist}`);
        // Perform follow action here
    };

    return(
            <div className={cx('new-artists-leaderboard')}>
            <div className={cx('new-artists-leaderboard-container')}>
                    <div className={cx('new-artists-header')}>NEW ARTISTS LEADERBOARD</div>
                {newArtistsLeaderBoard.map((item, index) => (
                    <div key={index} className={cx('new-artists-row')}>
                        <div className={cx('new-artists-position')}>{item.popularity}</div>
                        <div className={cx('new-artists-details')}>
                            <p className={cx('new-artists-title')}>{item.username}</p>
                        </div>
                        <div className={cx('rec-artists-actions')}>
                            <button 
                                className={cx('action-button', 'follow-button')} 
                                onClick={() => handleFollowClick(item.username)}
                            >
                                <FaHeart />
                            </button>
                            <button 
                                className={cx('action-button', 'view-music-button')} 
                                onClick={() => props.handleViewMusicClick(item)}
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

export default NewArtistsLeaderBoard;