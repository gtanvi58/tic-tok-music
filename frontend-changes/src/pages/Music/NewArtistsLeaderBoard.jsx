import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './NewArtistsLeaderBoard.scss';
import { FaHeart, FaMusic } from 'react-icons/fa';
import config from '~/config';

const cx = classNames.bind(styles);

const leaderboardArtists = [
    { artist: 'Siddarth', position: 1 },
    { artist: 'Rithika', position: 2 },
    { artist: 'Tanvi', position: 3 },
    { artist: 'Baar Baar Dine Yeh Aaye', position: 4 },
    { artist: 'Baar Baar Din Yeh Jaaye', position: 5 }
];

function NewArtistsLeaderBoard(){
    console.log("inside new artists")

    const handleFollowClick = (artist) => {
        console.log(`Follow clicked for: ${artist}`);
        // Perform follow action here
    };

    const handleViewMusicClick = (artist) => {
        console.log(`View music clicked for: ${artist}`);
        // Perform view music action here
    };

    return(
            <div className={cx('new-artists-leaderboard')}>
            <div className={cx('new-artists-leaderboard-container')}>
                    <div className={cx('new-artists-header')}>NEW ARTISTS LEADERBOARD</div>
                {leaderboardArtists.map((item, index) => (
                    <div key={index} className={cx('new-artists-row')}>
                        <div className={cx('new-artists-position')}>{item.position}</div>
                        <div className={cx('new-artists-details')}>
                            <p className={cx('new-artists-title')}>{item.artist}</p>
                        </div>
                        <div className={cx('rec-artists-actions')}>
                            <button 
                                className={cx('action-button', 'follow-button')} 
                                onClick={() => handleFollowClick(item.artist)}
                            >
                                <FaHeart />
                            </button>
                            <button 
                                className={cx('action-button', 'view-music-button')} 
                                onClick={() => handleViewMusicClick(item.artist)}
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