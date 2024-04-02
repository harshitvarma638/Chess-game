import {Chess} from 'chess.js';
import { BehaviorSubject } from 'rxjs';

const chess = new Chess();
// console.log(chess.board());

export const gameSubject = new BehaviorSubject({
    board: chess.board()
});

export function move(from, to) {
    try {
        const legalMove = chess.move({ from, to });
        if (legalMove) {
            gameSubject.next({ board: chess.board() });
        } else {
            console.warn('Invalid move');
        }
    } catch (error) {
        console.error('error:', error);
    }
}