import React from 'react';
import ReactPlayer from 'react-player';
import styles from './DayList.scss';
import classNames from 'classnames/bind';
import { FcMusic } from "react-icons/fc";
import config from '~/config';
import { NavLink } from "react-router-dom";

const cx = classNames.bind(styles);

const videoUrls = [
    'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    'https://www.youtube.com/watch?v=ScMzIvxBSi4'
];

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

function DayList() {
    return (
        <div>
            <div className={cx('banner')}>
                <h1 className={cx('fancy-title')}>Your Daily Recommendations</h1>
            </div>
            <div className={cx('container')}>
                <div className={cx('daylist')}>
                    {videoUrls.map((url, index) => (
                        <div key={index} className={cx('daylist-item')}>
                            <ReactPlayer
                                url={url}
                                light={true}
                                width={'400px'}
                                height={'550px'}
                                className={cx('player')}
                            />
                            <NavLink
                                to={config.routes.magicTiles('bad-guy')}
                                key={'bad-guy'}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button className={cx('play-game-button')} onClick={() => handlePlayGame('bad-guy')}>
                                    <FcMusic className={cx('button-icon')} />
                                    <span className={cx('button-text')}>
                                        Play Magic Tiles
                                    </span>
                                </button>
                            </NavLink>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DayList;
