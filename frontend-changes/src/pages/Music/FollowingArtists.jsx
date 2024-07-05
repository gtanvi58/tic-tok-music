import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './FollowingArtists.scss';
import config from '~/config';

const cx = classNames.bind(styles);

function FollowingArtists(){
    return(
        <div className={cx('following-artists')}>
        <div className={cx('following-artists-container')}>
                <div className={cx('following-artists-header')}>Your Friends Also Follow</div>
            <div className={cx('following-artists-row')}>
                <div className={cx('following-artists-details')}>
                    <p className={cx('following-artists-title')}>Please Please Please</p>
                </div>
            </div>
        </div>
    </div>
    )
}

export default FollowingArtists;