import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './Games.scss';
import config from '../../config';
import PlayList from './PlayList';
import LeaderBoard from './LeaderBoard'

const cx = classNames.bind(styles);

function Games() {

    const [leaderBoardItems, setLeaderBoardItems] = useState([]);
    const [currentTrackName, setCurrentTrackName] = useState('');

    const updateLeaderBoardItems = (trackName, items) =>{
        console.log("in update daylist items")
        setLeaderBoardItems(items)
        setCurrentTrackName(trackName)
    }

    return (
        <div>
             <div className={cx('banner')}>
                <h1 className={cx('fancy-title')}>The Game of Magic Tiles</h1>
            </div>
            <div className={cx('playlist-wrapper')}>
            <PlayList updateLeaderBoardItems = {updateLeaderBoardItems}/>
            </div>
            <div className={cx('leaderboard-wrapper')}>
            <LeaderBoard leaderBoardItems={leaderBoardItems} trackName={currentTrackName}/>
            </div>
        </div>
    );
}

export default Games;
