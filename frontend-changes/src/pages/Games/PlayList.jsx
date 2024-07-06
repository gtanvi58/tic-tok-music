import React from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './PlayList.scss';
import config from '~/config';
import axios from 'axios';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function PlayList() {

    const [playlistData, setPlaylistData] = useState([]);

    // const getPlaylistData = async () => {
    //     const response = await axios.get('http://localhost:8080/artists/friends');
    //     console.log("printing response data ", response)
    //     setPlaylistData(response.data)
    // }
    //   useEffect(() => {
    //     setPlaylistData();
    // }, []);

    return (
        <div className={cx('playlist')}>
            <div id="playlistContainer" className={cx('playlist-container')}>
                <div className={cx('playlist-header')}>SELECT A SONG TO BEGIN!</div>
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
