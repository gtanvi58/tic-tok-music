import React, {useEffect} from 'react';
import ReactPlayer from 'react-player';
import styles from './DayList.scss';
import classNames from 'classnames/bind';
import { FcMusic } from "react-icons/fc";
import config from '../../config';
import { NavLink } from "react-router-dom";

const cx = classNames.bind(styles);

const handlePlayGame = (audio_id) => {
    // Implement logic to play a game related to the video URL
    console.log(`Playing a game related to: ${audio_id}`);
    // Navigate to the specified route using react-router-dom NavLink
    // Example of navigating to magicTiles route using config
    // Replace with your actual logic based on your routes
    // <NavLink
    //     to={config.routes.magicTiles(audio_id)}
    //     key={audio_id}
    //     target="_blank"
    //     rel="noopener noreferrer"
    // ></NavLink>
};

const DayList = (props) => {

    const getVideoId = (url) => {
        // Example URL: https://www.youtube.com/watch?v=yxq_6prPABs
        const params = new URLSearchParams(new URL(url).search);
        console.log("printing param ", params.get('v'))
        return params.get('v'); // Extracts 'yxq_6prPABs'
    };

    // const {youTubeLinks} = props;
    console.log("printing youtube links ", props.youTubeLinks)
    return (
        <div>
            <div className={cx('banner')} onClick={() => props.toggleDaylist()}>
                <h1 className={cx('fancy-title')}>Your Daily Recommendations</h1>
            </div>
            <div className={cx('container')}>
                <div className={cx('daylist')}>
                    {props.youTubeLinks.length > 0 && props.youTubeLinks.map((url, index) => {
                        console.log("printing url ", url)
                        const videoId = getVideoId(url);
                        console.log("printing video id ", videoId)
                        return (
                            <div key={index} className={cx('daylist-item')}>
                            <ReactPlayer
                                url={url}
                                light={true}
                                width={'400px'}
                                height={'400px'}
                                className={cx('player')}
                            />
                            <NavLink
                                to={config.routes.magicTiles(videoId)}
                                key={videoId}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button className={cx('play-game-button')} onClick={() => handlePlayGame(videoId)}>
                                    <FcMusic className={cx('button-icon')} />
                                    <span className={cx('button-text')}>
                                        Play Magic Tiles
                                    </span>
                                </button>
                            </NavLink>
                        </div>
                        )
                    }
                    )}
                </div>
            </div>
        </div>
    );
}

export default DayList;
