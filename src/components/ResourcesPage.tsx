import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, BookOpen, Video, FileText, Globe, HelpCircle } from 'lucide-react';
import { CBSE_RESOURCES, SUBJECTS, CLASSES, RESOURCE_TYPES } from '../data/resources';

const ResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<number | 'All'>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  const filteredResources = useMemo(() => {
    return CBSE_RESOURCES.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSubject = selectedSubject === 'All' || resource.subject === selectedSubject;
      const matchesClass = selectedClass === 'All' || resource.class === selectedClass;
      const matchesType = selectedType === 'All' || resource.type === selectedType;

      return matchesSearch && matchesSubject && matchesClass && matchesType;
    });
  }, [searchTerm, selectedSubject, selectedClass, selectedType]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'pdf': return <FileText size={16} />;
      case 'website': return <Globe size={16} />;
      case 'article': return <BookOpen size={16} />;
      case 'quiz': return <HelpCircle size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return '#ef4444';
      case 'pdf': return '#f59e0b';
      case 'website': return '#10b981';
      case 'article': return '#3b82f6';
      case 'quiz': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>📚 Free Educational Resources</h2>
        <p>Access quality learning materials for CBSE syllabus (Classes 1-10)</p>
      </div>

      {/* Search and Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search resources by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ paddingLeft: '3rem' }}
            />
          </div>

          {/* Filters */}
          <div className="form-row">
            <div className="form-group">
              <label>Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="input"
              >
                <option value="All">All Subjects</option>
                {SUBJECTS.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value === 'All' ? 'All' : parseInt(e.target.value))}
                className="input"
              >
                <option value="All">All Classes</option>
                {CLASSES.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Resource Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input"
              >
                <option value="All">All Types</option>
                {RESOURCE_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        <strong>{filteredResources.length}</strong> resource{filteredResources.length !== 1 ? 's' : ''} found
      </div>

      {/* Resources Grid */}
      <div className="subject-grid">
        {filteredResources.map(resource => (
          <div key={resource.id} className="subject-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: getTypeColor(resource.type)
              }}>
                {getTypeIcon(resource.type)}
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </span>
              </div>
              <span style={{
                fontSize: '0.75rem',
                background: 'var(--bg-secondary)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                color: 'var(--text-secondary)'
              }}>
                Class {resource.class}
              </span>
            </div>

            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
              lineHeight: '1.4'
            }}>
              {resource.title}
            </h3>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              marginBottom: '1rem',
              flex: 1
            }}>
              {resource.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                fontWeight: '500'
              }}>
                {resource.subject} {resource.chapter && `• ${resource.chapter}`}
              </span>
              <span style={{
                fontSize: '0.8rem',
                color: 'var(--primary-blue)',
                fontWeight: '600'
              }}>
                {resource.source}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {resource.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{
                  fontSize: '0.75rem',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem'
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Access Resource
              <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-secondary)'
        }}>
          <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No resources found</h3>
          <p>Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;