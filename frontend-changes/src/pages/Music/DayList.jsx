// import React from 'react'
// import ReactPlayer from 'react-player'
// import styles from './RecommendedArtists.scss';
// import classNames from 'classnames/bind';

// const cx = classNames.bind(styles);
// // Render a YouTube video player

// function DayList(){
//     return(
//         <div className={cx('daylist')}>
//             <ReactPlayer url='https://www.youtube.com/watch?v=LXb3EKWsInQ' light={true} width={'200px'} height={'300px'}/>
//         </div>
//     )
//     // return(
//     //     <div className={cx('react-player')}>
//     //     <title>hellooo</title>
//     //      <ReactPlayer url='https://www.youtube.com/watch?v=LXb3EKWsInQ' light={true} width={'200px'} height={'300px'}/>
//     // </div>
//     // )
   
// }

// export default DayList;


import React from 'react';
import ReactPlayer from 'react-player';
import styles from './DayList.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const videoUrls = [
    'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    'https://www.youtube.com/watch?v=ScMzIvxBSi4'
];

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
                                height={'600px'}
                                className={cx('player')}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DayList;


