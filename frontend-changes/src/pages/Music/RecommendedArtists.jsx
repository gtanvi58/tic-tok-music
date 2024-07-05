import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './RecommendedArtists.scss';
import config from '~/config';

const cx = classNames.bind(styles);

function RecommendedArtists(){
    return(
        <div className={cx('rec-artists')}>
        <div className={cx('rec-artists-container')}>
                <div className={cx('rec-artists-header')}>RECOMMENDED ARTISTS</div>
            <div className={cx('rec-artists-row')}>
                <div className={cx('rec-artists-details')}>
                    <p className={cx('rec-artists-title')}>Please Please Please</p>
                </div>
            </div>
        </div>
    </div>
)
}

export default RecommendedArtists;