"use client";

import { useState, useEffect } from 'react';

// 为所有工具提供默认实现
const defaultLogic = `// Client-side processing example
// Privacy-first architecture: all data stays local
function processData(data) {
  // Process data locally
  console.log('Processing data...');
  
  // Return processed result
  return data;
}

// Example usage:
// const input = document.getElementById('input');
// input.addEventListener('change', (e) => {
//   const data = e.target.value;
//   const result = processData(data);
//   console.log('Result:', result);
// });`;

interface Props {
  slug: string;
}

export default function LogicXRay({ slug }: Props) {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  // 提取 saasName
  const saasName = typeof slug === 'string' ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'this tool';
  
  // 打字机效果
  useEffect(() => {
    try {
      const logic = defaultLogic;
      
      let index = 0;
      const interval = setInterval(() => {
        try {
          if (index < logic.length) {
            setText(logic.substring(0, index + 1));
            index++;
          } else {
            clearInterval(interval);
            setIsTyping(false);
          }
        } catch (error) {
          console.error('Error in typing effect:', error);
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 10);
      
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, []);
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Logic X-Ray
      </h2>
      <div className="bg-gray-900 rounded-lg p-4 sm:p-6 overflow-auto max-h-96">
        <div className="text-gray-400 text-sm mb-4">
          Transparency: Here is the actual logic that {saasName} charges you for. It lives in your browser, not their servers.
        </div>
        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
          {text}
          {isTyping && <span className="animate-pulse">|</span>}
        </pre>
      </div>
    </div>
  );
}
