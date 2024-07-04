import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MagicTiles.scss';
import allOfMe from './all-of-me.mp3';

const cx = classNames.bind(styles);

const numOfTiles = 4;
var eachState = [false,false,false,false,false];
var myTiles = [];
let notes = [
    0.09287981859410431, 0.5340589569160997, 0.9752380952380952, 1.4396371882086167, 1.8808163265306121, 
    2.3219954648526078, 2.7631746031746034, 3.2043537414965986, 3.645532879818594, 4.08671201814059, 
    4.551111111111111, 4.992290249433107, 5.433469387755102, 5.874648526077097, 6.315827664399093, 
    6.757006802721088, 7.22140589569161, 7.662585034013605, 8.103764172335602, 8.544943310657596, 
    8.986122448979591, 9.427301587301587, 9.868480725623582, 10.332879818594105, 10.7740589569161, 
    11.215238095238096, 11.656417233560092, 12.097596371882085, 12.538775510204081, 12.979954648526077, 
    13.421133786848072, 13.862312925170068, 14.303492063492063, 14.767891156462586, 15.209070294784581, 
    15.673469387755102, 16.114648526077097, 16.555827664399093, 16.857687074829933, 17.182766439909297, 
    17.716825396825396, 18.274104308390022, 18.76172335600907, 19.22612244897959, 19.667301587301587, 
    20.108480725623583, 20.54965986394558, 20.897959183673468, 21.24625850340136, 21.826757369614512, 
    22.291156462585032, 22.77877551020408, 23.196734693877552, 23.637913832199548, 24.102312925170068, 
    24.543492063492064, 24.98467120181406, 25.2865306122449, 25.68126984126984, 25.98312925170068, 
    26.33142857142857, 26.772607709750567, 27.213786848072562, 27.654965986394558, 28.0497052154195, 
    28.46766439909297, 28.83918367346939, 29.442902494331065, 29.860861678004536, 30.511020408163265, 
    30.998639455782314, 31.393378684807256, 32.04353741496599, 32.48471655328798, 32.78657596371882, 
    33.158095238095235, 33.599274376417235, 34.08689342403628, 34.481632653061226, 34.78349206349206, 
    35.178231292517005, 35.66585034013605, 36.03736961451247, 36.45532879818594, 36.96616780045351, 
    37.45378684807256, 37.82530612244898, 38.33614512471655, 38.684444444444445, 39.21850340136054, 
    39.65968253968254, 40.00798185941043, 40.518820861678, 41.00643990929705, 41.37795918367347, 
    42.00489795918367, 42.72471655328798, 43.21233560090703, 43.67673469387755, 44.07147392290249, 
    44.55909297052154, 44.977052154195015, 45.39501133786848, 45.859410430839006, 46.556009070294785, 
    46.99718820861678, 47.29904761904762, 47.62412698412698, 48.042086167800456, 48.48326530612245, 
    48.94766439909297, 49.43528344671202, 49.87646258503401, 50.224761904761905, 50.54984126984127, 
    50.96780045351474, 51.43219954648526, 51.7340589569161, 52.33777777777778, 52.73251700680272, 
    53.173696145124715, 53.498775510204084, 53.823854875283445, 54.33469387755102, 54.75265306122449, 
    55.193832199546485, 55.5653514739229, 56.076190476190476, 56.49414965986394, 57.0746485260771, 
    58.142766439909295, 58.63038548752834, 60.070022675736965, 60.53442176870748, 60.9059410430839, 
    61.207800453514736, 61.55609977324263, 61.85795918367347, 62.22947845804989, 62.531337868480726, 
    62.902857142857144, 63.20471655328798, 63.622675736961455, 64.01741496598639, 64.31927437641724, 
    64.7372335600907, 65.22485260770975, 65.64281179138322, 65.99111111111111, 66.339410430839, 
    66.780589569161, 67.19854875283447, 67.57006802721088, 67.89514739229026, 68.33632653061224, 
    68.63818594104309, 68.94004535147393, 69.4508843537415, 69.82240362811791, 70.24036281179139, 
    70.54222222222222, 71.00662131519275, 71.44780045351474, 71.88897959183673, 72.33015873015873, 
    72.77133786848073, 73.11963718820861, 73.44471655328798, 73.79301587301588, 74.09487528344671, 
    74.55927437641724, 75.13977324263038, 75.60417233560091, 76.06857142857143, 76.78839002267574, 
    77.15990929705215, 77.60108843537415, 78.11192743764173, 78.64598639455782, 79.1568253968254, 
    79.45868480725623, 79.87664399092971, 80.29460317460317, 80.73578231292517, 81.13052154195012, 
    81.45560090702948, 82.24507936507936, 82.66303854875284, 82.9881179138322, 83.4292970521542, 
    83.77759637188208, 84.10267573696144, 84.72961451247166, 85.14757369614513, 85.44943310657597, 
    85.79773242630385, 86.26213151927438, 86.7265306122449, 87.42312925170069, 88.09650793650793, 
    88.90920634920634, 89.37360544217687, 89.83800453514739, 90.30240362811791, 90.74358276643991, 
    91.13832199546485, 91.64916099773242, 92.0671201814059, 92.55473922902495, 92.92625850340136, 
    93.2281179138322, 93.64607709750567, 94.31945578231293, 94.71419501133786, 95.22503401360544, 
    95.64299319727892, 96.0841723356009, 96.44857142857142, 96.8265306122449, 97.2687097505669, 
    97.5734693877551, 97.89854875283447, 98.41437641723355, 98.75292517006803, 99.21523809523809, 
    99.63319727891156, 100.05115646258503, 100.54698412698413, 101.13630385487529, 101.5849433106576, 
    102.02394557823129, 102.37374149659864, 102.72190517006803, 103.29818594104308, 103.68467120181406, 
    104.2542403628118, 104.64453514739229, 105.01374149659863, 105.36684807256236, 105.8152380952381, 
    106.24185941043084, 106.56785714285715, 106.91507936507936, 107.2970068027211, 107.78054421768708, 
    108.11827664399093, 108.56517006802721, 108.89947845804988, 109.27439909297053, 109.60628117913832, 
    109.98428571428571, 110.37439909297052, 110.84666666666666, 111.18321995464852, 111.52517006802721, 
    111.88356009070295, 112.21904761904762, 112.53387755102041, 112.86666666666666, 113.29097505668934, 
    113.68573696145125, 114.05328798185941, 114.3908843537415, 114.74458049886622, 115.09444444444445, 
    115.53174603174603, 115.93274376417234, 116.26834467120182, 116.6357596371882, 117.03433106575963, 
    117.38659863945578, 117.74503401360544, 118.21873015873016, 118.5463492063492, 118.91845804988662, 
    119.26997732426303, 119.67301587301587, 120.00000000000001
];

let scaledNotes = []

function MagicTiles() {
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const backgroundRef = useRef(null);
    const scoreBarRef = useRef(null);

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
                myTiles[i].y += 2;
                console.log("printing height ", myTiles[i].height);
                context.fillRect(myTiles[i].x, myTiles[i].y, 70, myTiles[i].height * 120);
                context.fillStyle = "black";
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
    
        let animationId = null;
        let lastUpdateTime = 0;
        let lastGeneTime = 0;
        let isPaused = true; // Track the state of animation
    
        const updateLoop = (timestamp) => {
            if (!isPaused) {
                const delta = timestamp - lastUpdateTime;
    
                // Call update function every 5 milliseconds (adjust as needed)
                if (delta > 5) {
                    update(context);
                    lastUpdateTime = timestamp;
                }
    
                // Call geneBlock function every 600 milliseconds (adjust as needed)
                const geneDelta = timestamp - lastGeneTime;
                if (geneDelta > 600) {
                    geneBlock(context);
                    lastGeneTime = timestamp;
                }
            }
    
            // Continue the loop
            animationId = requestAnimationFrame(updateLoop);
        };
    
        const handleStartPause = () => {
            let content = document.getElementById('start_btn');
            if (content.innerHTML === "START" || content.innerHTML === "GG") {
                // Start animation loop
                isPaused = false;
                requestAnimationFrame(updateLoop);
    
                // Start audio playback
                playAudio();
                content.innerHTML = "PAUSE";
            } else {
                // Pause animation loop
                isPaused = true;
                cancelAnimationFrame(animationId);
    
                // Pause audio playback
                pauseAudio();
                content.innerHTML = "START";
            }
        };
    
        document.getElementById('btn').addEventListener('click', handleStartPause);
    
        // Clean up event listener and animation frame
        return () => {
            document.getElementById('btn').removeEventListener('click', handleStartPause);
            cancelAnimationFrame(animationId);
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
