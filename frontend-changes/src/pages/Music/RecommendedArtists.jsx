import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './RecommendedArtists.scss';
import { FaHeart, FaRegHeart, FaMusic } from 'react-icons/fa';
import axios from 'axios';
import { useState } from 'react';

const cx = classNames.bind(styles);

const RecommendedArtists = (props) => {

    const spotify_user = process.env.REACT_APP_SPOTIFY_USERNAME;

    const [recommendedArtists, setRecommendedArtists] = useState([]);

    const getRecommendedArtists = async () => {
        const response = await axios.post('http://localhost:8001/artists/recommended', {username: spotify_user });
        let updatedResp = response.data.map(artist => ({
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
