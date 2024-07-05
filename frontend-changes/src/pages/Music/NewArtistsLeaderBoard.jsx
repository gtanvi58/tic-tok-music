import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './NewArtistsLeaderBoard.scss';
import config from '~/config';

const cx = classNames.bind(styles);

function NewArtistsLeaderBoard(){
    console.log("inside new artists")
    return(
            <div className={cx('new-artists-leaderboard')}>
            <div className={cx('new-artists-leaderboard-container')}>
                    <div className={cx('new-artists-header')}>NEW ARTISTS LEADERBOARD</div>
                <div className={cx('new-artists-row')}>
                    <div className={cx('new-artists-position')}>1</div>
                    <div className={cx('new-artists-details')}>
                        <p className={cx('new-artists-title')}>Please Please Please</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewArtistsLeaderBoard;