import React from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './PlayList.scss';
import config from '~/config';

const cx = classNames.bind(styles);

const playlistData = [
    {
        title: "All of Me",
        subtitle: "ladies lunching<br>35K videos",
        id: 'all-of-me'
    },
    {
        title: "7 years",
        subtitle: "ladies lunching<br>40K videos",
        id:'7-years'
    },
    {
        title: "Bad Guy",
        subtitle: "ladies lunching<br>50K videos",
        id: 'bad-guy'
    }
    // Add more items as needed
];

function PlayList() {
    return (
        <div>
            <div className={cx('playlist-header')}>SELECT A SONG TO PLAY!</div>
            <div id="playlistContainer">
                {playlistData.map(item => (
                    <NavLink
                        to={config.routes.magicTiles(item.id)}
                        key={item.id}
                        className={cx('playlist-row')}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className={cx('playlist-details')}>
                            <div className={cx('details')}>
                                <p className={cx('playlist-title')}>{item.title}</p>
                                <p className={cx('playlist-artist')} dangerouslySetInnerHTML={{ __html: item.subtitle }}></p>
                            </div>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

export default PlayList;
