import React, { useState, useRef } from "react";
import { api } from "../../axios/api.ts";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../../styles/ai/ai-main-style.scss";

const AIAgent = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [isContainerVisible, setIsContainerVisible] = useState(false);
    const [showCopied, setShowCopied] = useState(false);
    const responseRef = useRef(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setIsContainerVisible(true);
        setResponse("");

        try {
            const result = await api.post("/api/gemini/generate", { prompt: prompt }, { withCredentials: true });
            setResponse(result.data);
        } catch {
            setResponse("Error: Unable to fetch response. Please try again.");
        } finally {
            setLoading(false);
            setPrompt("");
        }
    };

    const copyCode = (codeText: string) => {
        navigator.clipboard.writeText(codeText);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    return (
        <>
            <div className="ai-header">
                <h1 className="gradient-text">AI Assistant</h1>
            </div>
            <div className="ai-container">
                {showCopied && <div className="copy-notification">✅ Code copied to clipboard!</div>}

                {isContainerVisible && (
                    <div
                        className={`response-container ${loading ? 'loading' : ''} ${!loading && response ? 'visible' : ''}`}
                        ref={responseRef}>
                        {loading ? (
                            <div className="loader-container">
                                <div className="loader"></div>
                            </div>
                        ) : (
                            <>
                                <ReactMarkdown
                                    children={response}
                                    components={{
                                        code: ({
                                                   inline,
                                                   className,
                                                   children,
                                                   ...props
                                               }: {
                                            inline?: boolean;
                                            className?: string;
                                            children?: React.ReactNode;
                                        }) => {
                                            const match = /language-(\w+)/.exec(className || "");
                                            const codeText = String(children).replace(/\n$/, "");

                                            return !inline && match ? (
                                                <div className="code-block">
                                                    <button className="copy-btn" onClick={() => copyCode(codeText)}>Copy</button>
                                                    <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div">
                                                        {codeText}
                                                    </SyntaxHighlighter>
                                                </div>
                                            ) : (
                                                <code className={className} {...props}>{children}</code>
                                            );
                                        }
                                    }}
                                />
                            </>
                        )}
                    </div>
                )}

                <form className="ai-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={prompt}
                        onChange={handleInputChange}
                        placeholder="Enter your request..."
                        className="ai-input"
                        disabled={loading}
                    />
                    <button type="submit" className="ai-button" disabled={loading}>
                        {loading ? <div className="spinner"></div> : "Generate"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default AIAgent;
