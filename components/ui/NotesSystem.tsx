import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { Note, NoteComment, Task, Sprint } from '../../types';
import { mockNotes } from '../../data/mockData';
import { 
  Plus, 
  Search, 
  Filter, 
  Tag, 
  Calendar, 
  User, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  Paperclip,
  Link,
  MoreVertical,
  BookOpen,
  Users,
  Lightbulb,
  Settings,
  FileText
} from 'lucide-react';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../src/lib/firebase';

interface NotesSystemProps {
  workspaceId: string;
  tasks?: Task[];
  sprints?: Sprint[];
}

const NotesSystem: React.FC<NotesSystemProps> = ({ workspaceId, tasks = [], sprints = [] }) => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'author'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showPublicOnly, setShowPublicOnly] = useState(false);

  // Load notes from Firestore
  useEffect(() => {
    if (!workspaceId || !currentUser) return;

    console.log('Loading notes for workspace:', workspaceId);
    
    // Real-time listener for notes
    const notesQuery = query(
      collection(db, 'notes'),
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const notesData: Note[] = [];
      snapshot.forEach((doc) => {
        notesData.push({ id: doc.id, ...doc.data() } as Note);
      });
      console.log('Notes loaded from Firestore:', notesData.length);
      setNotes(notesData);
    }, (error) => {
      console.error('Error loading notes:', error);
      // Fallback to mock data if Firestore fails
      const workspaceNotes = mockNotes.filter(note => note.workspaceId === workspaceId);
      setNotes(workspaceNotes);
    });

    return () => unsubscribe();
  }, [workspaceId, currentUser]);

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, searchTerm, selectedCategory, selectedTags, sortBy, sortOrder, showPublicOnly]);

  const filterAndSortNotes = () => {
    let filtered = notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => note.tags.includes(tag));
      const matchesVisibility = !showPublicOnly || note.isPublic;
      
      return matchesSearch && matchesCategory && matchesTags && matchesVisibility;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.authorName.toLowerCase();
          bValue = b.authorName.toLowerCase();
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredNotes(filtered);
  };

  const handleCreateNote = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditModalOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      try {
        // Delete from Firestore
        await deleteDoc(doc(db, 'notes', noteId));
        console.log('Note deleted from Firestore:', noteId);
        
        // Update local state
        setNotes(notes.filter(note => note.id !== noteId));
        if (selectedNote?.id === noteId) {
          setSelectedNote(null);
        }
      } catch (error) {
        console.error('Error deleting note from Firestore:', error);
        alert('Not silinirken hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Meeting': return <Users className="h-4 w-4" />;
      case 'Technical': return <Settings className="h-4 w-4" />;
      case 'Process': return <FileText className="h-4 w-4" />;
      case 'Ideas': return <Lightbulb className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Meeting': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Technical': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Process': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Ideas': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="flex h-full bg-white dark:bg-gray-800">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notlar</h2>
            <button
              onClick={handleCreateNote}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              title="Yeni Not Ekle"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Notlarda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Tümü</option>
                <option value="General">Genel</option>
                <option value="Meeting">Toplantı</option>
                <option value="Technical">Teknik</option>
                <option value="Process">Süreç</option>
                <option value="Ideas">Fikirler</option>
              </select>
            </div>

            {/* Visibility Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="publicOnly"
                checked={showPublicOnly}
                onChange={(e) => setShowPublicOnly(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="publicOnly" className="text-sm text-gray-700 dark:text-gray-300">
                Sadece genel notlar
              </label>
            </div>

            {/* Sort Options */}
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'author')}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="date">Tarih</option>
                <option value="title">Başlık</option>
                <option value="author">Yazar</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Not bulunamadı</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    selectedNote?.id === note.id
                      ? 'bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
                      {note.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {note.isPublic ? (
                        <Eye className="h-3 w-3 text-green-600" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      {getCategoryIcon(note.category)}
                      <span>{note.category}</span>
                    </span>
                    <span>{new Date(note.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Note Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedNote.category)}`}>
                    {selectedNote.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedNote.isPublic ? 'Genel' : 'Özel'}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {selectedNote.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{selectedNote.authorName}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(selectedNote.createdAt).toLocaleDateString('tr-TR')}</span>
                  </span>
                  {selectedNote.updatedAt !== selectedNote.createdAt && (
                    <span className="text-xs">
                      (Düzenlendi: {new Date(selectedNote.updatedAt).toLocaleDateString('tr-TR')})
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditNote(selectedNote)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Düzenle"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteNote(selectedNote.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Sil"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Note Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedNote.content}
              </div>
            </div>

            {/* Tags */}
            {selectedNote.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedNote.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Items */}
            {(selectedNote.relatedTasks?.length || selectedNote.relatedSprints?.length) && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">İlişkili Öğeler</h3>
                <div className="space-y-2">
                  {selectedNote.relatedTasks?.map((taskId) => {
                    const task = tasks.find(t => t.id === taskId);
                    return task ? (
                      <div key={taskId} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Link className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{task.title}</span>
                      </div>
                    ) : null;
                  })}
                  {selectedNote.relatedSprints?.map((sprintId) => {
                    const sprint = sprints.find(s => s.id === sprintId);
                    return sprint ? (
                      <div key={sprintId} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{sprint.name}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Yorumlar
              </h3>
              <div className="space-y-4">
                {/* Add Comment */}
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {currentUser?.displayName?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Yorum ekle..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="mt-2 flex justify-end">
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm">
                        Yorum Ekle
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Comments List */}
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Henüz yorum yok</p>
                  <p className="text-sm">İlk yorumu siz yapın!</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Not Seçin</h3>
              <p className="text-sm">Sol taraftan bir not seçin veya yeni not oluşturun</p>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <NoteModal
          note={isEditModalOpen ? selectedNote : undefined}
          isOpen={isCreateModalOpen || isEditModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedNote(null);
          }}
                       onSave={async (noteData) => {
               try {
                 if (isEditModalOpen && selectedNote) {
                   // Edit existing note
                   const updatedNote = { 
                     ...selectedNote, 
                     ...noteData, 
                     updatedAt: new Date().toISOString() 
                   };
                   
                   // Save to Firestore
                   await setDoc(doc(db, 'notes', selectedNote.id), updatedNote);
                   console.log('Note updated in Firestore:', selectedNote.id);
                   
                 } else {
                   // Create new note
                   const newNote: Note = {
                     title: noteData.title!,
                     content: noteData.content!,
                     tags: noteData.tags || [],
                     category: noteData.category || 'General',
                     isPublic: noteData.isPublic ?? true,
                     relatedTasks: noteData.relatedTasks || [],
                     relatedSprints: noteData.relatedSprints || [],
                     id: Date.now().toString(),
                     workspaceId,
                     authorId: currentUser?.uid || '',
                     authorName: currentUser?.displayName || 'User',
                     createdAt: new Date().toISOString(),
                     updatedAt: new Date().toISOString(),
                   };
                   
                   // Save to Firestore
                   await setDoc(doc(db, 'notes', newNote.id), newNote);
                   console.log('Note saved to Firestore:', newNote.id);
                 }
                 
                 setIsCreateModalOpen(false);
                 setIsEditModalOpen(false);
                 setSelectedNote(null);
                 
               } catch (error) {
                 console.error('Error saving note to Firestore:', error);
                 alert('Not kaydedilirken hata oluştu. Lütfen tekrar deneyin.');
               }
             }}
          tasks={tasks}
          sprints={sprints}
        />
      )}
    </div>
  );
};

// Note Modal Component
interface NoteModalProps {
  note?: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: Partial<Note>) => void;
  tasks: Task[];
  sprints: Sprint[];
}

const NoteModal: React.FC<NoteModalProps> = ({ note, isOpen, onClose, onSave, tasks, sprints }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState<Note['category']>(note?.category || 'General');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [isPublic, setIsPublic] = useState(note?.isPublic ?? true);
  const [newTag, setNewTag] = useState('');
  const [relatedTasks, setRelatedTasks] = useState<string[]>(note?.relatedTasks || []);
  const [relatedSprints, setRelatedSprints] = useState<string[]>(note?.relatedSprints || []);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Başlık ve içerik alanları zorunludur');
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
      isPublic,
      relatedTasks,
      relatedSprints,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {note ? 'Notu Düzenle' : 'Yeni Not Oluştur'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <span className="sr-only">Kapat</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Başlık *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Not başlığı..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Note['category'])}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="General">Genel</option>
                <option value="Meeting">Toplantı</option>
                <option value="Technical">Teknik</option>
                <option value="Process">Süreç</option>
                <option value="Ideas">Fikirler</option>
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                İçerik *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Not içeriği..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Etiketler
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Yeni etiket..."
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Ekle
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">
                Bu notu herkes görebilsin
              </label>
            </div>

            {/* Related Tasks */}
            {tasks.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İlişkili Görevler
                </label>
                <select
                  multiple
                  value={relatedTasks}
                  onChange={(e) => setRelatedTasks(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Related Sprints */}
            {sprints.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İlişkili Sprintler
                </label>
                <select
                  multiple
                  value={relatedSprints}
                  onChange={(e) => setRelatedSprints(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {sprints.map((sprint) => (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              {note ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesSystem;
