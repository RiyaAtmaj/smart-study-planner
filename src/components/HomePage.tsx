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