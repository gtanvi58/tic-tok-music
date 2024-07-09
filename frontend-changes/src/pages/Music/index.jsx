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
import LoadingOverlay from 'react-loading-overlay';

const cx = classNames.bind(styles);
const access_token = process.env.REACT_APP_SPOTIFY_ACCESS_TOKEN;
const spotify_user = process.env.REACT_APP_SPOTIFY_USERNAME;

const Music = () => {
    console.log("inside music")

    const [isLoading, setIsLoading] = useState(false);
    
    const [daylist, setDaylist] = useState([
    ]);
    const [isDaylistClicked, setIsDaylistClicked] = useState(true);
    const [youTubeLinks, setYouTubeLinks] = useState([
    ]);

    const getDailyList = async () => {
        setIsLoading(true);
        const songs = await axios.post('http://localhost:8001/playlists/daylist', { "username": spotify_user, "token": access_token });
        const urls = songs.data.map(song => song.youtube_link);
        setDaylist(urls);
        setIsLoading(false);
        //setYouTubeLinks(urls);
    }

    useEffect(() => {
        getDailyList();
    }, []);

    const handleViewMusicClick = async (spotifyId) => {
        
        const artistResponse = await axios.get('http://localhost:8080/artists/videos', {
            params: { spotify_id: spotifyId }, // Pass spotifyId as a query parameter
        });

        let ytLinks = artistResponse.data.map(data => data.youtube_link);
        console.log("printing youtube links in following ", ytLinks);
        setYouTubeLinks(ytLinks);
        setIsDaylistClicked(false);
    };

    const toggleDaylist =  () => {
        setIsDaylistClicked(true);
    };
    

    const handleFollowClick = async (artist) => {
        console.log("inside follow click")
        const resp = await axios.put('http://localhost:8080/users/followingArtists', {
            body: { spotify_id: artist.spotify_id, username:artist.username, genres:artist.genres}, // Pass spotifyId as a query parameter
        });
        console.log("sent req ", resp.status)
    }

    console.log("printing youtube links in music index", youTubeLinks)
    console.log("printing daylist links in index ", daylist)
    return(
        <div>
            <LoadingOverlay
            active={isLoading}
            spinner
            text='Loading your content...'
            styles={{
                overlay: (base) => ({
                    ...base,
                    background: 'rgba(0, 0, 0, 0.5)' // Semi-transparent dark background
                }),
                content: (base) => ({
                    ...base,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '24px', // Custom text size
                    color: 'black', // Ensure text is visible against dark background
                }),
                spinner: (base) => ({
                    ...base,
                    width: '50px', // Custom spinner size
                    height: '50px', // Custom spinner size
                    borderColor: 'black', // Ensure spinner is visible against dark background
                    borderTopColor: 'black' // Different color for spinner's border top
                }),
            }}
        >
        </LoadingOverlay>
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
            {((isDaylistClicked && daylist.length >0) || youTubeLinks.length >0) && <DayList youTubeLinks={isDaylistClicked? daylist:youTubeLinks } handleFollowClick={handleFollowClick} toggleDaylist={toggleDaylist}/>}
            </div>
        </div>
        
    )
}

export default Music;