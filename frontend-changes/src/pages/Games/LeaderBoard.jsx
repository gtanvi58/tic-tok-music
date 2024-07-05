import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './LeaderBoard.scss';
import config from '~/config';

const cx = classNames.bind(styles);

function LeaderBoard() {
    return (
        <div className={cx('leaderboard')}>
            <div className={cx('chart-container')}>
                <div className={cx('header-container')}>
                    <div className={cx('chart-header')}>LEADERBOARD</div>
                    <div className={cx('score-header')}>SCORE</div>
                </div>
        
                <div className={cx('chart-row')}>
                    <div className={cx('chart-position')}>1</div>
                    <div className={cx('chart-image')} style={{ backgroundImage: "url('path-to-image1.jpg')" }}></div>
                    <div className={cx('chart-details')}>
                        <p className={cx('chart-title')}>Please Please Please</p>
                        <p className={cx('chart-artist')}>Sabrina Carpenter</p>
                    </div>
                    <div className={cx('chart-stats')}>
                        <div className={cx('chart-stat')}>12</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeaderBoard;
