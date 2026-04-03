import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, FileText, Users, Send, Clock, Play, Pause } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt: string;
}

interface ChatMessage {
  id: string;
  groupId: string;
  user: string;
  message: string;
  timestamp: string;
}

interface SharedNote {
  id: string;
  groupId: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
}

interface StudySession {
  id: string;
  groupId: string;
  title: string;
  startTime: string;
  endTime?: string;
  participants: string[];
  isActive: boolean;
}

const GroupStudyPage: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'sessions'>('chat');

  // Chat state
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Notes state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [sharedNotes, setSharedNotes] = useState<SharedNote[]>([]);

  // Sessions state
  const [sessionTitle, setSessionTitle] = useState('');
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [currentUser] = useState('You'); // In real app, this would come from auth

  useEffect(() => {
    // Load data from localStorage
    const savedGroups = localStorage.getItem('studyai-groups');
    if (savedGroups) setGroups(JSON.parse(savedGroups));

    const savedMessages = localStorage.getItem('studyai-group-chat');
    if (savedMessages) setChatMessages(JSON.parse(savedMessages));

    const savedNotes = localStorage.getItem('studyai-shared-notes');
    if (savedNotes) setSharedNotes(JSON.parse(savedNotes));

    const savedSessions = localStorage.getItem('studyai-study-sessions');
    if (savedSessions) setStudySessions(JSON.parse(savedSessions));

    // Poll for updates every 5 seconds (simulating real-time)
    const interval = setInterval(() => {
      const updatedMessages = localStorage.getItem('studyai-group-chat');
      if (updatedMessages) setChatMessages(JSON.parse(updatedMessages));

      const updatedNotes = localStorage.getItem('studyai-shared-notes');
      if (updatedNotes) setSharedNotes(JSON.parse(updatedNotes));

      const updatedSessions = localStorage.getItem('studyai-study-sessions');
      if (updatedSessions) setStudySessions(JSON.parse(updatedSessions));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const createGroup = () => {
    const cleaned = groupName.trim();
    if (!cleaned) return;
    const newGroup: Group = {
      id: Date.now().toString(),
      name: cleaned,
      members: [currentUser],
      createdAt: new Date().toISOString()
    };
    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    localStorage.setItem('studyai-groups', JSON.stringify(updatedGroups));
    setGroupName('');
  };

  const sendMessage = () => {
    if (!selectedGroup || !chatMessage.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      groupId: selectedGroup,
      user: currentUser,
      message: chatMessage,
      timestamp: new Date().toISOString()
    };
    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    localStorage.setItem('studyai-group-chat', JSON.stringify(updatedMessages));
    setChatMessage('');
  };

  const shareNote = () => {
    if (!selectedGroup || !noteTitle.trim() || !noteContent.trim()) return;
    const newNote: SharedNote = {
      id: Date.now().toString(),
      groupId: selectedGroup,
      title: noteTitle,
      content: noteContent,
      author: currentUser,
      timestamp: new Date().toISOString()
    };
    const updatedNotes = [...sharedNotes, newNote];
    setSharedNotes(updatedNotes);
    localStorage.setItem('studyai-shared-notes', JSON.stringify(updatedNotes));
    setNoteTitle('');
    setNoteContent('');
  };

  const startStudySession = () => {
    if (!selectedGroup || !sessionTitle.trim()) return;
    const newSession: StudySession = {
      id: Date.now().toString(),
      groupId: selectedGroup,
      title: sessionTitle,
      startTime: new Date().toISOString(),
      participants: [currentUser],
      isActive: true
    };
    const updatedSessions = [...studySessions, newSession];
    setStudySessions(updatedSessions);
    localStorage.setItem('studyai-study-sessions', JSON.stringify(updatedSessions));
    setSessionTitle('');
  };

  const endStudySession = (sessionId: string) => {
    const updatedSessions = studySessions.map(session =>
      session.id === sessionId
        ? { ...session, endTime: new Date().toISOString(), isActive: false }
        : session
    );
    setStudySessions(updatedSessions);
    localStorage.setItem('studyai-study-sessions', JSON.stringify(updatedSessions));
  };

  const activeGroup = groups.find(g => g.id === selectedGroup);
  const groupMessages = chatMessages.filter(m => m.groupId === selectedGroup);
  const groupNotes = sharedNotes.filter(n => n.groupId === selectedGroup);
  const groupSessions = studySessions.filter(s => s.groupId === selectedGroup);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-6xl mx-auto p-4">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-blue)' }}>
          <ArrowLeft size={18} /> Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6" style={{ border: '1px solid var(--border-light)' }}>
          <h1 className="text-3xl font-bold mb-2">👥 Collaborative Study</h1>
          <p className="text-gray-600">Real-time group chat, shared notes, and live study sessions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Groups Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4" style={{ border: '1px solid var(--border-light)' }}>
              <h3 className="text-lg font-semibold mb-4">Create Group</h3>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group name"
                className="w-full p-2 border rounded mb-2"
              />
              <button
                onClick={createGroup}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Group
              </button>

              <h4 className="text-lg font-semibold mt-6 mb-4">Your Groups</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {groups.length === 0 ? (
                  <p className="text-gray-500 text-sm">No groups yet</p>
                ) : (
                  groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedGroup === group.id
                          ? 'bg-blue-100 border-2 border-blue-300'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="font-medium">{group.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Users size={14} />
                        {group.members.length} members
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {!activeGroup ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center" style={{ border: '1px solid var(--border-light)' }}>
                <Users size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Select a Group</h3>
                <p className="text-gray-600">Choose a study group to start collaborating</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid var(--border-light)' }}>
                {/* Group Header */}
                <div className="p-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                  <h2 className="text-xl font-bold">{activeGroup.name}</h2>
                  <p className="text-gray-600">{activeGroup.members.length} members</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b" style={{ borderColor: 'var(--border-light)' }}>
                  {[
                    { id: 'chat', label: 'Chat', icon: MessageCircle },
                    { id: 'notes', label: 'Shared Notes', icon: FileText },
                    { id: 'sessions', label: 'Study Sessions', icon: Clock }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      className={`flex-1 p-3 flex items-center justify-center gap-2 font-medium transition-colors ${
                        activeTab === id
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  {activeTab === 'chat' && (
                    <div className="space-y-4">
                      <div className="h-64 overflow-y-auto border rounded p-3 space-y-3" style={{ borderColor: 'var(--border-light)' }}>
                        {groupMessages.length === 0 ? (
                          <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
                        ) : (
                          groupMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.user === currentUser ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs px-3 py-2 rounded-lg ${
                                msg.user === currentUser
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                <div className="text-xs opacity-75 mb-1">{msg.user}</div>
                                <div>{msg.message}</div>
                                <div className="text-xs opacity-75 mt-1">
                                  {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 p-2 border rounded"
                        />
                        <button
                          onClick={sendMessage}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                          placeholder="Note title"
                          className="w-full p-2 border rounded"
                        />
                        <textarea
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="Share your notes with the group..."
                          className="w-full p-2 border rounded h-24"
                        />
                        <button
                          onClick={shareNote}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Share Note
                        </button>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {groupNotes.length === 0 ? (
                          <p className="text-gray-500 text-center">No shared notes yet</p>
                        ) : (
                          groupNotes.map((note) => (
                            <div key={note.id} className="border rounded p-3" style={{ borderColor: 'var(--border-light)' }}>
                              <h4 className="font-semibold">{note.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">By {note.author}</p>
                              <p className="text-gray-700">{note.content}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(note.timestamp).toLocaleString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'sessions' && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={sessionTitle}
                          onChange={(e) => setSessionTitle(e.target.value)}
                          placeholder="Session title"
                          className="flex-1 p-2 border rounded"
                        />
                        <button
                          onClick={startStudySession}
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          <Play size={18} className="inline mr-1" />
                          Start Session
                        </button>
                      </div>

                      <div className="space-y-3">
                        {groupSessions.length === 0 ? (
                          <p className="text-gray-500 text-center">No study sessions yet</p>
                        ) : (
                          groupSessions.map((session) => (
                            <div key={session.id} className="border rounded p-3" style={{ borderColor: 'var(--border-light)' }}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">{session.title}</h4>
                                  <p className="text-sm text-gray-600">
                                    Started: {new Date(session.startTime).toLocaleString()}
                                  </p>
                                  {session.endTime && (
                                    <p className="text-sm text-gray-600">
                                      Ended: {new Date(session.endTime).toLocaleString()}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-600">
                                    Participants: {session.participants.join(', ')}
                                  </p>
                                </div>
                                <div>
                                  {session.isActive ? (
                                    <button
                                      onClick={() => endStudySession(session.id)}
                                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                    >
                                      <Pause size={14} className="inline mr-1" />
                                      End
                                    </button>
                                  ) : (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                                      Completed
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupStudyPage;
