import { useState, useRef, useEffect } from 'react';
import CuteFace from './CuteFace';

function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "hey! i'm mochi 🌸 how are you feeling today?" }
  ]);
  const [input, setInput] = useState('');
  const [emotion, setEmotion] = useState('happy');
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const bottomRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);      

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Scheduler - check for proactive messages
  useEffect(() => {
    const checkForMessages = async () => {
      try {
        const res = await fetch('https://ai-companion-6nub.onrender.com/check');
        const data = await res.json();
        if (data.messages.length > 0) {
          data.messages.forEach(msg => {
            setMessages(prev => [...prev, { role: 'ai', text: msg }]);
          });
          setEmotion('happy');
        }
      } catch (err) {}
    };
    const interval = setInterval(checkForMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sound effect
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].role === 'ai') {
      const audio = new Audio('/sounds/pop.wav');
      audio.volume = 0.4;
      audio.play().catch(() => {});
      if (navigator.vibrate) navigator.vibrate(100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('https://ai-companion-6nub.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      speak(data.reply);   
      setEmotion(data.emotion);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "uh oh, i lost connection 😅" }]);
      setEmotion('confused');
    } finally {
      setIsTyping(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    setListening(true);
    recognition.start();
  }; 
  
  const speak = (text) => {
    if (!voiceOn) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.4;
    utterance.lang = "en-US";

    const voices = window.speechSynthesis.getVoices();
    // Try multiple female voice names
    const femaleVoice =
      voices.find(v => v.name.includes("Google UK English Female")) ||
      voices.find(v => v.name.includes("Google US English")) ||
      voices.find(v => v.name.includes("Samantha")) ||
      voices.find(v => v.name.includes("Victoria")) ||
      voices.find(v => v.name.includes("Zira") && v.lang.includes("en")) ||
      voices.find(v => v.name.toLowerCase().includes("female")) ||
      voices.find(v => v.name.toLowerCase().includes("woman"));

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    window.speechSynthesis.speak(utterance);
  };   

  //const speak = (text) => {
  if (!voiceOn) return;

  /* 
  Remove emojis and special chars (ElevenLabs doesn't handle them well)
  const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/gu, '');

    fetch('https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID', {
      method: 'POST',
      headers: {
        'xi-api-key': 'YOUR_ELEVENLABS_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8
        }
      })
    })
    .then(res => res.arrayBuffer())
    .then(buffer => {
      const audio = new Audio(URL.createObjectURL(new Blob([buffer])));
      audio.play();
    })
    .catch(() => {
      // Fallback to Web Speech API if ElevenLabs fails
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.4;
      window.speechSynthesis.speak(utterance);
    });
  };

  What to replace:
    Placeholder	Where to get it
    YOUR_VOICE_ID	Go to ElevenLabs → Voice Library → click a voice → the ID is in the URL (looks like 21m00Tcm4TlvDq8ikWAM)
    YOUR_ELEVENLABS_KEY	Profile → API Key

  How to find your Voice ID:
  1. Go to elevenlabs.io/voice-library
  2. Click on a voice you like (e.g., "Rachel")
  3. Look at the URL in your browser — it'll look like:
     elevenlabs.io/voice-library/21m00Tcm4TlvDq8ikWAM

  4. That long string at the end is your Voice ID

  */

  return (
    <div className={`h-screen flex flex-col max-w-md mx-auto shadow-xl transition-colors duration-300 sm:my-4 sm:rounded-3xl sm:overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-pink-50'}`}>   
      {/* HEADER */}
      <div className={`p-4 flex items-center gap-3 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <CuteFace emotion={emotion} />
        <div>
          <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Mochi 🌸</p>
          <p className="text-xs text-green-500">● online</p>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="ml-auto text-xl">
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button onClick={() => setVoiceOn(!voiceOn)} className="text-xl">
          {voiceOn ? '🔊' : '🔇'}
        </button>   
      </div>

      {/* MESSAGES */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-3 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-pink-50'}`}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm transition-colors duration-300 ${
              msg.role === 'user'
                ? 'bg-pink-500 text-white rounded-br-sm'
                : darkMode ? 'bg-gray-700 text-gray-100 rounded-bl-sm' : 'bg-white shadow-sm text-gray-800 rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-2xl rounded-bl-sm text-sm ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-white shadow-sm text-gray-400'}`}>
              typing<span className="animate-pulse">...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className={`p-4 flex gap-2 border-t transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

        <button
          onClick={startListening}
          className={`rounded-full w-10 h-10 flex items-center justify-center transition-colors ${
                  listening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600'
          }`}
        >
          🎤
        </button>   

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="type here..."
          className={`flex-1 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors duration-300 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border border-gray-200'}`}
        />
        <button
          onClick={() => {
            if (window.speechSynthesis.speaking) {
              window.speechSynthesis.cancel();
            } else {
              sendMessage();
            }
          }}
          className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
        >
          {window.speechSynthesis.speaking ? '⏹' : '➤'}
        </button>   
      </div>
    </div>
  );
}

export default App;   