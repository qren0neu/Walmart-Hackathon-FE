import React from 'react';
import '../styles/Legend.css';

const Legend = ({ data }) => {
    return (
        <div className="legend-container">
            {data.map((item, index) => (
                <div className="legend-item" key={index}>
                    <div
                        className="legend-color-box"
                        style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                </div>
            ))}
        </div>
    );
};

export default Legend;
