import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import classNames from 'classnames/bind';
import styles from './Music.scss';
import config from '~/config';

const cx = classNames.bind(styles);

const playlistData = [
    {
        title: "All of Me",
        subtitle: "ladies lunching<br>35K videos",
        image: "path/to/image1.png",
        id: 'all-of-me'
    },
    {
        title: "7 years",
        subtitle: "ladies lunching<br>40K videos",
        image: "path/to/image2.png",
        id:'7-years'
    },
    {
        title: "Bad Guy",
        subtitle: "ladies lunching<br>50K videos",
        image: "path/to/image3.png"
    }
    // Add more items as needed
];

function Music() {
    useEffect(() => {
        const playlistContainer = document.getElementById('playlistContainer');

        playlistData.forEach((item, index) => {
            const itemContainer = document.createElement('div');
            itemContainer.className = 'item-container';
            itemContainer.addEventListener('click', () => {
                console.log(`Item clicked: ${item.title}`);
                const url = `${window.location.origin}${config.routes.magicTiles(item.id)}`;
                // const url = `${window.location.origin}${config.routes.magicTilesNew(item.id)}`;
                window.open(url, '_blank', 'noopener,noreferrer');
                // window.open(`/magic-tiles/${item.id}`, '_blank', 'noopener,noreferrer');
                // <NavLink to=`/magic-tiles/${item.id}` target="_blank" rel="noopener noreferrer" />
            });

            itemContainer.innerHTML = `
                <div class="thumbnail">
                    <img src="${item.image}" alt="Thumbnail">
                </div>
                <div class="details">
                    <div class="title">${item.title}</div>
                    <div class="subtitle">${item.subtitle}</div>
                </div>
                <div class="options">
                    <div class="icon">↗️</div>
                    <div class="icon">⋮</div>
                </div>
            `;

            playlistContainer.appendChild(itemContainer);
        });
    }, []);

    return (
        <div>
            <aside className={cx('wrapper')}>
                <div className={cx('div-wrap')}>
                    <div className="playlist-container" id="playlistContainer"></div>
                </div>
            </aside>
        </div>
    );
}

export default Music;
