import {Chess} from 'chess.js';
import { BehaviorSubject } from 'rxjs';
import io from 'socket.io-client';


const socket = io('https://chess-backend-c82w.onrender.com', {transports: ['websocket']}); // Connect to server


const chess = new Chess();

export const gameSubject = new BehaviorSubject();

export function initGame(){
    const savedGame = localStorage.getItem('savedGame');
    if(savedGame){
        chess.load(savedGame)
    }
    updateGame()
}

export function resetGame(){
    chess.reset();
    updateGame();
    socket.emit('reset');
}

socket.on('reset', () => {
    chess.reset();
    updateGame();
});


export function handleMove(from, to){
    const promotions = chess.moves({
        verbose: true
    }).filter(m => m.promotion)
    if(promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)){
        const pendingPromotion = {from, to, color: promotions[0].color} || null;
        updateGame(pendingPromotion)
    }
    const { pendingPromotion } = gameSubject.getValue()
    if(!pendingPromotion){
        move(from, to)
    }
}

export function move(from, to, promotion) {
    try {
        let tempMove = { from, to }
        if (promotion !== undefined) {
            tempMove.promotion = promotion
        }
        const legalMove = chess.move(tempMove);
        if (legalMove){
            socket.emit('move', legalMove); // Send move to server
            updateGame()
        } else {
            console.warn('Invalid move');
        }
    } 
    catch (error) {
        console.error('error:', error);
    }
}

socket.on('move', (legalMove) => {
    chess.move(legalMove);
    updateGame();
});

// socket.on('promotion', (data) => {
//     updateGame({ pendingPromotion: data });
// });

function updateGame(pendingPromotion) {
    const isGameOver = chess.isGameOver();
    const newGame = {
        board: chess.board(),
        pendingPromotion,
        isGameOver,
        result: isGameOver ? getGameResult() : null
    }
    localStorage.setItem('savedGame', chess.fen());
    gameSubject.next(newGame);
} 

export function PlayerTurn(){
    return chess.turn() === 'w' ? 'White' : 'Black';
}

function getGameResult(){
    if(chess.isCheckmate()){
        const winner = chess.turn() === 'w' ? 'BLACK': 'WHITE'
        return `CHECKMATE - WINNER - ${winner}`;
    }
    else if(chess.isDraw()){
        let reason = '50 - MOVES - RULE'
        if(chess.isStalemate()){
            reason = 'STALEMATE'
        }
        else if(chess.isThreefoldRepetition()){
            reason = 'REPITITION'
        }
        else if(chess.isInsufficientMaterial()){
            reason = 'INSUFFICIENT MATERIAL'
        }
        return `DRAW - REASON - ${reason}`;
    }
    else{
        return 'UNKNOWN REASON';
    }
}