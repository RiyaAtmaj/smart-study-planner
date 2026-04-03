import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Library, ArrowRight, Star, Users, Award, FileText } from 'lucide-react';

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
    },
    {
      icon: <Users size={32} />,
      title: 'Group Study Section',
      description: 'Join and create study groups, collaborate with friends, and track team progress',
      link: '/group-study',
      color: 'var(--accent-purple)'
    },
    {
      icon: <Star size={32} />,
      title: 'AI Tutor Section',
      description: 'Ask the AI tutor questions, get explanations, and generate notes instantly',
      link: '/ai-tutor',
      color: 'var(--accent-orange)'
    },
    {
      icon: <FileText size={32} />,
      title: 'Notes Section',
      description: 'Create and manage your notes with rich text editing and syntax highlighting.',
      link: '/notes',
      color: 'var(--accent-blue)'
    }
  ];

  const stats = [
    { label: 'Subjects Covered', value: '8+', icon: <BookOpen size={20} /> },
    { label: 'CBSE Classes', value: '1-10', icon: <Users size={20} /> },
    { label: 'Free Resources', value: '100+', icon: <Star size={20} /> },
    { label: 'Study Plans', value: 'AI-Powered', icon: <Award size={20} /> }
  ];

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="subject-card" style={{ padding: '1rem', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{stat.icon}<strong>{stat.value}</strong></div>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{stat.label}</p>
          </div>
        ))}
      </div>
      {/* Section cards are above; detailed functionality lives in other pages. */}
    </div>
  );
};

export default HomePage;
