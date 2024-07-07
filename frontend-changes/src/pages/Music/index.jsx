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
const access_token = 'BQBd8jG_9XTRhR8eZyRThlvz_e5ZEcKiYA_jATTkbGhZzI1V6uEzjZHKCPtLl3FtLIDYc_WlG65JYFfa88FDccgXCIm2jUnzbGD238iAN3BlyPTOHoa6lVGkVjFUJ3rqch2ouZpNG4VxkSCW0QHKKDaepomGrVBbBy9V21wQ0xVy0rfRSVAoJP0-aToUETR4z7ebc_tyI89wX0DjyU51wQau1O7i';

const Music = () => {
    console.log("inside music")
    
    const [daylist, setDaylist] = useState([
    ]);
    const [isDaylistClicked, setIsDaylistClicked] = useState(true);
    const [youTubeLinks, setYouTubeLinks] = useState([
    ]);

    const getDailyList = async () => {
        const songs = await axios.post('http://localhost:8001/playlists/daylist', { "username": "Tanvi", "token": access_token });
        console.log("printing response data ", songs);
        var urls = [];
        for(let song of songs.data){
            urls.push(song.youtube_link);
        }
        setDaylist(urls);
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
            <DayList youTubeLinks={isDaylistClicked? daylist:youTubeLinks } handleFollowClick={handleFollowClick} toggleDaylist={toggleDaylist}/>
            </div>
        </div>
        
    )
}

export default Music;