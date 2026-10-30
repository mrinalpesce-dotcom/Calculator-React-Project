import React, { useRef, useEffect } from 'react';
import { Copy, Check, Delete } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function Display({
  expression,
  result,
  previewResult,
  angleMode,
  toggleAngleMode,
  isScientific,
  onBackspace,
  soundEnabled
}) {
  const [copied, setCopied] = React.useState(false);
  const displayRef = useRef(null);

  // Dynamic font sizing based on length
  const getFontSize = (text) => {
    const len = (text || '').length;
    if (len > 18) return '1.5rem';
    if (len > 14) return '1.85rem';
    if (len > 10) return '2.3rem';
    if (len > 7) return '2.8rem';
    return '3.4rem';
  };

  const handleCopy = () => {
    const textToCopy = result !== null && result !== undefined ? result : expression || '0';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    playSound('equals', soundEnabled);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="calculator-display-container">
      {/* Top status bar */}
      <div className="display-top-bar">
        <div className="display-pills">
          <button
            type="button"
            className={`pill-badge ${angleMode === 'rad' ? 'active' : ''}`}
            onClick={toggleAngleMode}
            title="Toggle Degrees / Radians"
          >
            {angleMode.toUpperCase()}
          </button>
          {isScientific && (
            <span className="pill-badge static-pill">SCI</span>
          )}
        </div>

        <div className="display-actions">
          <button
            type="button"
            className="action-icon-btn"
            onClick={handleCopy}
            title="Copy current value"
            aria-label="Copy value"
          >
            {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
          </button>
          <button
            type="button"
            className="action-icon-btn"
            onClick={onBackspace}
            title="Backspace (Delete last character)"
            aria-label="Backspace"
          >
            <Delete size={18} />
          </button>
        </div>
      </div>

      {/* Expression line */}
      <div className="display-expression" title={expression}>
        {expression || <span className="placeholder-zero">0</span>}
      </div>

      {/* Live preview or final result */}
      <div
        ref={displayRef}
        className="display-main-result"
        style={{ fontSize: getFontSize(result || previewResult || expression) }}
      >
        {result !== null ? (
          <span className="final-result animate-pop">{result}</span>
        ) : previewResult ? (
          <span className="preview-result">
            <span className="preview-equals">= </span>
            {previewResult}
          </span>
        ) : (
          <span className="current-stream">{expression || '0'}</span>
        )}
      </div>
    </div>
  );
}
