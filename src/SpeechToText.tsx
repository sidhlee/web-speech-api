import React, { useState, useRef, useEffect } from 'react';

const SpeechRecognition =
  (window as any).speechRecognition || (window as any).webkitSpeechRecognition;

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<string>(null!);
  const [events, setEvents] = useState<SpeechRecognitionEvent[]>([]);
  const recognitionRef = useRef<SpeechRecognition>(null!);

  useEffect(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.onresult = (e: SpeechRecognitionEvent) => {
        const transcript = e.results[0][0].transcript;
        setResult((result) => transcript);
        console.log(transcript);
      };
      console.log(recognitionRef.current);

      const cb = (e: any) => setEvents((events) => [...events, e.type]);
      recognitionRef.current.onaudiostart = cb;
      recognitionRef.current.onaudioend = cb;
      recognitionRef.current.onend = cb;
      recognitionRef.current.onerror = cb;
      recognitionRef.current.onnomatch = cb;
      recognitionRef.current.onsoundstart = cb;
      recognitionRef.current.onsoundend = cb;
      recognitionRef.current.onspeechstart = cb;
      recognitionRef.current.onspeechend = cb;
      recognitionRef.current.onstart = cb;
    }
  }, []);

  const clear = () => {
    setResult('');
    setEvents([]);
  };

  const handleButtonClick = () => {
    if (isRecording) {
      const result = recognitionRef.current.stop();
      console.log(result);
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <section className="speech-recognition">
      <fieldset>
        <legend>Speech Recognition</legend>
        <button onClick={handleButtonClick}>
          {isRecording ? 'Stop' : 'Record'}
        </button>
        <button onClick={clear}>Clear</button>
        <p className="label">Result</p>
        <div className="result">{result}</div>
        <p className="label">Events</p>
        <ol className="events">
          {events.map((event, i) => (
            <li key={i}>{event}</li>
          ))}
        </ol>
      </fieldset>
    </section>
  );
};

export default SpeechToText;
