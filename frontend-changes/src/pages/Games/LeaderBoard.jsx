import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './LeaderBoard.scss';
import config from '~/config';
import axios from 'axios';
import { useState } from 'react';

const cx = classNames.bind(styles);

function LeaderBoard() {

    const [leaderBoardData, setLeaderBoardData] = useState([]);
    
    const trackId = '7k9GuJYLp2AzqokyEdwEw2'
    const getLeaderBoardData = async () => {
        const response = await axios.get('http://localhost:8080/games/scores', {
            params: { track_id: trackId }, // Pass spotifyId as a query parameter
        });
        console.log("printing response data ", response)
        setLeaderBoardData(response.data)
    }
      useEffect(() => {
        getLeaderBoardData();
    }, []);

    return (
        <div className={cx('leaderboard')}>
            <div className={cx('chart-container')}>
                <div className={cx('header-container')}>
                    <div className={cx('chart-header')}>LEADERBOARD</div>
                    <div className={cx('score-header')}>SCORE</div>
                </div>
                {leaderBoardData.map((data, index) => (
                    <div className={cx('chart-row')}>
                    <div className={cx('chart-position')}>{index+1}</div>
                    <div className={cx('chart-details')}>
                        <p className={cx('chart-artist')}>{data.Username}</p>
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
