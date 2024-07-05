import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './Games.scss';
import config from '~/config';
import PlayList from './PlayList';
import LeaderBoard from './LeaderBoard'

const cx = classNames.bind(styles);

function Games() {
    return (
        <div>
            <div className={cx('playlist-wrapper')}>
            <PlayList/>
            </div>
            <div className={cx('leaderboard-wrapper')}>
            <LeaderBoard/>
            </div>
        </div>
    );
}

export default Games;
