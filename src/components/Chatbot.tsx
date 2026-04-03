import React from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Array<{text: string; isBot: boolean}>>([
    { text: "Hello! I'm your StudyAI assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const qaPairs = [
    {
      keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
      response: "Hi there! How are you doing today? I'm here to help you with StudyAI Planner."
    },
    {
      keywords: ['how are you', 'how do you do'],
      response: "I'm doing great, thank you for asking! I'm here and ready to assist you with all things StudyAI."
    },
    {
      keywords: ['what is this', 'what is studyai', 'about this website', 'about studyai'],
      response: "StudyAI Planner is your intelligent companion for academic success! It helps you create personalized study plans, access free educational resources, collaborate in group studies, get AI tutoring, and manage notes with rich text editing."
    },
    {
      keywords: ['features', 'what can you do', 'what features'],
      response: "We have amazing features: Smart Study Planner (AI-powered plans), Free Educational Resources (CBSE materials), Group Study Section (collaborate with friends), AI Tutor Section (instant help), and Notes Section (rich text editing with syntax highlighting)."
    },
    {
      keywords: ['how to use', 'get started', 'how to start'],
      response: "Getting started is easy! First, sign up and set up your subjects. Then explore our features: create study plans, join groups, ask the AI tutor, or take notes. Each section has detailed guides."
    },
    {
      keywords: ['planner', 'study plan', 'use planner', 'i want to use planner'],
      response: "To use the Smart Study Planner: Go to 'Smart Study Planner' from the home page, select your subjects, set your exam date, and let our AI create a personalized study schedule for you. You're all set to go!"
    },
    {
      keywords: ['resources', 'educational resources', 'free resources'],
      response: "Our Free Educational Resources section provides quality CBSE learning materials for all subjects and classes 1-10. Access videos, notes, and practice materials completely free!"
    },
    {
      keywords: ['group study', 'study groups', 'collaborate'],
      response: "In Group Study Section, you can create study groups, invite friends, and track team progress together. It's perfect for collaborative learning and staying motivated with peers."
    },
    {
      keywords: ['ai tutor', 'tutor', 'help with questions'],
      response: "The AI Tutor Section offers instant help! Choose from Doubt Solver, Explain Topic, Generate Notes, or Practice Questions. Just set your Gemini API key for live responses."
    },
    {
      keywords: ['notes', 'note taking', 'rich text'],
      response: "Our Notes Section lets you create and manage notes with rich text editing. Use formatting tools, add code blocks with syntax highlighting, search notes, and even export as Markdown."
    },
    {
      keywords: ['api key', 'gemini', 'set api'],
      response: "To use AI features, get a free Gemini API key from Google AI Studio (aistudio.google.com). Paste it in the AI Tutor section and click 'Save API' for instant responses."
    },
    {
      keywords: ['subjects', 'setup subjects', 'choose subjects'],
      response: "To set up subjects: Go to 'Subjects' after signing up, select the subjects relevant to your exam, and configure your preferences. This helps create better study plans."
    },
    {
      keywords: ['exam date', 'set date', 'when is exam'],
      response: "When creating a study plan, you'll be asked to set your exam date. This helps the AI calculate how much time you have and create a realistic study schedule."
    },
    {
      keywords: ['help', 'support', 'contact'],
      response: "I'm here to help! You can ask me about any feature, how to use the app, or get guidance on studying. If you need more help, feel free to explore each section."
    },
    {
      keywords: ['thank you', 'thanks', 'appreciate'],
      response: "You're very welcome! I'm glad I could help. Happy studying with StudyAI Planner! 📚"
    }
  ];

  const findResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    for (const pair of qaPairs) {
      if (pair.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return pair.response;
      }
    }
    return "I'm not sure about that, but I'd be happy to help with StudyAI Planner features! Try asking about study plans, resources, or how to get started.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput('');

    setTimeout(() => {
      const botResponse = findResponse(userMessage);
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--primary-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
      >
        <MessageCircle size={28} color="white" />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '500px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'var(--primary-blue)',
              color: 'white',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '12px 12px 0 0'
            }}
          >
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>StudyAI Assistant</h4>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Ask me anything!</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              background: 'var(--bg-secondary)'
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: msg.isBot ? 'flex-start' : 'flex-end'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '8px 12px',
                    borderRadius: '18px',
                    background: msg.isBot ? 'var(--bg-primary)' : 'var(--primary-blue)',
                    color: msg.isBot ? 'var(--text-primary)' : 'white',
                    border: msg.isBot ? '1px solid var(--border-light)' : 'none',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-light)',
              background: 'var(--bg-primary)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid var(--border-light)',
                borderRadius: '20px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSend}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary-blue)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;