import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Library, ArrowRight, Star, Users, Award } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <BookOpen size={32} />,
      title: 'Smart Study Planner',
      description: 'AI-powered study plans tailored to your schedule and learning style',
      link: '/subjects',
      color: 'var(--primary-blue)'
    },
    {
      icon: <Library size={32} />,
      title: 'Free Educational Resources',
      description: 'Access quality CBSE learning materials for all subjects and classes',
      link: '/resources',
      color: 'var(--accent-green)'
    }
  ];

  const stats = [
    { label: 'Subjects Covered', value: '8+', icon: <BookOpen size={20} /> },
    { label: 'CBSE Classes', value: '1-10', icon: <Users size={20} /> },
    { label: 'Free Resources', value: '100+', icon: <Star size={20} /> },
    { label: 'Study Plans', value: 'AI-Powered', icon: <Award size={20} /> }
  ];

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

  const [activeTutor, setActiveTutor] = React.useState<typeof tutorModes[number] | null>(null);
  const [chatMessages, setChatMessages] = React.useState<Array<{role: 'system' | 'user' | 'assistant'; content: string}>>([]);
  const [userInput, setUserInput] = React.useState('');
  const [noteText, setNoteText] = React.useState('');
  const [savedNotes, setSavedNotes] = React.useState<string[]>([]);

  const generateMockResponse = (modeId: string, userMessage: string) => {
    if (modeId === 'doubt-solver') {
      return `Great question! Let\'s solve this together:\n\n1) Understand what is being asked.\n2) Break it into smaller steps.\n3) Answer with clear reasoning.\n\n(Example applied to: ${userMessage})`;
    }
    if (modeId === 'explain-topic') {
      return `Topic explanation:\n\n- Main idea: ${userMessage}.\n- Why it matters: ...\n- Example: ...\n\nLet me know if you want a deeper example.`;
    }
    if (modeId === 'generate-notes') {
      return `Notes for “${userMessage}”:\n\n1. Headline\n2. Key points\n3. Quick summary\n\nUse this structure to revise quickly.`;
    }
    if (modeId === 'generate-questions') {
      return `Practice questions on “${userMessage}”:\n\n1. ... (easy)\n2. ... (medium)\n3. ... (hard)\n\nAnswers:\n1) ...\n2) ...\n3) ...`;
    }
    return 'I\'m ready to help!';
  };

  const openTutor = (mode: typeof tutorModes[number]) => {
    setActiveTutor(mode);
    setChatMessages([
      { role: 'system', content: mode.systemPrompt },
      { role: 'assistant', content: `You switched to ${mode.title}. ${mode.description}` }
    ]);
    setUserInput('');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTutor || !userInput.trim()) return;

    const userMessage = userInput.trim();

    const nextMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      ...chatMessages,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: generateMockResponse(activeTutor.id, userMessage) }
    ];

    setChatMessages(nextMessages);
    setUserInput('');
  };


  return (
    <div className="page-container">
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '2rem 0'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          letterSpacing: '-0.025em'
        }}>
          🎓 Welcome to StudyAI Planner
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Your intelligent companion for academic success. Create personalized study plans
          and access free educational resources for CBSE syllabus.
        </p>
      </div>

      {/* Feature Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            style={{ textDecoration: 'none' }}
          >
            <div className="subject-card" style={{
              height: '100%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid transparent'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  color: feature.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5'
                  }}>
                    {feature.description}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 'auto'
              }}>
                <span style={{
                  color: feature.color,
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  Get Started
                </span>
                <ArrowRight size={20} style={{ color: feature.color }} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* AI Tutor Section */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>🤖 AI Tutor Section</h3>

          {activeTutor && (
            <button
              onClick={() => setActiveTutor(null)}
              style={{ background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '0.6rem', padding: '0.45rem 0.8rem', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              Close Chat
            </button>
          )}
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Structured AI workflow cards are built for judges and users. Tap a card to start a focused AI chat session with a pre-loaded system instruction.
        </p>

        <div className="tutor-grid">
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

      {/* Notes Section */}
      <div className="card note-section" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>📝 Notes Section</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Write quick notes and save them in this session for easy review.</p>

        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Type your note here..."
          style={{ width: '100%', minHeight: '120px', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'vertical' }}
        />

        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => {
              const trimmed = noteText.trim();
              if (!trimmed) return;
              setSavedNotes((prev) => [trimmed, ...prev]);
              setNoteText('');
            }}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1rem' }}
          >
            Save
          </button>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{savedNotes.length} saved note{savedNotes.length === 1 ? '' : 's'}</span>
        </div>

        {savedNotes.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
            {savedNotes.map((note, idx) => (
              <div key={`${note}-${idx}`} style={{ background: 'var(--bg-secondary)', border: '1px dashed var(--border-light)', borderRadius: '0.65rem', padding: '0.75rem' }}>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{note}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="card" style={{ marginBottom: '3rem' }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          📊 Why Choose StudyAI Planner?
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: 'var(--bg-secondary)',
              borderRadius: '0.75rem'
            }}>
              <div style={{
                color: 'var(--primary-blue)',
                marginBottom: '0.5rem'
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                marginBottom: '0.25rem'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Link to="/subjects" className="btn btn-primary" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          textDecoration: 'none'
        }}>
          <Calendar size={20} />
          Create Study Plan
        </Link>

        <Link to="/resources" className="btn btn-secondary" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          textDecoration: 'none'
        }}>
          <Library size={20} />
          Browse Resources
        </Link>
      </div>
    </div>
  );
};

export default HomePage;