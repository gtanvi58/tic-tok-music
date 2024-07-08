import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './NewArtistsLeaderBoard.scss';
import { FaHeart, FaRegHeart, FaMusic } from 'react-icons/fa';
import config from '../../config';
import axios from 'axios';
import { useState } from 'react';

const cx = classNames.bind(styles);

const NewArtistsLeaderBoard = (props) => {
    console.log("inside new artists")

    const [newArtistsLeaderBoard, setNewArtistsLeaderBoard] = useState([]);

    const getNewArtistsLeaderBoard = async () => {
        const response = await axios.get('http://localhost:8080/artists/new');
        let updatedResp = response.data.map(artist => ({
            ...artist,
            isFollowed: false
        }));
        console.log("printing response data ", updatedResp)
        setNewArtistsLeaderBoard(updatedResp)
    }

      useEffect(() => {
        getNewArtistsLeaderBoard();
    }, []);

    const updateNewArtistsLeaderBoard = (artist) => {
        console.log("Inside update new for artist:", artist);
        setNewArtistsLeaderBoard(prevFollowingArtists => {
            let updatedArtists = prevFollowingArtists.map(data =>
                artist.spotify_id === data.spotify_id ? { ...data, isFollowed: !data.isFollowed } : data
            );
            console.log("Updated new artists:", updatedArtists);
            return updatedArtists;
        });
        props.handleFollowClick(artist);
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
                                onClick={() => updateNewArtistsLeaderBoard(item)}
                            >
                               {item.isFollowed ? <FaHeart /> : <FaRegHeart />}
                            </button>
                            <button 
                                className={cx('action-button', 'view-music-button')} 
                                onClick={() => props.handleViewMusicClick(item.spotify_id)}
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