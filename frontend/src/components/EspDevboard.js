import React from 'react';
import './EspDevboard.css';

function EspDevboard() {
  const leftPins = ['3V3', 'EN', 'VP', 'VN', '34', '35', '32', '33', '25', '26', '27', '14', '12', '13', 'GND', 'VIN'];
  const rightPins = ['D23', 'D22', 'TX0', 'RX0', 'D21', 'D19', 'D18', 'D5', 'TX2', 'RX2', 'D4', 'D2', 'D15', 'GND', '3V3'];

  const paddedLeft = [...leftPins, '', '', ''];
  const paddedRight = [...rightPins, '', '', '', ''];

  const renderPins = (side, labels) => (
    <div className={`esp-pins-container ${side}`}>
      {labels.map((label, i) => (
        <div key={`${side}-${i}`} className="esp-pin-row">
          <div className="esp-pin">
            <div className="esp-pin-hole"></div>
          </div>
          <div className="esp-pin-label">{label}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="esp-board">
      <div className="esp-mounting-hole tl"></div>
      <div className="esp-mounting-hole tr"></div>
      <div className="esp-mounting-hole bl"></div>
      <div className="esp-mounting-hole br"></div>

      {renderPins('left', paddedLeft.slice(0, 19))}
      {renderPins('right', paddedRight.slice(0, 19))}

      <div className="esp-shield">
        <div className="esp-shield-logo">ESP-32</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
          <span className="esp-shield-wifi">Wi-Fi</span>
          <span style={{ fontSize: '10px', fontWeight: 'bold' }}>CE</span>
        </div>
        <div className="esp-shield-text">
          FCC ID: 2AC7Z-ESP32<br />
          R 211-161007
        </div>
        <div className="esp-qr-code"></div>
      </div>

      <div className="esp-led-label pwr">PWR</div>
      <div className="esp-led-pwr"></div>

      <div className="esp-led-label d2">D2</div>
      <div className="esp-led-d2"></div>

      <div className="esp-cp2102"></div>

      <div className="esp-button en">
        <div className="esp-button-inner"></div>
      </div>
      <div className="esp-button-label en">EN</div>

      <div className="esp-button boot">
        <div className="esp-button-inner"></div>
      </div>
      <div className="esp-button-label boot">BOOT</div>

      <div className="esp-usb">
        <div className="esp-usb-hole"></div>
      </div>
    </div>
  );
}

export default EspDevboard;
