import { generate } from './utils/words';
import { currentTime, time } from './utils/time';
import useKeyPress from './hooks/useKeyPress';
import './App.css';
import { useState } from 'react';

const initialWords = generate(20);

function App() {
  const [theme, setTheme] = useState(
    localStorage['typing-theme']
      ? JSON.parse(localStorage['typing-theme'])
      : 'normal'
  );

  const [leftPadding, setLeftPadding] = useState(
    new Array(20).fill(' ').join('')
  );

  const [outgoingChars, setOutgoingChars] = useState('');
  const [currentChar, setCurrentChar] = useState(initialWords.charAt(0));
  const [incomingChars, setIncomingChars] = useState(initialWords.substring(1));

  const [startTime, setStartTime] = useState();
  const [wordCount, setWordCount] = useState(0);
  const [wpm, setWpm] = useState(0);

  const [accuracy, setAccuracy] = useState(0);
  const [typedChars, setTypedChars] = useState('');

  useKeyPress((key) => {
    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;

    if (!startTime) {
      setStartTime(currentTime());
    }

    const updatedTypedChars = typedChars + key;
    setTypedChars(updatedTypedChars);

    setAccuracy(
      ((updatedOutgoingChars.length * 100) / updatedTypedChars.length).toFixed(
        2
      )
    );

    if (key === currentChar) {
      if (leftPadding.length > 0) {
        setLeftPadding(leftPadding.substring(1));
      }

      if (incomingChars.charAt(0) === ' ') {
        setWordCount((w) => w + 1);
        const durationInMinutes = (currentTime() - startTime) / 60000.0;
        setWpm(((wordCount + 1) / durationInMinutes).toFixed(2));
      }

      updatedOutgoingChars += currentChar;
      setOutgoingChars(updatedOutgoingChars);

      setCurrentChar(incomingChars.charAt(0));

      updatedIncomingChars = incomingChars.substring(1);
      if (updatedIncomingChars.split(' ').length < 10) {
        updatedIncomingChars += ' ' + generate();
      }
      setIncomingChars(updatedIncomingChars);
    }
  });

  return (
    <div className="App">
      <div
        className={theme === 'butt' ? 'App-header-butt' : 'App-header-normal'}
      >
        <h1 className="header">
          <span>Typing suck</span>{' '}
          <span
            style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              const fn = (theme) => (theme === 'normal' ? 'butt' : 'normal');
              setTheme((t) => fn(t));
              localStorage['typing-theme'] = JSON.stringify(fn(theme));
            }}
          >
            ass
          </span>
        </h1>
        <p className="Character">
          <span className="Character-out">
            {(leftPadding + outgoingChars).slice(-20)}
          </span>
          <span className="Character-current">{currentChar}</span>
          <span>{incomingChars.substr(0, 20)}</span>
        </p>
        <h3>
          WPM: {wpm} || Accuracy: {accuracy}
        </h3>
      </div>
    </div>
  );
}

export default App;
