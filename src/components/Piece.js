import {React,useContext} from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';
import { Color } from './GameRoom';

export default function Piece({ piece: {type,color}, position }) {
    const PlayerColor = useContext(Color);
    const [{ isDragging }, drag, preview] = useDrag({
        type: 'piece',
        item: { id: `${position}_${type}_${color}`, type, color },
        canDrag: (monitor) => PlayerColor === color,
        collect : (monitor) => {
            return { isDragging: !!monitor.isDragging() }
        },
    });
    const pieceImg = require(`../assets/${type}_${color}.png`);
    return (
        <>
            <DragPreviewImage connect={preview} src = {pieceImg}/>
            <div 
                className="piece-container"
                ref={drag}
                style={{opacity: isDragging ? 0 : 1}}
            >
                <img src={pieceImg} alt="img" className="piece"></img>
            </div>
        </>
        
    )
}