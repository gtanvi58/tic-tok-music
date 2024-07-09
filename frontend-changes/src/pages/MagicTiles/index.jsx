import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MagicTiles.scss';
// import audioFile from '../../../src/play-music/output.mp3';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';

const cx = classNames.bind(styles);

const numOfTiles = 5;
var eachState = [false, false, false, false, false];
var myTiles = [];
let scaledNotes = []
let checkObj = {found: false, xcoord:0, ycoord:0};
let intervalTmp;
let geneTimeouts = [];
let isGameOver = false;
let executed = false;
const MagicTiles = () => {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [myScore, setMyScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [noteIndex, setNoteIndex] = useState(0);
    // const [isGameOver, setIsGameOver] = useState(false);
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const backgroundRef = useRef(null);
    const scoreBarRef = useRef(null);
    const gameOverRef = useRef(null);
    const { id } = useParams();
    const audio_id = id;

    console.log("printing id", audio_id)
    const pauseGame = (content) => {
        clearInterval(intervalTmp);
        geneTimeouts.forEach(clearTimeout); // Clear all scheduled timeouts
        geneTimeouts = [];
        pauseAudio();
        content.innerHTML = "GAME OVER";
    }

    const getNotes = async (audio_id) => {
        try {
            const response = await axios.get(`http://localhost:8000/notes/${audio_id}`);
            console.log("printing notes ", response.data);

            console.log("printing response ", response.data)
            setNotes(response.data);
            if (audioRef.current) {
                audioRef.current.src = require('../../../src/assets/play-music/output.mp3');
                // setIsPlaying(true);
            }
            setIsLoading(false);
        } catch (error) {
            console.log("printing error ", error);
        }
    };

    useEffect(() => {
        console.log("Here the notes is!!" +  notes);
        if(notes.length == 0){
            console.log("Here inside!");
            getNotes(audio_id);
            setIsLoading(true);
        }
    }, []);

    // const getNotesInfo = () => {
    //     if (notes.length > 0) {
    //         let prev = notes[0];
    //         for (let i = 1; i < notes.length; i++) {
    //             let diff = notes[i] - prev;
    //             scaledNotes[i - 1] = diff;
    //             prev = notes[i];
    //             console.log("printing scaled note ", scaledNotes[i - 1]);
    //         }
    //         let minValue = Math.min(...scaledNotes);
    //         let maxValue = Math.max(...scaledNotes);
    //         console.log("printing min ", minValue);
    //         for (let i = 0; i < scaledNotes.length; i++) {
    //             let normNote = (scaledNotes[i] - minValue) / (maxValue - minValue);
    //             let scaledNote = Math.round(normNote * 8);
    //             console.log("printing scaled ", scaledNote);
    //             scaledNotes[i] = scaledNote;
    //         }
    //     }
    // };

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
    
        context_score.fillText(newScore.toString(), centerX, centerY);
    };

    const paintGameOver = (context_game_over) => {

    // Clear the entire canvas
    context_game_over.clearRect(0, 0, context_game_over.canvas.width, context_game_over.canvas.height);

    // Create and apply gradient
    let game_over_gradient = context_game_over.createLinearGradient(0, 0, 0, 80);
    game_over_gradient.addColorStop(0, "rgba(74,171,254,0)");
    game_over_gradient.addColorStop(0.5, "rgba(74,84,254,0)");
    game_over_gradient.addColorStop(1, "rgba(116,74,254,0)");
    // context_game_over.fillStyle = game_over_gradient;
    context_game_over.fillStyle = "black";
    context_game_over.fillRect(0, 0, context_game_over.canvas.width, context_game_over.canvas.height);

    // Draw "Game Over" text on the right-hand side
    context_game_over.fillStyle = "red";
    context_game_over.font = "50px Arial";
    context_game_over.textAlign = 'right'; // Align text to the right
    context_game_over.textBaseline = 'middle'; // Center vertically

    // Calculate the position for "Game Over" text
    const gameOverX = context_game_over.canvas.width - 10; // 10 pixels from the right edge
    const gameOverY = context_game_over.canvas.height / 2;

    context_game_over.fillText("Game Over", gameOverX, gameOverY);
    }

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
        const newBlock = new Block(myRand, context);
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

    const checkIfBlock = (x,y) =>{
        console.log("inside check block")
        let flag = false;
        for(let i=0;i<numOfTiles;i++){
            if(myTiles[i] && myTiles[i].isClicked(x,y)){
                myTiles[i].blockClicked();
                flag=true;
                return;
            }
        }
        if(!flag){
            noBlockClicked();
        }
    }

    const noBlockClicked = () => {
        console.log("wrong click check")
                console.log("printing check stuff ", checkObj)
                pauseGame(document.getElementById("start_btn"))
                paintGameOver(gameOverRef.current.getContext('2d'))
                isGameOver = true;
    }
    const handleMouseDown = (event) => {
        console.log("mouse downn");
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        checkIfBlock(x,y)

        // let checkClicked = this.isClicked(x,y);
        // console.log("printing checkClicked ", checkClicked)
        // if(!checkClicked){
        //     console.log("wrong  hi")
        // }
        
        // if(checkObj.found == true && checkObj.xcoord != event.clientX || checkObj.ycoord != event.clientY){
        //     checkObj.found = false;
        //     checkObj.xcoord = 0;
        //     checkObj.ycoord = 0;
        // }
    //     checkIfBlock(x,y);
    //     // let checkVal = this.isClicked(x, y);
    //     // if (checkVal) {
            
    //     // } else{
    //     //     if(executed == true && checkObj.found == false ){
    //     //         console.log("wrong click check")
    //     //         console.log("printing check stuff ", checkObj)
    //     //         pauseGame(document.getElementById("start_btn"))
    //     //         paintGameOver(gameOverRef.current.getContext('2d'))
    //     //         isGameOver = true;
    //     //     }
    //     // }
    }
    class Block {
        constructor(index, context) {
            if (!eachState[index]) eachState[index] = true;
            this.index = index;
            this.appearPos = Math.floor(Math.random() * 4);
    
            this.width = 70;
            this.height = 120;
            this.color = "black";
            this.context = context; // Fixed context reference
            console.log("printing this height ", this.height);
    
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
    
            this.context.fillStyle = this.color;
            this.context.fillRect(this.x, this.y, this.width, this.height);
            this.live = true;
            // this.setupEventListeners();
        }

        // setupEventListeners() {
        //     canvasRef.current.addEventListener('click', this.handleMouseDown);
        //     // canvasRef.current.addEventListener('mouseup', this.handleMouseUp);
        // }

        // removeEventListeners() {
        //     canvasRef.current.removeEventListener('click', this.handleMouseDown);
        //     // canvasRef.current.removeEventListener('mouseup', this.handleMouseUp);
        // }
    
        handleMouseUp = (event) => { 
            // console.log('mouse up');
            // Additional logic for mouse up if needed
        }
    
        isClicked(x, y) {
            let returnval =  x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height;
            executed = true;
            console.log("executed")
            return returnval;
        }
        blockClicked(){
            console.log("drag start");
                setMyScore(prevScore => {
                    console.log("printing prev score ", prevScore)
                    const newScore = prevScore + 1;
                    paintScoreBar(scoreBarRef.current.getContext('2d'), newScore);
                    return newScore;
                });
                this.color = "white"; // Change the color when clicked
                this.context.fillStyle = this.color;
                this.context.fillRect(this.x, this.y, this.width, this.height);
                
                console.log("inside true")
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
                myTiles[i].y += 1.5;
                context.fillStyle = myTiles[i].color;
                context.fillRect(myTiles[i].x, myTiles[i].y, 70, 120);
                context.clearRect(myTiles[i].x, myTiles[i].y - 1.5, 70, 2);
            }
        }
        for (let i = 0; i < numOfTiles; ++i) {
            if (eachState[i]) {
                if (myTiles[i].y > 600) {
                    context.clearRect(myTiles[i].x, myTiles[i].y, 70, 120);
                    myTiles[i].live = false;
                    eachState[i] = false;
                    // myTiles[i].removeEventListeners();
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

    // useEffect(() => {
    //     const c = canvasRef.current;
    //     const context = c.getContext("2d");
    //     const b = backgroundRef.current;
    //     const context_back = b.getContext("2d");
    //     const a = scoreBarRef.current;
    //     const context_score = a.getContext("2d");

    //     paintWindow(context_back);
    //     paintScoreBar(context_score)
    //     getNotesInfo();

    //     let intervalTmp;
    //     let geneTmp;

    //     const handleStartPause = () => {
    //         let content = document.getElementById("start_btn");
    //         if (content.innerHTML === "START" || content.innerHTML === "GG") {
    //             if (notes.length > 0) {
    //                 intervalTmp = setInterval(() => update(context), 5);
    //                 // geneTmp = setInterval(() => geneBlock(context), 600);
    //                 for(var i=0;i<notes.length;i++){
    //                     setTimeout(geneBlock(context), notes[i]); 
    //                 }
    //             }
    //             playAudio();
    //             content.innerHTML = "PAUSE";
    //         } else {
    //             clearInterval(intervalTmp);
    //             clearInterval(geneTmp);
    //             pauseAudio();
    //             content.innerHTML = "START";
    //         }
    //     };

    //     document.getElementById('btn').addEventListener('click', handleStartPause);
    //     // c.addEventListener("click", handleCanvasClick);

    //     return () => {
    //         // c.removeEventListener("click", handleCanvasClick);
    //         document.getElementById('btn').removeEventListener('click', handleStartPause);
    //         clearInterval(intervalTmp);
    //         clearInterval(geneTmp);
    //     };
    // }, [notes, isPlaying]);

    useEffect(() => {
        const c = canvasRef.current;
        const context = c.getContext("2d");
        const b = backgroundRef.current;
        const context_back = b.getContext("2d");
        const a = scoreBarRef.current;
        const context_score = a.getContext("2d");
        const g = gameOverRef.current;
        const context_game_over = g.getContext("2d");
    
        paintWindow(context_back);
        paintScoreBar(context_score);
        // paintGameOver(context_game_over);
        // getNotesInfo();
    
    
        const handleStartPause = () => {
            let content = document.getElementById("start_btn");
            if (content.innerHTML === "START" || content.innerHTML === "GG") {
                if (notes.length > 0) {
                    intervalTmp = setInterval(() => update(context), 5);
        
                    // Clear any previous timeouts before starting new ones
                    geneTimeouts.forEach(clearTimeout);
                    geneTimeouts = [];
        
                    // Schedule geneblock calls based on the cumulative timing of notes
                    for (let i = 1; i < notes.length; i++) {
                        let interval = notes[i] - notes[i - 1];
                        geneTimeouts.push(setTimeout(() => {
                            geneBlock(context);
                        }, notes[i] * 1000)); // Convert to milliseconds
                    }
                }
                playAudio();
                content.innerHTML = "PAUSE";
            } else {

                clearInterval(intervalTmp);
                geneTimeouts.forEach(clearTimeout); // Clear all scheduled timeouts
                geneTimeouts = [];
                pauseAudio();
                content.innerHTML = "START";
            }
        };
        
        
    
        document.getElementById('btn').addEventListener('click', handleStartPause);
        canvasRef.current.addEventListener('click', handleMouseDown);
    
        return () => {
            canvasRef.current.removeEventListener('click', handleMouseDown);
            document.getElementById('btn').removeEventListener('click', handleStartPause);
            clearInterval(intervalTmp);
            geneTimeouts.forEach(clearTimeout);
        };
    }, [notes, isPlaying]);
    

    return (
        <div className={cx('magic-wrapper')}>
        <LoadingOverlay
            active={isLoading}
            spinner
            text='Loading...'
        ></LoadingOverlay>
<canvas className={cx('score_bar')} ref={scoreBarRef} id="score_bar" width="300" height="100"></canvas>
<canvas className={cx('game_over_bar')} ref={gameOverRef} id="game_over_bar" width="300" height="100"></canvas>

<canvas className={cx('background')} ref={backgroundRef} id="background" width="300" height="600"></canvas>
            <canvas className={cx('piano')} ref={canvasRef} id="piano" width="300" height="600"></canvas>
            {/* <audio ref={audioRef} src={'../../../src/play-music/output.mp3'} /> */}
            <audio ref={audioRef} src={require('../../../src/play-music/None_file2.mp3').default} />


            <div className={cx('btn')} id="btn">
                <span className={cx('start_btn')} id="start_btn">START</span>
            </div>
        </div>
    );
}

export default MagicTiles;