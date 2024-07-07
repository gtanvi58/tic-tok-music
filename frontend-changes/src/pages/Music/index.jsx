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
const access_token = 'BQABIAMIiHwkGLkyH2j2AwhuVprHdDtPweMtkofhYFso3Rgic0bbSLu2qCn8_D6lEEeUAFodvi32lqXyGW5TiVMGoJAswrdP61JoI9uoA1FmjptQZBqA8GyhRJi4TZKP8j0Cdix-t1WzgN7U0NvHjpa6HkAtJ_IdRUfY6T-bH7gwTu3yoOf41ZUcvVtldUFTG5f_nPsxhCxB2YbMMekMa6s_8ija';

const Music = () => {
    console.log("inside music")
    
    const [daylist, setDaylist] = useState([
    ]);
    const [isDaylistClicked, setIsDaylistClicked] = useState(true);
    const [youTubeLinks, setYouTubeLinks] = useState([
    ]);

    const getDailyList = async () => {
        // const songs = await axios.post('http://localhost:8001/playlists/daylist', { "username": "Tanvi", "token": access_token });
        // console.log("printing response data in daylist", songs);
        // const respstatus = songs.status

        const yturls = [
            {
                "Track_ID": "4um6ZMnib1I7VuG3c6jGm5",
                "Track_Name": "Open The Eyes Of My Heart - Live",
                "Artist_Names": [
                    "Michael W. Smith"
                ],
                "Creator_Artist_IDs": [
                    "5aBxFPaaGk9204ssHUvXWN"
                ],
                "Creation_Time": "2001",
                "CDN_URL": "https://open.spotify.com/track/4um6ZMnib1I7VuG3c6jGm5",
                "youtube_link": "https://www.youtube.com/watch?v=yxq_6prPABs"
            },
            {
                "Track_ID": "1F3d4lh6ukhP4GWb1cX49U",
                "Track_Name": "Love",
                "Artist_Names": [
                    "Gods Property"
                ],
                "Creator_Artist_IDs": [
                    "3xtft29VZ2knyu7dEC9N7X"
                ],
                "Creation_Time": "1997",
                "CDN_URL": "https://open.spotify.com/track/1F3d4lh6ukhP4GWb1cX49U",
                "youtube_link": "https://www.youtube.com/watch?v=wazZoA4CnqA"
            },
            {
                "Track_ID": "1jwTbXQa3GJWgBCNxxuL0g",
                "Track_Name": "Holy Spirit, Come Fill This Place",
                "Artist_Names": [
                    "CeCe Winans"
                ],
                "Creator_Artist_IDs": [
                    "3qfrrrSO7utFdJkM2tvMRb"
                ],
                "Creation_Time": "2001-01-01",
                "CDN_URL": "https://open.spotify.com/track/1jwTbXQa3GJWgBCNxxuL0g",
                "youtube_link": "https://www.youtube.com/watch?v=LFhUUQQ7PC0"
            },
            {
                "Track_ID": "3kam2V1ZLT7dkn0R3PSm4F",
                "Track_Name": "Bizet: Carmen: Prélude",
                "Artist_Names": [
                    "Georges Bizet",
                    "Georges Prêtre"
                ],
                "Creator_Artist_IDs": [
                    "2D7RkvtKKb6E5UmbjQM1Jd",
                    "5lfbI21DXOiKTCT3Gb802r"
                ],
                "Creation_Time": "1964",
                "CDN_URL": "https://open.spotify.com/track/3kam2V1ZLT7dkn0R3PSm4F",
                "youtube_link": "https://www.youtube.com/watch?v=1d4-nDVCN6U"
            },
            {
                "Track_ID": "7BFYBSroOTNTkFFDuJ6BmV",
                "Track_Name": "Canto Della Terra",
                "Artist_Names": [
                    "Andrea Bocelli"
                ],
                "Creator_Artist_IDs": [
                    "3EA9hVIzKfFiQI0Kikz2wo"
                ],
                "Creation_Time": "2007-01-01",
                "CDN_URL": "https://open.spotify.com/track/7BFYBSroOTNTkFFDuJ6BmV",
                "youtube_link": "https://www.youtube.com/watch?v=4KGmLLsdWCM"
            },
            {
                "Track_ID": "6umBxaxgV2q52o3Q8wH2Ma",
                "Track_Name": "I Dreamed a Dream",
                "Artist_Names": [
                    "Susan Boyle"
                ],
                "Creator_Artist_IDs": [
                    "1qAuetfG6mhtDgsVIffWQc"
                ],
                "Creation_Time": "2009-11-20",
                "CDN_URL": "https://open.spotify.com/track/6umBxaxgV2q52o3Q8wH2Ma",
                "youtube_link": "https://www.youtube.com/watch?v=TL0dfzK3Aqs"
            },
            {
                "Track_ID": "5hslUAKq9I9CG2bAulFkHN",
                "Track_Name": "It's the Most Wonderful Time of the Year",
                "Artist_Names": [
                    "Andy Williams"
                ],
                "Creator_Artist_IDs": [
                    "4sj6D0zlMOl25nprDJBiU9"
                ],
                "Creation_Time": "1963-11-24",
                "CDN_URL": "https://open.spotify.com/track/5hslUAKq9I9CG2bAulFkHN",
                "youtube_link": "https://www.youtube.com/watch?v=AN_R4pR1hck"
            }];

        const urls = yturls.map(song => song.youtube_link);
        
        setDaylist(urls);
        console.log("printing urls ", urls)
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