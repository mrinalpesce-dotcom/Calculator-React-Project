import React from 'react';
import { Delete } from 'lucide-react';

export default function Keypad({
  isScientific,
  onInput,
  onClear,
  onCalculate,
  onToggleSign,
  onScientificFunc,
  activeKey
}) {
  return (
    <div className={`keypad-container ${isScientific ? 'scientific-expanded' : ''}`}>
      {/* Scientific Keys Grid (visible in scientific mode) */}
      {isScientific && (
        <div className="keypad-scientific-grid">
          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onScientificFunc('sin(')}
          >
            sin
          </button>
          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onScientificFunc('cos(')}
          >
            cos
          </button>
          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onScientificFunc('tan(')}
          >
            tan
          </button>
          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onScientificFunc('log(')}
          >
            log
          </button>
          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onScientificFunc('ln(')}
          >
            ln
          </button>

          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onScientificFunc('√')}
          >
            √
          </button>
          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onInput('^2')}
          >
            x²
          </button>
          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onInput('^')}
          >
            xʸ
          </button>
          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onInput('!')}
          >
            x!
          </button>
          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onScientificFunc('1/(')}
          >
            1/x
          </button>

          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onInput('π')}
          >
            π
          </button>
          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onInput('e')}
          >
            e
          </button>
          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onInput('(')}
          >
            (
          </button>
          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={() => onInput(')')}
          >
            )
          </button>
          <button
            type="button"
            className="calc-btn btn-scientific"
            onClick={onToggleSign}
          >
            ±
          </button>
        </div>
      )}

      {/* Main 4x5 Keypad Grid */}
      <div className="keypad-main-grid">
        {/* Row 1 */}
        <button
          type="button"
          className="calc-btn btn-function"
          onClick={onClear}
        >
          AC
        </button>
        <button
          type="button"
          className="calc-btn btn-function"
          onClick={() => onInput('(')}
        >
          (
        </button>
        <button
          type="button"
          className="calc-btn btn-function"
          onClick={() => onInput(')')}
        >
          )
        </button>
        <button
          type="button"
          className="calc-btn btn-operator"
          onClick={() => onInput('÷')}
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          type="button"
          className="calc-btn btn-number"
          onClick={() => onInput('7')}
        >
          7
        </button>
        <button
          type="button"
          className="calc-btn btn-number"
          onClick={() => onInput('8')}
        >
          8
        </button>
        <button
          type="button"
          className="calc-btn btn-number"
          onClick={() => onInput('9')}
        >
          9
        </button>
        <button
          type="button"
          className="calc-btn btn-operator"
          onClick={() => onInput('×')}
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          type="button"
          className="calc-btn btn-number"
          onClick={() => onInput('4')}
        >
          4
        </button>
        <button
          type="button"
          className="calc-btn btn-number"
          onClick={() => onInput('5')}
        >
          5
        </button>
        <button
          type="button"
          className="calc-btn btn-number"
          onClick={() => onInput('6')}
        >
          6
        </button>
        <button
          type="button"
          className="calc-btn btn-operator"
          onClick={() => onInput('−')}
        >
          −
        </button>

        {/* Row 4 */}
        <button
          type="button"
          className="calc-btn btn-number"
          onClick={() => onInput('1')}
        >
          1
        </button>
        <button
          type="button"
          className="calc-btn btn-number"
          onClick={() => onInput('2')}
        >
          2
        </button>
        <button
          type="button"
          className="calc-btn btn-number"
          onClick={() => onInput('3')}
        >
          3
        </button>
        <button
          type="button"
          className="calc-btn btn-operator"
          onClick={() => onInput('+')}
        >
          +
        </button>

        {/* Row 5 */}
        <button
          type="button"
          className="calc-btn btn-number"
          onClick={() => onInput('%')}
          title="Percentage"
        >
          %
        </button>
        <button
          type="button"
          className="calc-btn btn-number"
          onClick={() => onInput('0')}
        >
          0
        </button>
        <button
          type="button"
          className="calc-btn btn-number"
          onClick={() => onInput('.')}
        >
          .
        </button>
        <button
          type="button"
          className="calc-btn btn-equals"
          onClick={onCalculate}
        >
          =
        </button>
      </div>
    </div>
  );
}
