import { 
  RetroSession, 
  RetroNote, 
  RetroTemplate, 
  RetroSessionSettings,
  RetroActionItem,
  RetroParticipant,
  RetroPhase
} from '../../types';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';

class RetroService {
  private templates: RetroTemplate[] = [
    {
      id: 'standard',
      name: 'Standard Retrospective',
      description: 'Classic What Went Well, What Could Improve, Action Items format',
      categories: [
        {
          id: 'whatWentWell',
          title: 'What Went Well',
          description: 'Things that worked well this sprint',
          icon: '👍'
        },
        {
          id: 'whatCouldImprove',
          title: 'What Could Be Improved',
          description: 'Areas for improvement',
          icon: '💡'
        },
        {
          id: 'actionItems',
          title: 'Action Items',
          description: 'Concrete next steps',
          icon: '🎯'
        }
      ],
      defaultSettings: {
        allowAnonymous: true,
        allowPrivateNotes: false,
        enableVoting: true,
        maxVotesPerUser: 5,
        timerEnabled: true,
        phaseDurations: {
          brainstorming: 15,
          voting: 5,
          discussion: 20,
          actionPlanning: 10,
          completed: 0
        },
        enableGrouping: true,
        autoAdvancePhases: false
      }
    },
    {
      id: 'startStopContinue',
      name: 'Start-Stop-Continue',
      description: 'Focus on what to start, stop, and continue doing',
      categories: [
        {
          id: 'start',
          title: 'Start',
          description: 'New things to start doing',
          icon: '🚀'
        },
        {
          id: 'stop',
          title: 'Stop',
          description: 'Things to stop doing',
          icon: '🛑'
        },
        {
          id: 'continue',
          title: 'Continue',
          description: 'Things to keep doing',
          icon: '✅'
        }
      ],
      defaultSettings: {
        allowAnonymous: true,
        allowPrivateNotes: false,
        enableVoting: true,
        maxVotesPerUser: 3,
        timerEnabled: true,
        phaseDurations: {
          brainstorming: 20,
          voting: 5,
          discussion: 15,
          actionPlanning: 10,
          completed: 0
        },
        enableGrouping: true,
        autoAdvancePhases: false
      }
    },
    {
      id: '4Ls',
      name: '4 Ls (Liked, Learned, Lacked, Longed For)',
      description: 'Comprehensive feedback covering all aspects',
      categories: [
        {
          id: 'liked',
          title: 'Liked',
          description: 'What you liked about this sprint',
          icon: '❤️'
        },
        {
          id: 'learned',
          title: 'Learned',
          description: 'What you learned',
          icon: '🧠'
        },
        {
          id: 'lacked',
          title: 'Lacked',
          description: 'What was missing or could be better',
          icon: '❌'
        },
        {
          id: 'longedFor',
          title: 'Longed For',
          description: 'What you wish you had',
          icon: '🌟'
        }
      ],
      defaultSettings: {
        allowAnonymous: true,
        allowPrivateNotes: false,
        enableVoting: true,
        maxVotesPerUser: 4,
        timerEnabled: true,
        phaseDurations: {
          brainstorming: 25,
          voting: 5,
          discussion: 20,
          actionPlanning: 10,
          completed: 0
        },
        enableGrouping: true,
        autoAdvancePhases: false
      }
    }
  ];

  // Template Management
  getTemplates(): RetroTemplate[] {
    return this.templates;
  }

  getTemplate(id: string): RetroTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }

  // Session Management
  async createSession(
    workspaceId: string,
    facilitatorId: string,
    facilitatorName: string,
    sessionData: {
      title: string;
      description?: string;
      template: string;
      duration: number;
      settings: RetroSessionSettings;
    }
  ): Promise<string> {
    try {
      const session: Omit<RetroSession, 'id'> = {
        workspaceId,
        title: sessionData.title,
        description: sessionData.description,
        facilitatorId,
        facilitatorName,
        participants: [{
          userId: facilitatorId,
          userName: facilitatorName,
          role: 'facilitator',
          joinedAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          isOnline: true,
          permissions: {
            canAddNotes: true,
            canVote: true,
            canEditNotes: true,
            canDeleteNotes: true,
            canManageSession: true
          }
        }],
        template: sessionData.template,
        status: 'draft',
        currentPhase: 'brainstorming',
        notes: [],
        actionItems: [],
        settings: sessionData.settings,
        duration: sessionData.duration,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'retroSessions'), session);
      return docRef.id;
    } catch (error) {
      console.error('Error creating retro session:', error);
      throw new Error('Failed to create retrospective session');
    }
  }

  async getSession(sessionId: string): Promise<RetroSession | null> {
    try {
      const docRef = doc(db, 'retroSessions', sessionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as RetroSession;
      }
      return null;
    } catch (error) {
      console.error('Error getting retro session:', error);
      throw new Error('Failed to get retrospective session');
    }
  }

  async getWorkspaceSessions(workspaceId: string): Promise<RetroSession[]> {
    try {
      const q = query(
        collection(db, 'retroSessions'),
        where('workspaceId', '==', workspaceId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RetroSession[];
    } catch (error) {
      console.error('Error getting workspace retro sessions:', error);
      throw new Error('Failed to get workspace retrospective sessions');
    }
  }

  async updateSession(sessionId: string, updates: Partial<RetroSession>): Promise<void> {
    try {
      const docRef = doc(db, 'retroSessions', sessionId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating retro session:', error);
      throw new Error('Failed to update retrospective session');
    }
  }

  async startSession(sessionId: string): Promise<void> {
    try {
      const docRef = doc(db, 'retroSessions', sessionId);
      await updateDoc(docRef, {
        status: 'active',
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error starting retro session:', error);
      throw new Error('Failed to start retrospective session');
    }
  }

  async completeSession(sessionId: string): Promise<void> {
    try {
      const docRef = doc(db, 'retroSessions', sessionId);
      await updateDoc(docRef, {
        status: 'completed',
        currentPhase: 'completed',
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error completing retro session:', error);
      throw new Error('Failed to complete retrospective session');
    }
  }

  async changePhase(sessionId: string, newPhase: RetroPhase): Promise<void> {
    try {
      const docRef = doc(db, 'retroSessions', sessionId);
      await updateDoc(docRef, {
        currentPhase: newPhase,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error changing retro phase:', error);
      throw new Error('Failed to change retrospective phase');
    }
  }

  // Note Management
  async addNote(sessionId: string, note: Omit<RetroNote, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'retroNotes'), {
        ...note,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding retro note:', error);
      throw new Error('Failed to add retrospective note');
    }
  }

  async updateNote(noteId: string, updates: Partial<RetroNote>): Promise<void> {
    try {
      const docRef = doc(db, 'retroNotes', noteId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating retro note:', error);
      throw new Error('Failed to update retrospective note');
    }
  }

  async deleteNote(noteId: string): Promise<void> {
    try {
      const docRef = doc(db, 'retroNotes', noteId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting retro note:', error);
      throw new Error('Failed to delete retrospective note');
    }
  }

  async voteForNote(noteId: string, userId: string, hasVoted: boolean): Promise<void> {
    try {
      const docRef = doc(db, 'retroNotes', noteId);
      const noteDoc = await getDoc(docRef);
      
      if (!noteDoc.exists()) {
        throw new Error('Note not found');
      }

      const noteData = noteDoc.data();
      const currentVotes = noteData.votes || 0;
      const currentVotedBy = noteData.votedBy || [];

      let newVotes = currentVotes;
      let newVotedBy = [...currentVotedBy];

      if (hasVoted) {
        // Remove vote
        newVotes = Math.max(0, currentVotes - 1);
        newVotedBy = currentVotedBy.filter(id => id !== userId);
      } else {
        // Add vote
        newVotes = currentVotes + 1;
        newVotedBy.push(userId);
      }

      await updateDoc(docRef, {
        votes: newVotes,
        votedBy: newVotedBy,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error voting for retro note:', error);
      throw new Error('Failed to vote for retrospective note');
    }
  }

  // Action Item Management
  async addActionItem(sessionId: string, actionItem: Omit<RetroActionItem, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'retroActionItems'), {
        ...actionItem,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding retro action item:', error);
      throw new Error('Failed to add retrospective action item');
    }
  }

  async updateActionItem(actionItemId: string, updates: Partial<RetroActionItem>): Promise<void> {
    try {
      const docRef = doc(db, 'retroActionItems', actionItemId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating retro action item:', error);
      throw new Error('Failed to update retrospective action item');
    }
  }

  async deleteActionItem(actionItemId: string): Promise<void> {
    try {
      const docRef = doc(db, 'retroActionItems', actionItemId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting retro action item:', error);
      throw new Error('Failed to delete retrospective action item');
    }
  }

  // Participant Management
  async addParticipant(sessionId: string, participant: Omit<RetroParticipant, 'joinedAt'>): Promise<void> {
    try {
      const sessionRef = doc(db, 'retroSessions', sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      if (!sessionDoc.exists()) {
        throw new Error('Session not found');
      }

      const sessionData = sessionDoc.data();
      const currentParticipants = sessionData.participants || [];
      
      // Check if participant already exists
      const existingParticipantIndex = currentParticipants.findIndex(
        p => p.userId === participant.userId
      );

      const newParticipant = {
        ...participant,
        joinedAt: new Date().toISOString()
      };

      if (existingParticipantIndex >= 0) {
        // Update existing participant
        currentParticipants[existingParticipantIndex] = newParticipant;
      } else {
        // Add new participant
        currentParticipants.push(newParticipant);
      }

      await updateDoc(sessionRef, {
        participants: currentParticipants,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding retro participant:', error);
      throw new Error('Failed to add retrospective participant');
    }
  }

  async updateParticipantStatus(sessionId: string, userId: string, isOnline: boolean): Promise<void> {
    try {
      const sessionRef = doc(db, 'retroSessions', sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      if (!sessionDoc.exists()) {
        throw new Error('Session not found');
      }

      const sessionData = sessionDoc.data();
      const currentParticipants = sessionData.participants || [];
      
      const participantIndex = currentParticipants.findIndex(p => p.userId === userId);
      if (participantIndex >= 0) {
        currentParticipants[participantIndex] = {
          ...currentParticipants[participantIndex],
          isOnline,
          lastActivity: new Date().toISOString()
        };

        await updateDoc(sessionRef, {
          participants: currentParticipants,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating retro participant status:', error);
      throw new Error('Failed to update retrospective participant status');
    }
  }

  // Real-time Listeners
  onSessionUpdate(sessionId: string, callback: (session: RetroSession) => void): () => void {
    const docRef = doc(db, 'retroSessions', sessionId);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const session = { id: doc.id, ...doc.data() } as RetroSession;
        callback(session);
      }
    });
  }

  onNotesUpdate(sessionId: string, callback: (notes: RetroNote[]) => void): () => void {
    const q = query(
      collection(db, 'retroNotes'),
      where('sessionId', '==', sessionId),
      orderBy('createdAt', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const notes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RetroNote[];
      callback(notes);
    });
  }

  onActionItemsUpdate(sessionId: string, callback: (actionItems: RetroActionItem[]) => void): () => void {
    const q = query(
      collection(db, 'retroActionItems'),
      where('sessionId', '==', sessionId),
      orderBy('createdAt', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const actionItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RetroActionItem[];
      callback(actionItems);
    });
  }
}

export const retroService = new RetroService();
