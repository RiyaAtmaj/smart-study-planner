import { ref, onValue, set, push, update, remove, get } from 'firebase/database';
import { database } from '../firebase';

export interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  user: string;
  message: string;
  timestamp: string;
}

export interface SharedNote {
  id: string;
  groupId: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
}

export interface StudySession {
  id: string;
  groupId: string;
  title: string;
  startTime: string;
  endTime?: string;
  participants: string[];
  isActive: boolean;
}

class FirebaseService {
  // Groups
  async createGroup(group: Omit<Group, 'id'>): Promise<string> {
    const groupsRef = ref(database, 'groups');
    const newGroupRef = push(groupsRef);
    await set(newGroupRef, group);
    return newGroupRef.key!;
  }

  async updateGroup(groupId: string, updates: Partial<Group>): Promise<void> {
    const groupRef = ref(database, `groups/${groupId}`);
    await update(groupRef, updates);
  }

  async deleteGroup(groupId: string): Promise<void> {
    const groupRef = ref(database, `groups/${groupId}`);
    await remove(groupRef);
  }

  subscribeToGroups(callback: (groups: Group[]) => void): () => void {
    const groupsRef = ref(database, 'groups');
    const unsubscribe = onValue(groupsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const groups = Object.entries(data).map(([id, group]: [string, any]) => ({
          id,
          ...group
        }));
        callback(groups);
      } else {
        callback([]);
      }
    });
    return unsubscribe;
  }

  // Chat Messages
  async sendMessage(message: Omit<ChatMessage, 'id'>): Promise<string> {
    const messagesRef = ref(database, `messages/${message.groupId}`);
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, message);
    return newMessageRef.key!;
  }

  subscribeToMessages(groupId: string, callback: (messages: ChatMessage[]) => void): () => void {
    const messagesRef = ref(database, `messages/${groupId}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = Object.entries(data).map(([id, message]: [string, any]) => ({
          id,
          ...message
        }));
        callback(messages);
      } else {
        callback([]);
      }
    });
    return unsubscribe;
  }

  // Shared Notes
  async shareNote(note: Omit<SharedNote, 'id'>): Promise<string> {
    const notesRef = ref(database, `notes/${note.groupId}`);
    const newNoteRef = push(notesRef);
    await set(newNoteRef, note);
    return newNoteRef.key!;
  }

  subscribeToNotes(groupId: string, callback: (notes: SharedNote[]) => void): () => void {
    const notesRef = ref(database, `notes/${groupId}`);
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notes = Object.entries(data).map(([id, note]: [string, any]) => ({
          id,
          ...note
        }));
        callback(notes);
      } else {
        callback([]);
      }
    });
    return unsubscribe;
  }

  // Study Sessions
  async createStudySession(session: Omit<StudySession, 'id'>): Promise<string> {
    const sessionsRef = ref(database, `sessions/${session.groupId}`);
    const newSessionRef = push(sessionsRef);
    await set(newSessionRef, session);
    return newSessionRef.key!;
  }

  async updateStudySession(groupId: string, sessionId: string, updates: Partial<StudySession>): Promise<void> {
    const sessionRef = ref(database, `sessions/${groupId}/${sessionId}`);
    await update(sessionRef, updates);
  }

  subscribeToStudySessions(groupId: string, callback: (sessions: StudySession[]) => void): () => void {
    const sessionsRef = ref(database, `sessions/${groupId}`);
    const unsubscribe = onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sessions = Object.entries(data).map(([id, session]: [string, any]) => ({
          id,
          ...session
        }));
        callback(sessions);
      } else {
        callback([]);
      }
    });
    return unsubscribe;
  }

  // User Management
  async getUserProfile(userId: string): Promise<any> {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  }

  async updateUserProfile(userId: string, profile: any): Promise<void> {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, profile);
  }
}

export const firebaseService = new FirebaseService();