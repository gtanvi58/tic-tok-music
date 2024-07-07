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
        const response = await axios.post('http://localhost:8001/artists/recommended', {username: "Tanvi" });
        console.log("printing response data ", response)
        setRecommendedArtists(response.data)
    }
      useEffect(() => {
        getRecommendedArtists();
    }, []);

    const handleFollowClick = (artist) => {
        console.log(`Follow clicked for: ${artist}`);
        // Perform follow action here
    };

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
                                onClick={() => handleFollowClick(artist)}
                            >
                                <FaHeart />
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
