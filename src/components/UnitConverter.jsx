import React, { useState } from 'react';
import { ArrowRightLeft, Sparkles, Copy, Check } from 'lucide-react';
import { playSound } from '../utils/audio';

const CONVERSION_CATEGORIES = {
  length: {
    label: 'Length',
    units: {
      m: { name: 'Meters (m)', factor: 1 },
      km: { name: 'Kilometers (km)', factor: 1000 },
      cm: { name: 'Centimeters (cm)', factor: 0.01 },
      mm: { name: 'Millimeters (mm)', factor: 0.001 },
      mi: { name: 'Miles (mi)', factor: 1609.344 },
      ft: { name: 'Feet (ft)', factor: 0.3048 },
      in: { name: 'Inches (in)', factor: 0.0254 }
    }
  },
  weight: {
    label: 'Mass / Weight',
    units: {
      kg: { name: 'Kilograms (kg)', factor: 1 },
      g: { name: 'Grams (g)', factor: 0.001 },
      mg: { name: 'Milligrams (mg)', factor: 0.000001 },
      lb: { name: 'Pounds (lb)', factor: 0.45359237 },
      oz: { name: 'Ounces (oz)', factor: 0.02834952 }
    }
  },
  temperature: {
    label: 'Temperature',
    units: {
      c: { name: 'Celsius (°C)' },
      f: { name: 'Fahrenheit (°F)' },
      k: { name: 'Kelvin (K)' }
    }
  },
  digital: {
    label: 'Data Storage',
    units: {
      b: { name: 'Bytes (B)', factor: 1 },
      kb: { name: 'Kilobytes (KB)', factor: 1024 },
      mb: { name: 'Megabytes (MB)', factor: 1024 * 1024 },
      gb: { name: 'Gigabytes (GB)', factor: 1024 * 1024 * 1024 },
      tb: { name: 'Terabytes (TB)', factor: 1024 * 1024 * 1024 * 1024 }
    }
  },
  speed: {
    label: 'Speed',
    units: {
      mps: { name: 'Meters / sec (m/s)', factor: 1 },
      kmh: { name: 'Km / hour (km/h)', factor: 0.277778 },
      mph: { name: 'Miles / hour (mph)', factor: 0.44704 },
      knot: { name: 'Knots (kn)', factor: 0.514444 }
    }
  }
};

export default function UnitConverter({ soundEnabled }) {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [inputValue, setInputValue] = useState('1');
  const [copied, setCopied] = useState(false);

  // When category changes, reset units
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const unitKeys = Object.keys(CONVERSION_CATEGORIES[newCat].units);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
    playSound('operator', soundEnabled);
  };

  const calculateResult = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '—';

    if (category === 'temperature') {
      let celsius = val;
      if (fromUnit === 'f') celsius = (val - 32) * (5 / 9);
      else if (fromUnit === 'k') celsius = val - 273.15;

      let res = celsius;
      if (toUnit === 'f') res = (celsius * 9) / 5 + 32;
      else if (toUnit === 'k') res = celsius + 273.15;

      return Number(res.toFixed(4)).toString();
    }

    const catUnits = CONVERSION_CATEGORIES[category].units;
    const baseValue = val * catUnits[fromUnit].factor;
    const converted = baseValue / catUnits[toUnit].factor;

    return Number(converted.toFixed(6)).toString();
  };

  const swapUnits = () => {
    playSound('click', soundEnabled);
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopy = () => {
    const res = calculateResult();
    if (res !== '—') {
      navigator.clipboard.writeText(`${inputValue} ${fromUnit} = ${res} ${toUnit}`);
      setCopied(true);
      playSound('equals', soundEnabled);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const currentUnits = CONVERSION_CATEGORIES[category].units;

  return (
    <div className="converter-panel">
      <div className="converter-tabs">
        {Object.entries(CONVERSION_CATEGORIES).map(([catKey, catData]) => (
          <button
            key={catKey}
            type="button"
            className={`conv-tab-btn ${category === catKey ? 'active' : ''}`}
            onClick={() => handleCategoryChange(catKey)}
          >
            {catData.label}
          </button>
        ))}
      </div>

      <div className="converter-body">
        {/* From Group */}
        <div className="conv-card">
          <label className="conv-label">From</label>
          <div className="conv-input-row">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="conv-input"
              placeholder="0"
            />
            <select
              value={fromUnit}
              onChange={(e) => {
                setFromUnit(e.target.value);
                playSound('click', soundEnabled);
              }}
              className="conv-select"
            >
              {Object.entries(currentUnits).map(([code, unit]) => (
                <option key={code} value={code}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap button */}
        <div className="conv-swap-container">
          <button
            type="button"
            className="conv-swap-btn"
            onClick={swapUnits}
            title="Swap units"
            aria-label="Swap units"
          >
            <ArrowRightLeft size={18} />
          </button>
        </div>

        {/* To Group */}
        <div className="conv-card">
          <label className="conv-label">To (Converted Result)</label>
          <div className="conv-input-row">
            <div className="conv-result-display">
              <span className="conv-result-value">{calculateResult()}</span>
              <span className="conv-result-unit">{currentUnits[toUnit]?.name.split(' ')[0]}</span>
            </div>
            <select
              value={toUnit}
              onChange={(e) => {
                setToUnit(e.target.value);
                playSound('click', soundEnabled);
              }}
              className="conv-select"
            >
              {Object.entries(currentUnits).map(([code, unit]) => (
                <option key={code} value={code}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          className="conv-copy-btn"
          onClick={handleCopy}
          disabled={calculateResult() === '—'}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied to Clipboard!' : 'Copy Conversion'}
        </button>
      </div>
    </div>
  );
}
