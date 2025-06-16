'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';
import 'prismjs/themes/prism-tomorrow.css';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';

const classes = {
  main: 'h-screen w-screen flex flex-col bg-[#121212] text-white font-inter',
  topBar: 'sticky top-0 z-10 bg-[#1e1e1e] p-4 flex gap-4 border-b border-gray-700',
  langButton: 'px-4 py-2 rounded-lg font-medium cursor-pointer border transition-all duration-300',
  activeLang: 'bg-blue-600 text-white border-blue-700',
  inactiveLang: 'bg-gray-100 text-black border-gray-300 hover:bg-gray-300',
  container: 'flex flex-1 overflow-hidden',
  editorWrapper: 'w-1/2 bg-[#181818] p-4 flex flex-col border-r border-gray-700',
  editorContent: 'flex-1 overflow-auto rounded-lg border border-gray-700 bg-[#0f0f0f]',
  responseWrapper: 'w-1/2 p-4 overflow-auto bg-[#1a1a1a]',
  reviewButton: 'h-10 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold flex justify-center items-center cursor-pointer user-select-none transition-all hover:scale-105',
  markdownText: 'prose prose-invert max-w-none',
};

const languageOptions = {
  javascript: 'JavaScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C/C++',
};

const languageMap = {
  javascript: Prism.languages.javascript,
  python: Prism.languages.python,
  java: Prism.languages.java,
  cpp: Prism.languages.c,
};

const GetCode = () => {
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);

  async function reviewText() {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/ai/get-review', {
        text: code,
        language: language,
      });
      console.log(response.data);
      setReview(response.data);
    } catch (error) {
      console.error('Error while sending text to the API:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const highlightCode = (code) => Prism.highlight(code, languageMap[language], language);

  return (
    <div className={classes.main}>

      <div className={classes.topBar}>
        {Object.entries(languageOptions).map(([langKey, langLabel]) => (
          <div
            key={langKey}
            className={classNames(
              classes.langButton,
              language === langKey ? classes.activeLang : classes.inactiveLang
            )}
            onClick={() => setLanguage(langKey)}
          >
            {langLabel}
          </div>
        ))}

        <div onClick={reviewText} className={classes.reviewButton}>
          {loading ? 'Reviewing...' : 'Review Code'}
        </div>
      </div>

      <div className={classes.container}>

        {/* Left Editor */}
        <div className={classes.editorWrapper}>
          <div className={classes.editorContent}>
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={highlightCode}
              padding={16}
              style={{
                fontFamily: 'monospace',
                fontSize: 14,
                minHeight: '100%',
                outline: 0,
                whiteSpace: 'pre',
              }}
            />
          </div>
        </div>

        {/* Right Markdown Output */}
        <div className={classes.responseWrapper}>
          {review ? (
            <div className={classes.markdownText}>
  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
    {review}
  </ReactMarkdown>
</div>

          ) : (
            <div className="text-gray-400">Your AI review will appear here.</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default GetCode;
