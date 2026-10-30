import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import Display from './components/Display';
import Keypad from './components/Keypad';
import HistoryDrawer from './components/HistoryDrawer';
import UnitConverter from './components/UnitConverter';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import { evaluateExpression } from './utils/mathEvaluator';
import { playSound } from './utils/audio';

export default function App() {
  // Application State
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [previewResult, setPreviewResult] = useState('');
  const [angleMode, setAngleMode] = useState('deg');
  const [isScientific, setIsScientific] = useState(false);
  const [activeTab, setActiveTab] = useState('calc');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Persistent settings
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('neocalc_sound') !== 'false';
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('neocalc_theme') || 'theme-obsidian';
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('neocalc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync settings with localStorage
  useEffect(() => {
    localStorage.setItem('neocalc_sound', soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('neocalc_theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('neocalc_history', JSON.stringify(history));
  }, [history]);

  // Real-time evaluation preview while typing
  useEffect(() => {
    if (!expression || expression.trim() === '') {
      setPreviewResult('');
      return;
    }
    // Only calculate preview if expression has operators
    if (/[\+\−\×\÷\^%√\(\)!]/.test(expression)) {
      const evalData = evaluateExpression(expression, angleMode);
      if (!evalData.error && evalData.formatted !== null) {
        setPreviewResult(evalData.formatted);
      } else {
        setPreviewResult('');
      }
    } else {
      setPreviewResult('');
    }
  }, [expression, angleMode]);

  // Trigger celebratory confetti on special results
  const triggerConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00f2fe', '#4facfe', '#7f00ff', '#e100ff', '#10b981']
    });
  };

  // Add token to expression
  const handleInput = useCallback((token) => {
    const isOperator = ['+', '−', '×', '÷', '^', '%'].includes(token);

    if (isOperator) {
      playSound('operator', soundEnabled);
    } else {
      playSound('click', soundEnabled);
    }

    setExpression((prev) => {
      // If we just evaluated a result
      if (result !== null) {
        setResult(null);
        if (isOperator) {
          // Continue expression from previous result
          return `${result.replace(/,/g, '')}${token}`;
        } else {
          // Start fresh
          return token === '.' ? '0.' : token;
        }
      }

      // If empty and inputting operator
      if (!prev || prev === '') {
        if (isOperator && token !== '−') return '';
        if (token === '.') return '0.';
        return token;
      }

      const lastChar = prev.slice(-1);

      // Prevent duplicate consecutive operators
      if (['+', '−', '×', '÷', '^'].includes(lastChar) && isOperator) {
        return prev.slice(0, -1) + token;
      }

      // Prevent multiple decimals in the same number segment
      if (token === '.') {
        const segments = prev.split(/[\+\−\×\÷\^\(\)]/);
        const currentSegment = segments[segments.length - 1];
        if (currentSegment.includes('.')) return prev;
      }

      return prev + token;
    });
  }, [result, soundEnabled]);

  // Scientific functions (sin, cos, tan, etc.)
  const handleScientificFunc = useCallback((func) => {
    playSound('operator', soundEnabled);
    setExpression((prev) => {
      if (result !== null) {
        setResult(null);
        return `${func}`;
      }
      return `${prev}${func}`;
    });
  }, [result, soundEnabled]);

  // Backspace / Delete
  const handleBackspace = useCallback(() => {
    playSound('click', soundEnabled);
    setResult(null);
    setExpression((prev) => {
      if (!prev || prev.length === 0) return '';
      // Check for multi-char function tags like 'sin(', 'cos(', 'log(', etc.
      const match = prev.match(/(sin\(|cos\(|tan\(|log\(|ln\(|1\/\()$/);
      if (match) {
        return prev.slice(0, -match[0].length);
      }
      return prev.slice(0, -1);
    });
  }, [soundEnabled]);

  // Clear all
  const handleClear = useCallback(() => {
    playSound('clear', soundEnabled);
    setExpression('');
    setResult(null);
    setPreviewResult('');
  }, [soundEnabled]);

  // Toggle plus/minus sign
  const handleToggleSign = useCallback(() => {
    playSound('click', soundEnabled);
    if (result !== null) {
      const val = parseFloat(result.replace(/,/g, ''));
      setResult((-val).toString());
      setExpression((-val).toString());
      return;
    }

    setExpression((prev) => {
      if (!prev) return '−';
      if (prev.startsWith('−')) return prev.slice(1);
      if (prev.startsWith('-')) return prev.slice(1);
      return `−${prev}`;
    });
  }, [result, soundEnabled]);

  // Calculate final equals
  const handleCalculate = useCallback(() => {
    if (!expression || expression.trim() === '') return;

    const evalData = evaluateExpression(expression, angleMode);

    if (evalData.error) {
      playSound('error', soundEnabled);
      setResult('Error');
      return;
    }

    playSound('equals', soundEnabled);
    setResult(evalData.formatted);

    // Save to history
    const historyItem = {
      id: Date.now().toString(),
      expression: expression,
      result: evalData.formatted,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setHistory((prev) => [historyItem, ...prev.slice(0, 49)]); // keep last 50

    // Fun milestone celebration for clean integers or big numbers
    if (typeof evalData.result === 'number' && evalData.result > 999 && Number.isInteger(evalData.result)) {
      triggerConfetti();
    }
  }, [expression, angleMode, soundEnabled]);

  // Toggle Degree vs Radian
  const toggleAngleMode = () => {
    playSound('click', soundEnabled);
    setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'));
  };

  // Restore history calculation
  const handleSelectCalculation = (item) => {
    setExpression(item.result.replace(/,/g, ''));
    setResult(null);
    setIsHistoryOpen(false);
  };

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid capturing when user is typing in converter inputs
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleInput(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleInput('.');
      } else if (e.key === '+') {
        e.preventDefault();
        handleInput('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleInput('−');
      } else if (e.key === '*') {
        e.preventDefault();
        handleInput('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleInput('÷');
      } else if (e.key === '%') {
        e.preventDefault();
        handleInput('%');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleInput(e.key);
      } else if (e.key === '^') {
        e.preventDefault();
        handleInput('^');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, handleCalculate, handleBackspace, handleClear]);

  return (
    <div className={`app-root ${currentTheme}`}>
      {/* Background ambient decorative glowing orbs */}
      <div className="ambient-orb orb-primary" />
      <div className="ambient-orb orb-secondary" />

      {/* Main Glass Shell */}
      <main className="calc-card-shell">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isScientific={isScientific}
          setIsScientific={setIsScientific}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          historyCount={history.length}
        />

        {activeTab === 'calc' ? (
          <div className="calc-content-area">
            <Display
              expression={expression}
              result={result}
              previewResult={previewResult}
              angleMode={angleMode}
              toggleAngleMode={toggleAngleMode}
              isScientific={isScientific}
              onBackspace={handleBackspace}
              soundEnabled={soundEnabled}
            />

            <Keypad
              isScientific={isScientific}
              onInput={handleInput}
              onClear={handleClear}
              onCalculate={handleCalculate}
              onToggleSign={handleToggleSign}
              onScientificFunc={handleScientificFunc}
            />
          </div>
        ) : (
          <UnitConverter soundEnabled={soundEnabled} />
        )}

        <footer className="calc-footer">
          <span>NeoCalc Pro • Press <kbd>?</kbd> for shortcuts</span>
        </footer>
      </main>

      {/* Modals & Drawers */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectCalculation={handleSelectCalculation}
        onClearHistory={() => setHistory([])}
        soundEnabled={soundEnabled}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}
