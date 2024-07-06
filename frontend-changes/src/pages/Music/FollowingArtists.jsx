import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './FollowingArtists.scss';
import { FaHeart, FaMusic } from 'react-icons/fa';

const cx = classNames.bind(styles);

const followingArtists = [
    'Siddarth',
    'Rithika',
    'Tanvi',
    'Baar Baar Dine Yeh Aaye',
    'Baar Baar Din Yeh Jaaye'
];

function FollowingArtists(){

    const handleFollowClick = (artist) => {
        console.log(`Follow clicked for: ${artist}`);
        // Perform follow action here
    };

    const handleViewMusicClick = (artist) => {
        console.log(`View music clicked for: ${artist}`);
        // Perform view music action here
    };
    return(
        <div className={cx('following-artists')}>
        <div className={cx('following-artists-container')}>
                <div className={cx('following-artists-header')}>YOUR FRIENDS ALSO FOLLOW</div>
                {followingArtists.map((artist, index) => (
                    <div key={index} className={cx('following-artists-row')}>
                        <div className={cx('following-artists-details')}>
                            <p className={cx('following-artists-title')}>{artist}</p>
                        </div>
                        <div className={cx('following-artists-actions')}>
                            <button 
                                className={cx('action-button', 'follow-button')} 
                                onClick={() => handleFollowClick(artist)}
                            >
                                <FaHeart />
                            </button>
                            <button 
                                className={cx('action-button', 'view-music-button')} 
                                onClick={() => handleViewMusicClick(artist)}
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