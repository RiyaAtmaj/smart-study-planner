import React, { useState, useEffect, useMemo } from 'react';
import { Search, ExternalLink, BookOpen, Video, FileText, Globe, HelpCircle, Download, Eye, Wifi, WifiOff, Trash2 } from 'lucide-react';
import { CBSE_RESOURCES, SUBJECTS, CLASSES, RESOURCE_TYPES } from '../data/resources';
import { offlineStorage, downloadResource, isOnline, onNetworkChange } from '../offlineStorage';

const ResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<number | 'All'>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [offlineResources, setOfflineResources] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState<Set<string>>(new Set());
  const [online, setOnline] = useState(isOnline());
  const [storageUsage, setStorageUsage] = useState({ used: 0, available: 0 });

  // Load offline resources and storage info on mount
  useEffect(() => {
    const loadOfflineData = async () => {
      try {
        const resources = await offlineStorage.getAllOfflineResources();
        setOfflineResources(new Set(resources.map(r => r.id)));
        const usage = await offlineStorage.getStorageUsage();
        setStorageUsage(usage);
      } catch (error) {
        console.error('Failed to load offline data:', error);
      }
    };

    loadOfflineData();

    // Listen for network changes
    const cleanup = onNetworkChange(setOnline);
    return cleanup;
  }, []);

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

  const handleDownload = async (resource: any) => {
    if (!online) {
      alert('You need to be online to download resources.');
      return;
    }

    setDownloading(prev => new Set(prev).add(resource.id));

    try {
      const content = await downloadResource(resource);
      await offlineStorage.storeResource(resource, content);
      setOfflineResources(prev => new Set(prev).add(resource.id));

      // Update storage usage
      const usage = await offlineStorage.getStorageUsage();
      setStorageUsage(usage);
    } catch (error) {
      console.error('Failed to download resource:', error);
      alert('Failed to download resource. Please try again.');
    } finally {
      setDownloading(prev => {
        const newSet = new Set(prev);
        newSet.delete(resource.id);
        return newSet;
      });
    }
  };

  const handleViewOffline = (resource: any) => {
    // Create a blob URL for the offline content
    const showOfflineContent = async () => {
      try {
        const offlineResource = await offlineStorage.getResource(resource.id);
        if (offlineResource) {
          const blob = new Blob([offlineResource.content], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        }
      } catch (error) {
        console.error('Failed to load offline content:', error);
        alert('Failed to load offline content.');
      }
    };
    showOfflineContent();
  };

  const handleRemoveOffline = async (resourceId: string) => {
    try {
      await offlineStorage.removeResource(resourceId);
      setOfflineResources(prev => {
        const newSet = new Set(prev);
        newSet.delete(resourceId);
        return newSet;
      });

      // Update storage usage
      const usage = await offlineStorage.getStorageUsage();
      setStorageUsage(usage);
    } catch (error) {
      console.error('Failed to remove offline resource:', error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2>📚 Free Educational Resources</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {online ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                <Wifi size={16} />
                <span style={{ fontSize: '0.875rem' }}>Online</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                <WifiOff size={16} />
                <span style={{ fontSize: '0.875rem' }}>Offline</span>
              </div>
            )}
          </div>
        </div>
        <p>Access quality learning materials for CBSE syllabus (Classes 1-10)</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <span>📁 Offline storage: {formatBytes(storageUsage.used)} used</span>
          {storageUsage.available > 0 && (
            <span>• {formatBytes(storageUsage.available)} available</span>
          )}
        </div>
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
              {offlineResources.has(resource.id) && (
                <span style={{
                  fontSize: '0.75rem',
                  background: '#d1fae5',
                  color: '#065f46',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <Download size={12} />
                  Offline
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
              {online && !offlineResources.has(resource.id) && !downloading.has(resource.id) && (
                <button
                  onClick={() => handleDownload(resource)}
                  className="btn"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <Download size={16} />
                  Download for Offline
                </button>
              )}

              {downloading.has(resource.id) && (
                <button
                  disabled
                  className="btn"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: 'var(--primary-blue)',
                    opacity: 0.7
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Downloading...
                </button>
              )}

              {offlineResources.has(resource.id) && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleViewOffline(resource)}
                    className="btn"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: '#10b981'
                    }}
                  >
                    <Eye size={16} />
                    View Offline
                  </button>
                  <button
                    onClick={() => handleRemoveOffline(resource.id)}
                    className="btn"
                    style={{
                      padding: '0.75rem',
                      background: '#ef4444',
                      border: 'none',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Remove offline content"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  opacity: online ? 1 : 0.5
                }}
              >
                {online ? 'Access Online' : 'Offline Only'}
                <ExternalLink size={16} />
              </a>
            </div>
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