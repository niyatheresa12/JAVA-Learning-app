import React from 'react';

const RichContentRenderer = ({ content }) => {
  if (!content) return null;

  // Split lines and parse basic markdown structure
  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let inList = false;
  let listItems = [];

  const flushList = (key) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc list-inside space-y-1.5 my-3 text-slate-700">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushCode = (key) => {
    if (inCodeBlock && codeBlockContent.length > 0) {
      elements.push(
        <pre
          key={`code-${key}`}
          className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-sm font-mono my-4 border border-slate-800"
        >
          <code>{codeBlockContent.join('\n')}</code>
        </pre>
      );
      codeBlockContent = [];
      inCodeBlock = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Code block toggle
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushCode(index);
      } else {
        flushList(index);
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // Unordered or Ordered List Item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
      inList = true;
      const cleanItem = trimmed.replace(/^[-*]\s+|\d+\.\s+/, '');
      listItems.push(cleanItem);
      return;
    } else {
      flushList(index);
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-xl font-bold text-slate-900 mt-6 mb-2 tracking-tight">
          {trimmed.replace('### ', '')}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-2xl font-bold text-slate-900 mt-8 mb-3 tracking-tight">
          {trimmed.replace('## ', '')}
        </h2>
      );
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-3xl font-extrabold text-slate-900 mt-10 mb-4 tracking-tight">
          {trimmed.replace('# ', '')}
        </h1>
      );
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote
          key={index}
          className="border-l-4 border-indigo-500 pl-4 py-1 italic text-slate-600 my-4 bg-indigo-50/40 rounded-r-lg"
        >
          {trimmed.replace('> ', '')}
        </blockquote>
      );
    } else if (trimmed === '') {
      // Empty spacing
    } else {
      // Regular paragraph with basic inline formatting (**bold**, `code`)
      elements.push(
        <p key={index} className="text-slate-700 leading-relaxed my-3 text-base">
          {parseInlineFormatting(line)}
        </p>
      );
    }
  });

  // Flush remaining buffers if any
  flushList('final');
  flushCode('final');

  return <div className="prose prose-slate max-w-none">{elements}</div>;
};

// Helper for inline markdown: **bold**, *italic*, `code`
function parseInlineFormatting(text) {
  const parts = [];
  let remaining = text;
  let key = 0;

  // Simple token regex for inline code and bold
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={key++} className="font-semibold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={key++}
          className="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export default RichContentRenderer;
