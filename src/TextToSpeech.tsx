import React, { FormEvent, useEffect, useRef, useState } from 'react';

const TextToSpeech = () => {
  const textInputRef = useRef<HTMLInputElement>(null!);
  const selectRef = useRef<HTMLSelectElement>(null!);
  const [voiceList, setVoiceList] = useState<SpeechSynthesisVoice[]>([]);

  // get voice list
  useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    setVoiceList(voices);
  }, []);

  useEffect(() => {
    // Chrome takes some time to load voice list
    speechSynthesis.onvoiceschanged = updateVoiceList;
    // Firefox have voices from the start and never fires voiceschanged event
    updateVoiceList();
  }, []);

  const updateVoiceList = () => {
    const voices = window.speechSynthesis.getVoices();

    setVoiceList(voices);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = textInputRef.current.value;
    const utterance = new SpeechSynthesisUtterance(text);
    const voiceName = selectRef.current.selectedOptions[0].getAttribute(
      'data-name'
    ) as string;
    const voice = voiceList.filter((voice) => voice.name === voiceName)[0];

    const formData = new FormData(e.target as HTMLFormElement);

    // utterance.voice = voiceName as SpeechSynthesisVoice;
    utterance.voice = voice;
    utterance.pitch = +formData.get('pitch')! as number;
    utterance.rate = +formData.get('rate')! as number;

    window.speechSynthesis.speak(utterance);

    textInputRef.current.blur();
  };

  const options = voiceList.map((voice) => {
    const text = `${voice.name} (${voice.lang})${
      voice.default && ' --DEFAULT'
    }`;
    return (
      <option key={voice.name} data-lang={voice.lang} data-name={voice.name}>
        {text}
      </option>
    );
  });

  return (
    <form className="speech-synthesis" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Speech Synthesis</legend>
        <div className="form-control">
          <label htmlFor="synth-text">Text</label>
          <input
            id="synth-text"
            name="text"
            ref={textInputRef}
            type="text"
            required={true}
          />
        </div>
        <div className="form-control">
          <label htmlFor="synth-voice">Voice</label>
          <select ref={selectRef} name="voice" id="synth-voice">
            {options}
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="synth-pitch">Pitch</label>
          <input
            id="synth-pitch"
            type="number"
            min="0"
            max="2"
            step="1"
            defaultValue="1"
          />
        </div>
        <div className="form-control">
          <label htmlFor="synth-rate">Rate</label>
          <input
            id="synth-rate"
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            defaultValue="1"
          />
        </div>
        <button type="submit">Text to Speech</button>
      </fieldset>
    </form>
  );
};

export default TextToSpeech;
