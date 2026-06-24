import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", 
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", 
  "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", 
  "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", 
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", 
  "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

const generateSentence = (startWithClassic = false) => {
  const length = Math.floor(Math.random() * 6) + 8;
  let words = [];
  if (startWithClassic) words = ["Lorem", "ipsum", "dolor", "sit", "amet"];
  while (words.length < length) {
    const randomWord = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
    words.push(words.length === 0 ? randomWord.charAt(0).toUpperCase() + randomWord.slice(1) : randomWord);
  }
  return words.join(" ") + ".";
};

const generateParagraph = (sentenceCount = 5, startWithClassic = false) => {
  let sentences = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence(i === 0 && startWithClassic));
  }
  return sentences.join(" ");
};

export default function LoremIpsumGenerator() {
  const { dark } = useTheme();
  const [outputType, setOutputType] = useState('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithClassic, setStartWithClassic] = useState(true);
  const [format, setFormat] = useState('plain');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  const theme = {
    light: {
      card: "bg-white border-zinc-200/85 text-zinc-900 shadow-sm",
      input: "bg-white border-zinc-200 text-zinc-900 focus:border-black",
      preview: "bg-zinc-50 border-zinc-200 text-zinc-800",
      btnActive: "bg-black text-white border-black",
      btnInactive: "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
    },
    dark: {
      card: "bg-zinc-900/50 border-zinc-800/85 text-zinc-100",
      input: "bg-zinc-950/60 border-zinc-800 text-white focus:border-white",
      preview: "bg-zinc-950/40 border-zinc-800 text-zinc-300",
      btnActive: "bg-white text-black border-white",
      btnInactive: "border-zinc-800 text-zinc-400 hover:bg-zinc-900/50"
    }
  };

  const t = dark ? theme.dark : theme.light;

  const handleGenerate = () => {
    let result = [];
    if (outputType === 'words') {
      let words = startWithClassic ? ["Lorem", "ipsum", "dolor", "sit", "amet"] : [];
      while (words.length < count) {
        const word = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
        words.push(words.length === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.toLowerCase());
      }
      const rawWords = words.slice(0, count).join(" ");
      if (format === 'html') result.push(`<p>${rawWords}</p>`);
      else if (format === 'markdown') result.push(`${rawWords}`);
      else result.push(rawWords);
    } else if (outputType === 'sentences') {
      for (let i = 0; i < count; i++) {
        let sentence = generateSentence(i === 0 && startWithClassic);
        if (format === 'html') result.push(`<p>${sentence}</p>`);
        else if (format === 'markdown') result.push(`* ${sentence}`);
        else result.push(sentence);
      }
    } else {
      for (let i = 0; i < count; i++) {
        let paragraph = generateParagraph(5, i === 0 && startWithClassic);
        if (format === 'html') result.push(`<p>${paragraph}</p>`);
        else if (format === 'markdown') result.push(`### Paragraph ${i + 1}\n\n${paragraph}`);
        else result.push(paragraph);
      }
    }
    setGeneratedText(result.join('\n\n'));
  };

  useEffect(() => { handleGenerate(); }, [outputType, count, startWithClassic, format]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = generatedText.trim() === '' ? 0 : generatedText.trim().split(/\s+/).length;
  const charCount = generatedText.length;

  return (
    <div className={`p-6 md:p-8 max-w-5xl mx-auto border rounded-3xl transition-all duration-300 ${t.card}`}>
      <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Lorem Ipsum Generator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Output Type</label>
          <select 
            value={outputType} 
            onChange={(e) => setOutputType(e.target.value)} 
            className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none transition-all duration-300 ${t.input}`}
          >
            <option value="paragraphs" className={dark ? "bg-zinc-900" : "bg-white"}>Paragraphs</option>
            <option value="sentences" className={dark ? "bg-zinc-900" : "bg-white"}>Sentences</option>
            <option value="words" className={dark ? "bg-zinc-900" : "bg-white"}>Words</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Count (1-50)</label>
          <input 
            type="number" 
            min="1" 
            max="50" 
            value={count} 
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))} 
            className={`w-full rounded-xl border py-2.5 px-4 text-xs font-semibold outline-none transition-all duration-300 ${t.input}`} 
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Format</label>
          <div className="flex gap-2">
            {['plain', 'html', 'markdown'].map((f) => (
              <button 
                key={f} 
                onClick={() => setFormat(f)} 
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border rounded-xl transition-all duration-300 ${format === f ? t.btnActive : t.btnInactive}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center md:pt-6">
          <input 
            type="checkbox" 
            id="classic" 
            checked={startWithClassic} 
            onChange={(e) => setStartWithClassic(e.target.checked)} 
            className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-0 accent-zinc-900 dark:accent-white mr-3 cursor-pointer" 
          />
          <label htmlFor="classic" className="text-xs font-bold uppercase tracking-widest text-zinc-400 select-none cursor-pointer">
            Start with 'Lorem ipsum...'
          </label>
        </div>
      </div>

      <div className={`relative border rounded-2xl p-5 ${t.preview}`}>
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-200/40 dark:border-zinc-800/40">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 space-x-4">
            <span>Words: <strong className={dark ? "text-white" : "text-black"}>{wordCount}</strong></span>
            <span>Characters: <strong className={dark ? "text-white" : "text-black"}>{charCount}</strong></span>
          </div>
          <button 
            onClick={handleCopy} 
            className={`px-4 py-1.5 text-xs font-bold border rounded-xl transition-all duration-300 ${
              dark 
                ? "border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:border-zinc-600 hover:text-white" 
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-black"
            }`}
          >
            {copied ? '✅ Copied!' : '📋 Copy Text'}
          </button>
        </div>
        <pre className="whitespace-pre-wrap font-mono text-sm max-h-80 overflow-y-auto leading-relaxed outline-none">
          {generatedText}
        </pre>
      </div>
    </div>
  );
}