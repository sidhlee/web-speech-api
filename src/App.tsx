import React from 'react';
import TextToSpeech from './TextToSpeech';
import SpeechToText from './SpeechToText';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Web Speech API</h1>
      </header>
      <main>
        <TextToSpeech />
        <SpeechToText />
      </main>
    </div>
  );
}

export default App;
