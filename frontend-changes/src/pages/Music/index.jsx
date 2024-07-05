import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './Music.scss';
import config from '~/config';
import RecommendedArtists from './RecommendedArtists';
import FollowingArtists from './FollowingArtists';
import NewArtistsLeaderBoard from './NewArtistsLeaderBoard';
import DayList from './DayList'

const cx = classNames.bind(styles);

function Music(){
    console.log("inside music")
    return(
        <div>
            <div className={cx('recommended-wrapper')}>
            <RecommendedArtists/>
            </div>
            <div className={cx('following-wrapper')}>
            <FollowingArtists/>
            </div>
            <div className={cx('new-artist-wrapper')}>
            <NewArtistsLeaderBoard/>
            </div>
            <div className={cx('daylist')}>
            <DayList/>
            </div>
        </div>
        
    )
}

export default Music;