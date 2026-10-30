import React from 'react';
import { History, Trash2, X, RotateCcw, Copy, Check } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectCalculation,
  onClearHistory,
  soundEnabled
}) {
  const [copiedId, setCopiedId] = React.useState(null);

  if (!isOpen) return null;

  const handleCopy = (item, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${item.expression} = ${item.result}`);
    setCopiedId(item.id);
    playSound('click', soundEnabled);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="history-overlay" onClick={onClose}>
      <aside className="history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <div className="history-title">
            <History size={20} className="history-icon" />
            <span>Calculation History</span>
            <span className="history-badge">{history.length}</span>
          </div>
          <div className="history-actions">
            {history.length > 0 && (
              <button
                type="button"
                className="history-clear-btn"
                onClick={() => {
                  playSound('clear', soundEnabled);
                  onClearHistory();
                }}
                title="Clear all history"
              >
                <Trash2 size={16} />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              className="history-close-btn"
              onClick={() => {
                playSound('click', soundEnabled);
                onClose();
              }}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div className="history-empty">
              <div className="history-empty-icon">
                <History size={40} />
              </div>
              <p className="history-empty-title">No calculations yet</p>
              <p className="history-empty-subtitle">
                Your completed equations will automatically appear here.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="history-item"
                onClick={() => {
                  playSound('click', soundEnabled);
                  onSelectCalculation(item);
                }}
                title="Click to restore to display"
              >
                <div className="history-item-top">
                  <span className="history-time">{item.timestamp}</span>
                  <button
                    type="button"
                    className="history-copy-item-btn"
                    onClick={(e) => handleCopy(item, e)}
                    title="Copy calculation"
                  >
                    {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="history-expr">{item.expression} =</div>
                <div className="history-val">{item.result}</div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
