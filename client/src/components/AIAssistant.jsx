// File: src/components/AIAssistant.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Sparkles, X } from 'lucide-react';
import { useAskAssistantMutation } from '@/features/api/aiAssistantApi';

const AIAssistant = ({ courseId, lectureId, courseTitle, lectureTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [askAssistant] = useAskAssistantMutation();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await askAssistant({
        courseId,
        lectureId,
        question: input,
        context: {
          courseTitle,
          lectureTitle,
        },
      }).unwrap();

      const aiMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitialMessage = () => {
    return lectureId
      ? `I'm your AI learning assistant for "${lectureTitle}" in "${courseTitle}". Ask me anything about this lecture!`
      : `I'm your AI learning assistant for "${courseTitle}". How can I help you with this course?`;
  };

  return (
    <>
      {!isOpen && (
        <Button
          className="fixed bottom-6 right-6 z-50 shadow-lg flex items-center gap-2"
          onClick={() => {
            setIsOpen(true);
            // Add initial message when opening
            if (messages.length === 0) {
              setMessages([
                {
                  role: 'assistant',
                  content: getInitialMessage(),
                  timestamp: new Date().toLocaleTimeString(),
                },
              ]);
            }
          }}
        >
          <Sparkles size={18} />
          AI Assistant
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[400px] h-[500px] z-50 shadow-xl flex flex-col">
          <CardHeader className="p-4 bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Sparkles size={20} />
                Learning Assistant
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary/80"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
            <p className="text-sm opacity-80">
              Helping with: {lectureTitle || courseTitle}
            </p>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <div className="p-3 border-t">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about this course..."
                className="min-h-[60px] resize-none"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className="h-[60px]"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIAssistant;