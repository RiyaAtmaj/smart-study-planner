import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const tutorModes = [
  {
    id: 'doubt-solver',
    title: 'Doubt Solver (AI Chat)',
    description: 'Ask any subject question and get instant, step-by-step clarification.',
    systemPrompt:
      'You are a friendly doubt solver. Provide precise explanations, break down logic clearly, and confirm understanding with the student.'
  },
  {
    id: 'explain-topic',
    title: 'Explain a Topic',
    description: 'Give a concise concept overview with examples and key takeaways.',
    systemPrompt:
      'You are an explanatory tutor. Summarize the topic in simple language, include examples, and highlight core concepts.'
  },
  {
    id: 'generate-notes',
    title: 'Generate Notes',
    description: 'Create structured revision notes and bullet summaries from prompts.',
    systemPrompt:
      'You are a note generator. Deliver clean, structured notes with headings, bullet points, and a short summary.'
  },
  {
    id: 'generate-questions',
    title: 'Generate Practice Questions',
    description: 'Provide varied questions and answers for rapid practice.',
    systemPrompt:
      'You are a practice question generator. Produce 3-5 questions of different difficulty and include answers/explanations.'
  }
];

const AITutorPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTutor, setActiveTutor] = React.useState<typeof tutorModes[number] | null>(null);
  const [chatMessages, setChatMessages] = React.useState<Array<{ role: 'system' | 'user' | 'assistant'; content: string }>>([]);
  const [userInput, setUserInput] = React.useState('');
  const [client, setClient] = React.useState<GoogleGenAI | null>(null);
  const [lastInteractionId, setLastInteractionId] = React.useState<string | null>(null);
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const generateMockResponse = (modeId: string, userMessage: string) => {
    if (modeId === 'doubt-solver') {
      return `Great question! Let's solve this together:\n\n1) Understand what is being asked.\n2) Break it into smaller steps.\n3) Answer with clear reasoning.\n\n(Example applied to: ${userMessage})`;
    }
    if (modeId === 'explain-topic') {
      return `Topic explanation:\n\n- Main idea: ${userMessage}.\n- Why it matters: ...\n- Example: ...\n\nLet me know if you want a deeper example.`;
    }
    if (modeId === 'generate-notes') {
      return `Notes for "${userMessage}":\n\n1. Headline\n2. Key points\n3. Quick summary\n\nUse this structure to revise quickly.`;
    }
    if (modeId === 'generate-questions') {
      return `Practice questions on "${userMessage}":\n\n1. ... (easy)\n2. ... (medium)\n3. ... (hard)\n\nAnswers:\n1) ...\n2) ...\n3) ...`;
    }
    return 'I\'m ready to help!';
  };

  const generateResponse = async (modeId: string, userMessage: string, systemPrompt: string) => {
    if (!geminiApiKey?.trim()) {
      return generateMockResponse(modeId, userMessage);
    }

    if (!client) {
      const newClient = new GoogleGenAI({ apiKey: geminiApiKey.trim() });
      setClient(newClient);
    }

    const currentClient = client || new GoogleGenAI({ apiKey: geminiApiKey.trim() });

    try {
      const input = `${systemPrompt}\n\nUser: ${userMessage}`;
      const interactionParams: any = {
        model: 'gemini-3-flash-preview',
        input: input
      };

      if (lastInteractionId) {
        interactionParams.previous_interaction_id = lastInteractionId;
      }

      const interaction = await currentClient.interactions.create(interactionParams);
      
      if (!interaction.outputs || interaction.outputs.length === 0) {
        return 'No response received from the model.';
      }
      
      const lastOutput = interaction.outputs[interaction.outputs.length - 1];
      if ('text' in lastOutput) {
        const responseText = lastOutput.text;
        setLastInteractionId(interaction.id);
        return responseText;
      } else {
        return 'Response received but not in text format.';
      }
    } catch (error) {
      console.error('GoogleGenAI request failed:', error);
      return 'Sorry, there was an error connecting to GoogleGenAI. Please verify your API key and network connectivity.';
    }
  };

  const openTutor = (mode: typeof tutorModes[number]) => {
    setActiveTutor(mode);
    setChatMessages([
      { role: 'system', content: mode.systemPrompt },
      { role: 'assistant', content: `You switched to ${mode.title}. ${mode.description}` }
    ]);
    setUserInput('');
    setLastInteractionId(null); // Reset conversation for new tutor mode
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTutor || !userInput.trim()) return;

    const userMessage = userInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setUserInput('');

    const response = await generateResponse(activeTutor.id, userMessage, activeTutor.systemPrompt);
    setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <div className="page-container">
      <button 
        onClick={() => navigate('/')} 
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-blue)', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <h2 style={{ marginBottom: '0.75rem' }}>AI Tutor Section</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Select an AI tutoring mode and start a chat.</p>

      <div className="tutor-grid" style={{ marginBottom: '1rem' }}>
        {tutorModes.map((mode) => (
          <div
            key={mode.id}
            className={`subject-card ${activeTutor?.id === mode.id ? 'selected' : ''}`}
            onClick={() => openTutor(mode)}
            style={{ cursor: 'pointer', minHeight: '170px' }}
          >
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.17rem' }}>{mode.title}</h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{mode.description}</p>
          </div>
        ))}
      </div>

      {activeTutor && (
        <div className="tutor-chat" style={{ marginTop: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.75rem' }}>{activeTutor.title} chat</h4>
          <div className="tutor-chat-messages" style={{ maxHeight: '260px', overflowY: 'auto', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '0.75rem', background: 'var(--bg-secondary)' }}>
            {chatMessages.map((msg, index) => (
              <div key={index} style={{ marginBottom: '0.6rem', whiteSpace: 'pre-wrap' }}>
                <strong style={{ color: msg.role === 'assistant' ? 'var(--primary-blue)' : msg.role === 'system' ? 'var(--accent-green)' : 'var(--text-primary)', fontSize: '0.9rem' }}>
                  {msg.role === 'system' ? 'System' : msg.role === 'assistant' ? 'Tutor' : 'You'}:
                </strong>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{msg.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your question or topic..."
              style={{ flex: 1, padding: '0.65rem 0.75rem', borderRadius: '0.6rem', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1rem' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AITutorPage;
