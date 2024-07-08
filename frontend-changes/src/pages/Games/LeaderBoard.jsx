import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './LeaderBoard.scss';
import config from '../../config';
import axios from 'axios';
import { useState } from 'react';


const cx = classNames.bind(styles);

function LeaderBoard(props) {

    return (
        <div className={cx('leaderboard')}>
            <div className={cx('chart-container')}>
                <div className={cx('header-container')}>
                <div className={cx('song-header')}>Pos</div>
                <div className={cx('player-header')}>Player</div>
                    <div className={cx('score-header')}>Score</div>
                </div>
                {props.leaderBoardItems.map((data, index) => (
                    <div className={cx('chart-row')}>
                    <div className={cx('chart-position')}>{index+1}</div>
                    <div className={cx('chart-details')}>
                    <div className={cx('chart-position')}>
                        <p className={cx('chart-artist')}>{data.Username}</p>
                        </div>
                    </div>
                    <div className={cx('chart-stats')}>
                        <div className={cx('chart-stat')}>{data.Score}</div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}

export default LeaderBoard;
