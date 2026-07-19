import React, { useEffect, useState } from "react";
import { checkHeading, replaceHeadingstarts } from "../helper";
import Markdown from "react-markdown";
// import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/styles/prism";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";

const Answer = ({ ans, totalResult, index, type }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeadingstarts(ans));
    }
  }, []);

  // <SyntaxHighlighter

  const renderer = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          children={String(children).replace(/\n$/, "")}
          language={match[1]}
          style={dark}
          PreTag="div"
        />
      ) : (
        <code {...props} className={className}>
          {children}
        </code>
      );
    },
  };

  return (
    <div>
      {index == 0 && totalResult > 1 ? (
        <span className="t-2 text-xl block text-white">{answer}</span>
      ) : heading ? (
        <span className="pt-2 text-lg block text-white">{answer}</span>
      ) : (
        <span className={type == "q" ? "pl-1" : "pl-5"}>
          <Markdown components={renderer}>{answer}</Markdown>
        </span>
      )}
    </div>
  );
};

export default Answer;
