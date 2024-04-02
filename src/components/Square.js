import React from 'react';
import '../App.css';

export default function Square({children,black}) {
    const bgClass = black ? 'black-square' : 'white-square';
    return (
        <div className={`${bgClass} board-square`}>
            {children}
        </div>
    );
}
