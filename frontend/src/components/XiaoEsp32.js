import React from 'react';
import './XiaoEsp32.css';

function XiaoEsp32() {
  const renderPads = (side) => {
    return (
      <div className={`xiao-pad-container ${side}`}>
        {[...Array(7)].map((_, i) => (
          <div key={`${side}-${i}`} className={`xiao-pad ${side}`}></div>
        ))}
      </div>
    );
  };

  return (
    <div className="xiao-board">
      <div className="xiao-usb"></div>
      <div className="xiao-usb-pins"></div>
      
      <div className="xiao-led"></div>

      {renderPads('left')}
      {renderPads('right')}

      <div className="xiao-sticker">
        <div className="xiao-sticker-brand">seeed studio</div>
        <div className="xiao-sticker-model">Model:XIAO-ESP32-C3</div>
        <div className="xiao-sticker-fc">
          <span>FC</span>
          <span>CE</span>
        </div>
        <div className="xiao-sticker-fccid">FCC:Z4T-XIAOESP32C3</div>
      </div>

      <div className="xiao-bottom-components">
        <div className="xiao-button">
          <div className="xiao-button-inner"></div>
        </div>
        <div className="xiao-antenna">
          <div className="xiao-antenna-inner"></div>
        </div>
        <div className="xiao-button">
          <div className="xiao-button-inner"></div>
        </div>
      </div>
    </div>
  );
}

export default XiaoEsp32;
