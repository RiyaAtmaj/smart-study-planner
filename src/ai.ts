import { Subject, StudyPlan, Session } from './types';
import { addDays } from 'date-fns';

export const generateStudyPlan = (
  subjects: Subject[],
  examDate: Date,
  duration: 7 | 30
): StudyPlan => {
  const enabledSubjects = subjects.filter(s => s.enabled);
  const sessions: Session[] = [];
  const planId = `plan-${Date.now()}`;

  // Calculate start date (today)
  const startDate = new Date();

  // Revision days
  const revisionDays = duration === 30 ? [7, 14, 21, 28] : [7];

  // Generate sessions for each day
  for (let day = 1; day <= duration; day++) {
    const currentDate = addDays(startDate, day - 1);
    const isRevisionDay = revisionDays.includes(day);

    if (isRevisionDay) {
      // Revision day - lighter load
      const revisionSessions = generateRevisionSessions(enabledSubjects, day, currentDate);
      sessions.push(...revisionSessions);
    } else {
      // Regular study day
      const studySessions = generateStudySessions(enabledSubjects, day, currentDate);
      sessions.push(...studySessions);
    }
  }

  return {
    id: planId,
    examDate,
    duration,
    sessions,
    createdAt: new Date(),
  };
};

const generateStudySessions = (
  subjects: Subject[],
  day: number,
  date: Date
): Session[] => {
  const sessions: Session[] = [];
  let sessionCount = 0;
  const maxSessions = 4;

  // Sort subjects by difficulty (harder first)
  const sortedSubjects = [...subjects].sort((a, b) => b.difficulty - a.difficulty);

  for (const subject of sortedSubjects) {
    if (sessionCount >= maxSessions) break;

    const enabledTopics = subject.topics.filter(t => t.enabled);
    if (enabledTopics.length === 0) continue;

    // Calculate how many sessions this subject should get based on difficulty
    const sessionsForSubject = Math.min(
      Math.ceil(subject.difficulty / 2),
      maxSessions - sessionCount
    );

    for (let i = 0; i < sessionsForSubject && sessionCount < maxSessions; i++) {
      const topicIndex = i % enabledTopics.length;
      const topic = enabledTopics[topicIndex];

      const duration = subject.difficulty >= 4 ? 90 : subject.difficulty >= 3 ? 75 : 60;

      sessions.push({
        id: `session-${day}-${subject.id}-${topic.id}-${i}`,
        subjectId: subject.id,
        topicId: topic.id,
        type: 'study',
        status: 'pending',
        duration,
        difficulty: subject.difficulty,
        day,
        scheduledDate: date,
      });

      sessionCount++;
    }
  }

  return sessions;
};

const generateRevisionSessions = (
  subjects: Subject[],
  day: number,
  date: Date
): Session[] => {
  const sessions: Session[] = [];
  let sessionCount = 0;
  const maxSessions = 3;

  // Get all topics from enabled subjects
  const allTopics: Array<{ subject: Subject; topic: any }> = [];
  subjects.forEach(subject => {
    subject.topics.filter(t => t.enabled).forEach(topic => {
      allTopics.push({ subject, topic });
    });
  });

  // Shuffle and take some for revision
  const shuffledTopics = allTopics.sort(() => Math.random() - 0.5);
  const revisionTopics = shuffledTopics.slice(0, maxSessions);

  for (const { subject, topic } of revisionTopics) {
    const duration = Math.floor((subject.difficulty >= 4 ? 90 : subject.difficulty >= 3 ? 75 : 60) * 0.6);

    sessions.push({
      id: `revision-${day}-${subject.id}-${topic.id}`,
      subjectId: subject.id,
      topicId: topic.id,
      type: 'revision',
      status: 'pending',
      duration,
      difficulty: subject.difficulty,
      day,
      scheduledDate: date,
    });

    sessionCount++;
  }

  return sessions;
};

export const addAdaptiveSessions = (
  existingSessions: Session[],
  sessionId: string,
  status: 'difficult' | 'missed',
  examDate: Date
): Session[] => {
  const session = existingSessions.find(s => s.id === sessionId);
  if (!session) return existingSessions;

  const newSessions: Session[] = [];
  const intervals = status === 'difficult' ? [1, 3, 7] : [1, 4, 8];
  const duration = Math.floor(session.duration * 0.6); // 60% of original

  for (const interval of intervals) {
    const revisionDate = addDays(session.scheduledDate, interval);

    // Don't schedule beyond exam date
    if (revisionDate >= examDate) continue;

    // Check if we already have a revision for this topic on this day
    const existingRevision = existingSessions.find(
      s => s.day === session.day + interval &&
           s.subjectId === session.subjectId &&
           s.topicId === session.topicId &&
           s.type === 'revision'
    );

    if (!existingRevision) {
      // Count sessions on this day
      const sessionsOnDay = existingSessions.filter(s => s.day === session.day + interval).length;
      if (sessionsOnDay < 5) { // Max 5 sessions per day
        newSessions.push({
          id: `adaptive-${status}-${session.id}-${interval}`,
          subjectId: session.subjectId,
          topicId: session.topicId,
          type: 'revision',
          status: 'pending',
          duration,
          difficulty: session.difficulty,
          day: session.day + interval,
          scheduledDate: revisionDate,
          originalSessionId: session.id,
        });
      }
    }
  }

  return [...existingSessions, ...newSessions];
};