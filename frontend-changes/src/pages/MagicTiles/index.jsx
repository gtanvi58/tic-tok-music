import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MagicTiles.scss';
import allOfMe from './all-of-me.mp3';
import { useParams } from 'react-router-dom';
import axios from 'axios'

const cx = classNames.bind(styles);

const numOfTiles = 5;
var eachState = [false,false,false,false,false];
var myTiles = [];

let scaledNotes = []
let notes = []

const getNotes = async (audio_id) => {
    try {
      const response = await axios.get(`http://localhost:8000/notes/${audio_id}`);
      console.log("printing notes ", response)
      notes = response

    } catch (error) {
        console.log("printing error ", error)
    }
  };

function MagicTiles() {
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const backgroundRef = useRef(null);
    const scoreBarRef = useRef(null);
    const { id } = useParams();
    const audio_id = id
    console.log("printing id ", typeof(id))

    useEffect(() => {
        getNotes(audio_id);
      }, [audio_id]);

    const [myScore, setMyScore] = useState(0);
    // const [eachState, setEachState] = useState(Array(numOfTiles).fill(false));
    // const [myTiles, setMyTiles] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);

    let intervalTmp;
    let geneTmp;
    let noteIndex = 0;
    let scaledNotes = [];

    const getNotesInfo = () => {
        let prev = notes[0];
        for (let i = 1; i < notes.length; i++) {
            let diff = notes[i] - prev;
            scaledNotes[i - 1] = diff;
            prev = notes[i];
            console.log("printing scaled note ", scaledNotes[i - 1]);
        }
        let minValue = Math.min(...scaledNotes);
        let maxValue = Math.max(...scaledNotes);
        console.log("printing min ", minValue);
        for (let i = 0; i < scaledNotes.length; i++) {
            let normNote = (scaledNotes[i] - minValue) / (maxValue - minValue);
            let scaledNote = Math.round(normNote * 8);
            console.log("printing scaled ", scaledNote);
            scaledNotes[i] = scaledNote;
        }
    };

    const paintScoreBar = (context_score) => {
        let score_gradient = context_score.createLinearGradient(0, 0, 0, 80);
        score_gradient.addColorStop(0, "rgba(74,171,254,0)");
        score_gradient.addColorStop(0.5, "rgba(74,84,254,0)");
        score_gradient.addColorStop(1, "rgba(116,74,254,0)");
        context_score.fillStyle = score_gradient;
        context_score.fillRect(0, 0, 300, 70);
    };

    const geneBlock = (context) => {
        console.log("inside gene block");
        let myRand = Math.floor(Math.random() * numOfTiles);
        var i;
        var flag = true;
        for( i = 0; i < numOfTiles; ++i){
            if(!eachState[i]){
                flag = false;
            }
        }        
        if (flag) return;

        while (eachState[myRand])
            myRand = Math.floor(Math.random() * numOfTiles);
        const newBlock = new Block(myRand, scaledNotes[noteIndex], context);
        noteIndex++;
        // setMyTiles([...myTiles, newBlock]);
        myTiles[myRand] = newBlock
    };

    const paintWindow = (context_back) => {
        // let my_gradient = context_back.createLinearGradient(0, 0, 0, 600);
        // my_gradient.addColorStop(0, "rgba(65,234,246,0.6)");
        // my_gradient.addColorStop(1, "rgba(254,74,251,0.5)");

        // context_back.fillStyle = my_gradient;
        context_back.fillStyle = "#fe2c55";
        context_back.fillRect(0, 0, 300, 600);

        context_back.beginPath();
        context_back.moveTo(72, 0);
        context_back.lineTo(72, 600);
        context_back.strokeStyle = "white";
        context_back.stroke();

        context_back.beginPath();
        context_back.moveTo(148, 0);
        context_back.lineTo(148, 600);
        context_back.strokeStyle = "white";
        context_back.stroke();

        context_back.beginPath();
        context_back.moveTo(226, 0);
        context_back.lineTo(226, 600);
        context_back.strokeStyle = "white";
        context_back.stroke();

        context_back.beginPath();
        context_back.moveTo(0, 470);
        context_back.lineTo(300, 470);
        context_back.strokeStyle = "white";
        context_back.stroke();
    };

    class Block {

        constructor(index, noteLength, context) {
            console.log("inside new block")
            if(!eachState[index])
                eachState[index] = true;
            this.index = index;
            this.appearPos = Math.floor(Math.random() * 4);

            this.width = 70;
            this.height = noteLength;
            this.color = "black";

            switch (this.appearPos) {
                case 0:
                    this.x = 0;
                    this.y = -120;
                    break;
                case 1:
                    this.x = 75;
                    this.y = -120;
                    break;
                case 2:
                    this.x = 152;
                    this.y = -120;
                    break;
                case 3:
                    this.x = 228;
                    this.y = -120;
                    break;
            }
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
            this.live = true;
        }
    }

    const move = (index, context) => {
        if (myTiles[index].live) {
            myTiles[index].y += 1;
            context.fillStyle = "black";
            context.fillRect(myTiles[index].x, myTiles[index].y, 70, 120);
            context.clearRect(myTiles[index].x, myTiles[index].y - 1, 70, 1);
        }
    };

    const afterRight = (index, context) => {
        setMyScore(myScore + 1);
        context.clearRect(myTiles[index].x, myTiles[index].y, 70, 120);
        myTiles[index].live = false;
        eachState[index] = false;
    };

    const update = (context) => {
        console.log("inside update");
        for (let i = 0; i < numOfTiles; ++i) {
            console.log("inside true")
            if (eachState[i]) {
                // myTiles[i].y += 1;
                // console.log("printing height ", myTiles[i].height);
                // context.fillRect(myTiles[i].x, myTiles[i].y, 70, myTiles[i].height * 120);
                // context.fillStyle = "black";
                myTiles[i].y += 2;
            context.fillStyle = "black";
            context.fillRect(myTiles[i].x,myTiles[i].y,70, 120);   
            context.clearRect(myTiles[i].x,myTiles[i].y-3,70,2);
            }
        }
        for (let i = 0; i < numOfTiles; ++i) {
            if (eachState[i]) {
                if (myTiles[i].y > 600) {
                    context.clearRect(myTiles[i].x, myTiles[i].y, 70, 120);
                    myTiles[i].live = false;
                    eachState[i] = false;
                }
            }
        }
    };

    const playAudio = () => {
        console.log("inside function");
        if (audioRef.current) {
            console.log("inside current");
            audioRef.current.play();
            console.log("after current");
        }
    };

    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    useEffect(() => {
        const c = canvasRef.current;
        const context = c.getContext("2d");
        const b = backgroundRef.current;
        const context_back = b.getContext("2d");
        const a = scoreBarRef.current;
        const context_score = a.getContext("2d");
    
        paintWindow(context_back);
        getNotesInfo();
    
   let intervalTmp;
    let geneTmp;

    const handleStartPause = () => {
      let content = document.getElementById('start_btn');
      if (content.innerHTML === 'START' || content.innerHTML === 'GG') {
        // Start animation loop
        intervalTmp = setInterval(() => update(context), 5);
        geneTmp = setInterval(() => geneBlock(context), 600);

        // Start audio playback
        playAudio();
        content.innerHTML = 'PAUSE';
      } else {
        // Pause animation loop
        clearInterval(intervalTmp);
        clearInterval(geneTmp);

        // Pause audio playback
        pauseAudio();
        content.innerHTML = 'START';
      }
    };
    document.getElementById('btn').addEventListener('click', handleStartPause);

        // Clean up event listener and animation frame
        return () => {
            document.getElementById('btn').removeEventListener('click', handleStartPause);
            clearInterval(intervalTmp);
            clearInterval(geneTmp);
          };
    }, [isPlaying]); // Only depend on isPlaying for starting/stopping animation

    return (
        <div className={cx('magic-wrapper')}>
            <canvas className={cx('score_bar')} ref={scoreBarRef} id="score_bar" width="300" height="70"></canvas>
            <canvas className={cx('background')} ref={backgroundRef} id="background" width="300" height="600" ></canvas>
            <canvas className={cx('piano')} ref={canvasRef} id="piano" width="300" height="600"></canvas>
            <audio ref={audioRef} src={allOfMe} />

            <div className={cx('btn')} id="btn">
                <span className={cx('start_btn')} id="start_btn">START</span>
            </div>
        </div>
    );
}

export default MagicTiles;
