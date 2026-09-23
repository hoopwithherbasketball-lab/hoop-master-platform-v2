import React from 'react';

interface TextContentBlockContent {
  heading?: unknown;
  text?: unknown;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function TextContentBlock({ content }: { content: TextContentBlockContent }) {
  const heading = asString(content.heading);
  const text = asString(content.text);
  return (
    <div className="py-12 px-8 max-w-4xl mx-auto">
      {heading && <h2 className="text-3xl font-bold mb-6">{heading}</h2>}
      <div className="prose prose-lg max-w-none text-gray-700">
        <p>{text}</p>
      </div>
    </div>
  );
}
