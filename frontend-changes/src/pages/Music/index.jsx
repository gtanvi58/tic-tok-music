import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './Music.scss';
import config from '../../config';
import RecommendedArtists from './RecommendedArtists';
import FollowingArtists from './FollowingArtists';
import NewArtistsLeaderBoard from './NewArtistsLeaderBoard';
import DayList from './DayList'
import axios from 'axios';

const cx = classNames.bind(styles);

const Music = () => {
    console.log("inside music")
    const [youTubeLinks, setYouTubeLinks] = useState([
        'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        'https://www.youtube.com/watch?v=ysz5S6PUM-U',
        'https://www.youtube.com/watch?v=ScMzIvxBSi4'
    ]);

    const handleViewMusicClick = async (spotifyId) => {
        const artistResponse = await axios.get('http://localhost:8080/artists/videos', {
            params: { spotify_id: spotifyId }, // Pass spotifyId as a query parameter
        });

        let ytLinks = artistResponse.data.map(data => data.youtube_link);
        console.log("printing youtube links in following ", ytLinks);
        setYouTubeLinks(ytLinks);
    };

    const handleFollowClick = async (artist) => {
        console.log("inside follow click")
        const resp = await axios.put('http://localhost:8080/users/followingArtists', {
            body: { spotify_id: artist.spotify_id, username:artist.username, genres:artist.genres}, // Pass spotifyId as a query parameter
        });
        console.log("sent req ", resp.status)
    }

    return(
        <div>
            <div className={cx('recommended-wrapper')}>
            <RecommendedArtists handleViewMusicClick={handleViewMusicClick} handleFollowClick={handleFollowClick}/>
            </div>
            <div className={cx('following-wrapper')}>
            <FollowingArtists handleViewMusicClick={handleViewMusicClick} handleFollowClick={handleFollowClick}/>
            </div>
            <div className={cx('new-artist-wrapper')}>
            <NewArtistsLeaderBoard handleViewMusicClick={handleViewMusicClick} handleFollowClick={handleFollowClick}/>
            </div>
            <div className={cx('daylist')}>
            <DayList youTubeLinks={youTubeLinks} handleFollowClick={handleFollowClick}/>
            </div>
        </div>
        
    )
}

export default Music;