import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Heading from '@tiptap/extension-heading';
import { getNotes, createNote, updateNote, deleteNoteApi } from '../api';

const lowlight = createLowlight(common);

const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const [savedNotes, setSavedNotes] = React.useState<Array<{ id: string; title: string; content: string; tags: string[]; createdAt: Date }>>([]);
  const [selectedNote, setSelectedNote] = React.useState<string | null>(null);
  const [noteTitle, setNoteTitle] = React.useState('');
  const [noteTags, setNoteTags] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Heading.configure({ levels: [1, 2, 3] }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: '',
  });

  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await getNotes();
      setSavedNotes(notes);
    };

    fetchNotes();
  }, []);

  const saveNote = async () => {
    const content = editor?.getHTML() || '';
    const title = noteTitle.trim() || 'Untitled Note';
    const tags = noteTags.split(',').map((tag) => tag.trim()).filter(Boolean);

    if (!content.trim()) return;

    try {
      if (selectedNote) {
        const updated = await updateNote(selectedNote, { title, content, tags });
        if (updated) {
          setSavedNotes((prev) => prev.map((note) => (note.id === selectedNote ? updated : note)));
          setSelectedNote(updated.id);
          alert('Note updated successfully!');
        } else {
          alert('Failed to update note. Please check if the backend is running.');
        }
      } else {
        const created = await createNote({ title, content, tags });
        if (created) {
          setSavedNotes((prev) => [created, ...prev]);
          setSelectedNote(created.id);
          alert('Note saved successfully!');
          // Clear for new note
          setNoteTitle('');
          setNoteTags('');
          editor?.commands.setContent('');
        } else {
          alert('Failed to save note. Please check if the backend is running.');
        }
      }
    } catch (error) {
      alert('Error saving note: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const selectNote = (noteId: string) => {
    const note = savedNotes.find((n) => n.id === noteId);
    if (note) {
      setSelectedNote(noteId);
      setNoteTitle(note.title);
      setNoteTags(note.tags.join(', '));
      editor?.commands.setContent(note.content);
    }
  };

  const deleteNote = async (noteId: string) => {
    const success = await deleteNoteApi(noteId);
    if (!success) return;

    setSavedNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (selectedNote === noteId) {
      setSelectedNote(null);
      setNoteTitle('');
      setNoteTags('');
      editor?.commands.setContent('');
    }
  };

  const newNote = () => {
    setSelectedNote(null);
    setNoteTitle('');
    setNoteTags('');
    editor?.commands.setContent('');
  };

  const filteredNotes = savedNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportNote = () => {
    if (!selectedNote) return;
    const note = savedNotes.find(n => n.id === selectedNote);
    if (!note) return;
    const markdown = `# ${note.title}\n\n${note.content.replace(/<[^>]*>/g, '')}\n\nTags: ${note.tags.join(', ')}`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      <button 
        onClick={() => navigate('/')} 
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-blue)', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <h2 style={{ marginBottom: '0.75rem' }}>Notes Section</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Create, edit, and manage rich text notes with optional code highlighting.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 250px', gap: '1rem', minHeight: '500px' }}>
        <div style={{ border: '1px solid var(--border-light)', borderRadius: '0.75rem', padding: '1rem', background: 'var(--bg-secondary)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>Notes</h4>
            <button onClick={newNote} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>New</button>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {filteredNotes.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', margin: '2rem 0' }}>No notes found.</p>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => selectNote(note.id)}
                  style={{ padding: '0.75rem', marginBottom: '0.5rem', borderRadius: '0.5rem', background: selectedNote === note.id ? 'var(--primary-blue)' : 'var(--bg-primary)', color: selectedNote === note.id ? 'white' : 'var(--text-primary)', cursor: 'pointer', border: '1px solid var(--border-light)' }}
                >
                  <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: '600' }}>{note.title}</h5>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>{new Date(note.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ border: '1px solid var(--border-light)', borderRadius: '0.75rem', padding: '1rem', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note title..."
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}
            />
            <input
              type="text"
              value={noteTags}
              onChange={(e) => setNoteTags(e.target.value)}
              placeholder="Tags (comma separated)..."
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            <button onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'btn btn-primary' : 'btn'} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>B</button>
            <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'btn btn-primary' : 'btn'} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>I</button>
            <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={editor?.isActive('underline') ? 'btn btn-primary' : 'btn'} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>U</button>
            <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={editor?.isActive('heading', { level: 1 }) ? 'btn btn-primary' : 'btn'} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>H1</button>
            <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'btn btn-primary' : 'btn'} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>H2</button>
            <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'btn btn-primary' : 'btn'} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>•</button>
            <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'btn btn-primary' : 'btn'} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>1.</button>
            <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()} className={editor?.isActive('codeBlock') ? 'btn btn-primary' : 'btn'} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>Code</button>
          </div>

          <div style={{ flex: 1, border: '1px solid var(--border-light)', borderRadius: '0.75rem', padding: '0.75rem', background: 'var(--bg-primary)', minHeight: '260px' }}>
            {editor ? <EditorContent editor={editor} /> : <div>Loading editor...</div>}
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button onClick={saveNote} className="btn btn-primary" style={{ padding: '0.5rem 0.8rem' }}>Save Note</button>
            <button onClick={() => deleteNote(selectedNote || '')} className="btn" style={{ padding: '0.5rem 0.8rem' }}>Delete</button>
          </div>
        </div>

        <div style={{ border: '1px solid var(--border-light)', borderRadius: '0.75rem', padding: '1rem', background: 'var(--bg-secondary)' }}>
          <h4 style={{ marginBottom: '0.75rem' }}>Preview / Actions</h4>
          {selectedNote ? (
            <>
              <p style={{ marginBottom: '0.5rem' }}><strong>Title:</strong> {noteTitle}</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>Tags:</strong> {noteTags}</p>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Actions:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button onClick={exportNote} className="btn btn-primary" style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>Export as Markdown</button>
                </div>
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Select a note to preview details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
