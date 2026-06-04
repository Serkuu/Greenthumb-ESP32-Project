import React from 'react';
import Button from './Button';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Potwierdź', cancelText = 'Anuluj', isAlertOnly = false }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="glass-card" style={{
        padding: '32px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        <h3 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--color-ink-deep)' }}>{title}</h3>
        <p style={{ color: 'var(--color-mute)', marginBottom: '32px', fontSize: '16px', lineHeight: '1.5' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {!isAlertOnly && (
            <Button variant="secondary" onClick={onCancel} style={{ flex: 1 }}>
              {cancelText}
            </Button>
          )}
          <Button variant="danger" onClick={onConfirm} style={{ flex: 1, backgroundColor: isAlertOnly ? 'var(--color-primary)' : undefined }}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
