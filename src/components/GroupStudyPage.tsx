import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const GroupStudyPage: React.FC = () => {
  const [groupName, setGroupName] = React.useState('');
  const [groups, setGroups] = React.useState<Array<{ id: string; name: string; members: string[] }>>([]);
  const [memberInput, setMemberInput] = React.useState('');
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);

  const createGroup = () => {
    const cleaned = groupName.trim();
    if (!cleaned) return;
    const newGroup = { id: Date.now().toString(), name: cleaned, members: [] };
    setGroups((prev) => [...prev, newGroup]);
    setGroupName('');
  };

  const addMember = () => {
    if (!selectedGroup) return;
    const member = memberInput.trim();
    if (!member) return;
    setGroups((prev) => prev.map((g) => (g.id === selectedGroup ? { ...g, members: [...g.members, member] } : g)));
    setMemberInput('');
  };

  const active = groups.find((g) => g.id === selectedGroup);

  return (
    <div className="page-container">
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-blue)' }}>
        <ArrowLeft size={18} /> Back to Home
      </Link>

      <h2 style={{ marginBottom: '0.75rem' }}>Group Study Section</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Create study groups, invite members, and collaborate on shared goals.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <h3>Create a New Group</h3>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}
          />
          <button className="btn btn-primary" onClick={createGroup}>Create Group</button>

          <h4 style={{ marginTop: '1rem' }}>Groups</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {groups.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No groups yet.</p>
            ) : (
              groups.map((g) => (
                <div key={g.id} style={{ marginBottom: '0.5rem' }}>
                  <button
                    className="btn"
                    style={{ width: '100%', textAlign: 'left' }}
                    onClick={() => setSelectedGroup(g.id)}
                  >
                    {g.name}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h3>Group Details</h3>
          {!active ? (
            <p style={{ color: 'var(--text-secondary)' }}>Select a group to manage members.</p>
          ) : (
            <>
              <p><strong>Name:</strong> {active.name}</p>
              <p><strong>Members:</strong> {active.members.length}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="text"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  placeholder="Member name"
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}
                />
                <button className="btn btn-primary" onClick={addMember}>Add</button>
              </div>
              <ul style={{ marginTop: '1rem' }}>
                {active.members.map((member, idx) => (
                  <li key={idx}>{member}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupStudyPage;
