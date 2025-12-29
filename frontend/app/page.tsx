"use client";

import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import styles from "./page.module.css";

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage: Message = { role: "user", text: input };
        
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch("https://agera-ai-568242798484.europe-west1.run.app/api/v1/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ request: input }),
            });

            if (!response.ok) throw new Error("Server error");
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let isFirstChunk = true;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                if (isFirstChunk) {
                    setIsTyping(false);
                    setMessages((prev) => [...prev, { role: "assistant", text: chunk }]);
                    isFirstChunk = false;
                } else {
                    setMessages((prev) => {
                        const lastMsg = prev[prev.length - 1];
                        if (!lastMsg || lastMsg.role !== "assistant") return prev;
                        
                        const otherMsgs = prev.slice(0, -1);
                        return [...otherMsgs, { ...lastMsg, text: lastMsg.text + chunk }];
                    });
                }
            }
        } catch (error) {
            console.error("Error:", error);
            setIsTyping(false);
        }
    };

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <div className={styles.chatBox}>
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.role === "user" ? styles.userRow : styles.aiRow}>
                            <div className={msg.role === "user" ? styles.userBubble : styles.aiBubble}>
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className={styles.aiRow}>
                            <div className={styles.aiBubble}>
                                <div className={styles.typing}>
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className={styles.inputForm}>
                    <input
                        className={styles.inputField}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Запитайте щось у Agera..."
                    />
                    <button type="submit" className={styles.sendButton} disabled={isTyping || !input.trim()}>
                        <IoSend size={18} />
                    </button>
                </form>
            </div>
        </main>
    );
}
