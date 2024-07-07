import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './LeaderBoard.scss';
import config from '../../config';
import axios from 'axios';
import { useState } from 'react';


const cx = classNames.bind(styles);

function LeaderBoard(props) {

    // const [leaderBoardData, setLeaderBoardData] = useState([]);
    
    // const trackId = '7k9GuJYLp2AzqokyEdwEw2'
    // const access_token = 'BQABIAMIiHwkGLkyH2j2AwhuVprHdDtPweMtkofhYFso3Rgic0bbSLu2qCn8_D6lEEeUAFodvi32lqXyGW5TiVMGoJAswrdP61JoI9uoA1FmjptQZBqA8GyhRJi4TZKP8j0Cdix-t1WzgN7U0NvHjpa6HkAtJ_IdRUfY6T-bH7gwTu3yoOf41ZUcvVtldUFTG5f_nPsxhCxB2YbMMekMa6s_8ija';

    // const leaderBoardData = [
    //     { Username: 'User1', Score: 100 },
    //     { Username: 'User2', Score: 95 },
    //     { Username: 'User3', Score: 90 },
    //     { Username: 'User4', Score: 85 },
    //     { Username: 'User5', Score: 80 },
    // ];
   
    const getLeaderBoardData = async () => {
        // const songs = await axios.post('http://localhost:8001/playlists/daylist', { "username": "Tanvi", "token": access_token });
        // // console.log("printing response data in daylist", songs);

        
        // let leaderBoardContent = songs.data.map((s) => ({
        //     trackId:s.Track_ID,
        //     trackName: s.Track_Name,
        //     artistName: s.Artist_Names
        // }))

        // setLeaderBoardData(leaderBoardContent)

        // const respstatus = songs.status
        // const response = await axios.get('http://localhost:8080/games/scores', {
        //     params: { track_id: trackId }, // Pass spotifyId as a query parameter
        // });
        // console.log("printing response data ", response)
        
    }
    //   useEffect(() => {
    //     getLeaderBoardData();
    // }, []);

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
