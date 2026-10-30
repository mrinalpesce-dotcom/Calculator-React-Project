import React from 'react';
import {
  History,
  Volume2,
  VolumeX,
  Palette,
  Binary,
  ArrowRightLeft,
  Calculator as CalcIcon,
  HelpCircle
} from 'lucide-react';
import { playSound } from '../utils/audio';

const THEMES = [
  { id: 'theme-obsidian', name: 'Dark Obsidian', color: '#00f2fe' },
  { id: 'theme-cyberpunk', name: 'Cyberpunk Neon', color: '#ff007f' },
  { id: 'theme-frost', name: 'Titanium Frost', color: '#6366f1' },
  { id: 'theme-emerald', name: 'Emerald Matrix', color: '#10b981' },
  { id: 'theme-sunset', name: 'Sunset Glow', color: '#f59e0b' }
];

export default function Header({
  activeTab,
  setActiveTab,
  isScientific,
  setIsScientific,
  soundEnabled,
  setSoundEnabled,
  currentTheme,
  setCurrentTheme,
  onOpenHistory,
  onOpenShortcuts,
  historyCount
}) {
  const [showThemePicker, setShowThemePicker] = React.useState(false);

  return (
    <header className="calc-header">
      {/* Brand Logo & Title */}
      <div className="header-brand">
        <div className="brand-logo-wrap">
          <CalcIcon size={20} className="brand-icon" />
        </div>
        <div className="brand-text">
          <h1 className="brand-title">Mrinal Calculator</h1>
          <span className="brand-subtitle">Pro Math Studio</span>
        </div>
      </div>

      {/* Mode navigation: Calculator vs Unit Converter */}
      <div className="header-nav">
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'calc' ? 'active' : ''}`}
          onClick={() => {
            playSound('click', soundEnabled);
            setActiveTab('calc');
          }}
        >
          Calculator
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'converter' ? 'active' : ''}`}
          onClick={() => {
            playSound('click', soundEnabled);
            setActiveTab('converter');
          }}
        >
          <ArrowRightLeft size={14} />
          <span>Converter</span>
        </button>
      </div>

      {/* Control Tools */}
      <div className="header-controls">
        {/* Scientific Mode Toggle (only relevant in calc mode) */}
        {activeTab === 'calc' && (
          <button
            type="button"
            className={`tool-icon-btn ${isScientific ? 'active-tool' : ''}`}
            onClick={() => {
              playSound('click', soundEnabled);
              setIsScientific(!isScientific);
            }}
            title={isScientific ? 'Switch to Standard Mode' : 'Switch to Scientific Mode'}
          >
            <Binary size={18} />
          </button>
        )}

        {/* History Button */}
        <button
          type="button"
          className="tool-icon-btn history-trigger-btn"
          onClick={() => {
            playSound('click', soundEnabled);
            onOpenHistory();
          }}
          title="Open Calculation History"
        >
          <History size={18} />
          {historyCount > 0 && <span className="history-dot" />}
        </button>

        {/* Sound Toggle */}
        <button
          type="button"
          className={`tool-icon-btn ${soundEnabled ? 'active-tool' : ''}`}
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            if (!soundEnabled) playSound('click', true);
          }}
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound FX'}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Theme Picker Dropdown */}
        <div className="theme-picker-wrapper">
          <button
            type="button"
            className="tool-icon-btn"
            onClick={() => setShowThemePicker(!showThemePicker)}
            title="Choose Theme"
          >
            <Palette size={18} />
          </button>

          {showThemePicker && (
            <div
              className="theme-dropdown-menu"
              onClick={() => setShowThemePicker(false)}
            >
              <div className="theme-menu-title">Select Color Theme</div>
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={`theme-option ${currentTheme === theme.id ? 'selected' : ''}`}
                  onClick={() => {
                    setCurrentTheme(theme.id);
                    playSound('click', soundEnabled);
                  }}
                >
                  <span
                    className="theme-dot"
                    style={{ backgroundColor: theme.color }}
                  />
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Shortcuts / Help modal trigger */}
        <button
          type="button"
          className="tool-icon-btn"
          onClick={() => {
            playSound('click', soundEnabled);
            onOpenShortcuts();
          }}
          title="Keyboard Shortcuts"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  );
}
