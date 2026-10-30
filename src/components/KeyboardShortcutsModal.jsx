import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { playSound } from '../utils/audio';

const SHORTCUTS = [
  { key: '0 – 9', desc: 'Enter numbers' },
  { key: '+ - * /', desc: 'Basic arithmetic operators' },
  { key: 'Enter or =', desc: 'Calculate result' },
  { key: 'Backspace', desc: 'Delete last character' },
  { key: 'Escape', desc: 'Clear all (AC)' },
  { key: '%', desc: 'Percentage' },
  { key: '( and )', desc: 'Parentheses grouping' },
  { key: '^', desc: 'Power / Exponentiation' }
];

export default function KeyboardShortcutsModal({ isOpen, onClose, soundEnabled }) {
  if (!isOpen) return null;

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <div className="history-title">
            <Keyboard size={20} className="history-icon" />
            <span>Keyboard Shortcuts</span>
          </div>
          <button
            type="button"
            className="history-close-btn"
            onClick={() => {
              playSound('click', soundEnabled);
              onClose();
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="shortcuts-list">
          {SHORTCUTS.map((item, idx) => (
            <div key={idx} className="shortcut-row">
              <span className="shortcut-key-badge">{item.key}</span>
              <span className="shortcut-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
