import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MagicTiles.scss';
import allOfMe from './bad-guy.mp3';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const cx = classNames.bind(styles);

const numOfTiles = 5;
var eachState = [false, false, false, false, false];
var myTiles = [];
let scaledNotes = []

const MagicTiles = () => {
    const [notes, setNotes] = useState([]);
    const [myScore, setMyScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [noteIndex, setNoteIndex] = useState(0);
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const backgroundRef = useRef(null);
    const scoreBarRef = useRef(null);
    const { id } = useParams();
    const audio_id = id;

    const getNotes = async (audio_id) => {
        try {
            const response = await axios.get(`http://localhost:8000/notes/${audio_id}`);
            console.log("printing notes ", response.data);
            setNotes(response.data);
        } catch (error) {
            console.log("printing error ", error);
        }
    };

    useEffect(() => {
        getNotes(audio_id);
    }, [audio_id]);

    const getNotesInfo = () => {
        if (notes.length > 0) {
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
        }
    };

    // const paintScoreBar = (context_score) => {
    //     console.log("in paint score");
    //     let score_gradient = context_score.createLinearGradient(0, 0, 0, 600); // Vertical gradient
    //     score_gradient.addColorStop(0, "rgba(74,171,254,0)");
    //     score_gradient.addColorStop(0.5, "rgba(74,84,254,0)");
    //     score_gradient.addColorStop(1, "rgba(116,74,254,0)");
    //     context_score.fillStyle = score_gradient;
    
    //     // Adjust coordinates and dimensions to fit on the side
    //     const x = 230; // Adjust x-coordinate to position on the side
    //     const y = 0;   // Start from the top of the canvas
    //     const width = 70;  // Set the width of the score bar
    //     const height = 600; // Set the height of the score bar to match canvas height
    
    //     context_score.fillRect(x, y, width, height);
    // };

    const paintScoreBar = (context_score, newScore = 0) => {
        console.log("in score bar");
    
        // Clear the entire canvas
        context_score.clearRect(0, 0, context_score.canvas.width, context_score.canvas.height);
    
        // Create and apply gradient
        let score_gradient = context_score.createLinearGradient(0, 0, 0, 80);
        score_gradient.addColorStop(0, "rgba(74,171,254,0)");
        score_gradient.addColorStop(0.5, "rgba(74,84,254,0)");
        score_gradient.addColorStop(1, "rgba(116,74,254,0)");
        context_score.fillStyle = score_gradient;
        context_score.fillRect(0, 0, context_score.canvas.width, context_score.canvas.height);
    
        context_score.fillStyle = "white";
        context_score.font = "100px Arial";
        context_score.textAlign = 'center'; // Center horizontally
        context_score.textBaseline = 'middle'; // Center vertically
    
        // Calculate the center position
        const centerX = context_score.canvas.width / 2;
        const centerY = context_score.canvas.height / 2;
    
        console.log("printing my score in score bar ", newScore);
        context_score.fillText(newScore.toString(), centerX, centerY);
    };

    // const paintScoreBar = (context_score) => {
    //     context_score.clearRect(0, 0, context_score.canvas.width, context_score.canvas.height);
    //     let score_gradient = context_score.createLinearGradient(0, 0, 0, 80);
    //     score_gradient.addColorStop(0, "rgba(74,171,254,0)");
    //     score_gradient.addColorStop(0.5, "rgba(74,84,254,0)");
    //     score_gradient.addColorStop(1, "rgba(116,74,254,0)");
    //     context_score.fillStyle = score_gradient;
    //     context_score.fillRect(0, 0, 300, 70);
        
    //     context_score.fillStyle = "white";
    //     context_score.font = "24px Arial";
    //     context_score.fillText(`Score: ${myScore}`, 10, 50);
    // };
    

    const geneBlock = (context) => {
        if (noteIndex >= notes.length) return; // Ensure noteIndex is within bounds
        let myRand = Math.floor(Math.random() * numOfTiles);
        var i;
        var flag = true;
        for (i = 0; i < numOfTiles; ++i) {
            if (!eachState[i]) {
                flag = false;
            }
        }
        if (flag) return;

        while (eachState[myRand])
            myRand = Math.floor(Math.random() * numOfTiles);

        console.log("printing note and noteindex ", notes[noteIndex]);
        const newBlock = new Block(myRand, scaledNotes[noteIndex], context);
        setNoteIndex(noteIndex + 1);
        myTiles[myRand] = newBlock;
    };

    const paintWindow = (context_back) => {
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

        // context_back.fillStyle = "red";
        // context_back.font = "50px Arial";
        // context_back.fillText(myScore.toString(),100,50);
    };

    class Block {
        constructor(index, noteLength, context) {
            if (!eachState[index]) eachState[index] = true;
            this.index = index;
            this.appearPos = Math.floor(Math.random() * 4);

            this.width = 70;
            this.height = 120;
            this.color = "black";
            context = context;
            console.log("printing this height ", this.height);
            console.log("printing notes in block", noteLength);

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
                default:
                    break;
            }

            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
            this.live = true;
            canvasRef.current.addEventListener('mousedown', this.handleMouseDown.bind(this));
            canvasRef.current.addEventListener('mouseup', this.handleMouseUp.bind(this));
        }

        handleMouseDown(event, context) {
            console.log("mouse downn");
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (this.isClicked(x, y)) {
                console.log("drag start");
                setMyScore(prevScore => {
                    const newScore = prevScore + 1;
                    paintScoreBar(scoreBarRef.current.getContext('2d'), newScore);
                    return newScore;
                });
                console.log("printing my score ", myScore)
                // this.color = "white"
            //     context.fillStyle = this.color;
            // context.fillRect(this.x, this.y, this.width, this.height);
            }
        }

        handleMouseUp(event) { 
            console.log('mouse up')
            // this.color = "black"
            //     context.fillStyle = this.color;
            // context.fillRect(this.x, this.y, this.width, this.height);
        }

        isClicked(x, y) {
            console.log("printing tile x and y bounds", this.x, this.x + this.width, this.y, this.y + this.height);
            return (
                x >= this.x &&
                x <= this.x + this.width &&
                y >= this.y &&
                y <= this.y + this.height
            );
        }
    }

    const handleCanvasClick = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        for (let i = 0; i < numOfTiles; i++) {
            console.log("printing my x and y ", x, y);
            if (myTiles[i] && myTiles[i].isClicked(x, y)) {
                console.log("Tile clicked:", myTiles[i]);
                break;
            }
        }
    };

    const move = (index, context) => {
        if (myTiles[index].live) {
            myTiles[index].y += 1;
            context.fillStyle = myTiles[index].color;
            context.fillRect(myTiles[index].x, myTiles[index].y, 70, 120);
            context.clearRect(myTiles[index].x, myTiles[index].y - 1, 70, 1);
        }
    };

    const update = (context) => {
        for (let i = 0; i < numOfTiles; ++i) {
            if (eachState[i]) {
                myTiles[i].y += 1;
                context.fillStyle = myTiles[i].color;
                context.fillRect(myTiles[i].x, myTiles[i].y, 70, 120);
                context.clearRect(myTiles[i].x, myTiles[i].y - 2, 70, 2);
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
        if (audioRef.current) {
            audioRef.current.play();
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
        paintScoreBar(context_score)
        getNotesInfo();

        let intervalTmp;
        let geneTmp;

        const handleStartPause = () => {
            let content = document.getElementById("start_btn");
            if (content.innerHTML === "START" || content.innerHTML === "GG") {
                if (notes.length > 0) {
                    intervalTmp = setInterval(() => update(context), 5);
                    geneTmp = setInterval(() => geneBlock(context), 600);
                }
                playAudio();
                content.innerHTML = "PAUSE";
            } else {
                clearInterval(intervalTmp);
                clearInterval(geneTmp);
                pauseAudio();
                content.innerHTML = "START";
            }
        };

        document.getElementById('btn').addEventListener('click', handleStartPause);
        // c.addEventListener("click", handleCanvasClick);

        return () => {
            // c.removeEventListener("click", handleCanvasClick);
            document.getElementById('btn').removeEventListener('click', handleStartPause);
            clearInterval(intervalTmp);
            clearInterval(geneTmp);
        };
    }, [notes, isPlaying]);

    return (
        <div className={cx('magic-wrapper')}>
<canvas className={cx('score_bar')} ref={scoreBarRef} id="score_bar" width="300" height="100"></canvas>
<canvas className={cx('background')} ref={backgroundRef} id="background" width="300" height="600"></canvas>
            <canvas className={cx('piano')} ref={canvasRef} id="piano" width="300" height="600"></canvas>
            <audio ref={audioRef} src={allOfMe} />

            <div className={cx('btn')} id="btn">
                <span className={cx('start_btn')} id="start_btn">START</span>
            </div>
        </div>
    );
}

export default MagicTiles;
