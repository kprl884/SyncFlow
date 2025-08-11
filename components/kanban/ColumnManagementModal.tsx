import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../src/lib/firebase';
import { X, Plus, GripVertical, Trash2 } from 'lucide-react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface KanbanColumn {
  id: string;
  name: string;
  order: number;
}

interface ColumnManagementModalProps {
  workspaceId: string;
  columns: KanbanColumn[];
  onClose: () => void;
  onColumnsUpdated: (columns: KanbanColumn[]) => void;
}

interface SortableColumnItemProps {
  column: KanbanColumn;
  onEdit: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

const SortableColumnItem: React.FC<SortableColumnItemProps> = ({ column, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(column.name);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editName.trim() && editName !== column.name) {
      onEdit(column.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditName(column.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      
      {isEditing ? (
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoFocus
        />
      ) : (
        <div
          className="flex-1 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {column.name}
        </div>
      )}
      
      <button
        onClick={() => onDelete(column.id)}
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

const PREDEFINED_COLUMNS = [
  'Todo',
  'In Progress',
  'Blocked',
  'Dev Done',
  'Test Ready',
  'Testing',
  'Test Done',
  'Code Review',
  'Ready for Production',
  'Done'
];

const ColumnManagementModal: React.FC<ColumnManagementModalProps> = ({
  workspaceId,
  columns,
  onClose,
  onColumnsUpdated
}) => {
  const [localColumns, setLocalColumns] = useState<KanbanColumn[]>(columns);
  const [newColumnName, setNewColumnName] = useState('');
  const [showPredefined, setShowPredefined] = useState(false);
  const [activeColumn, setActiveColumn] = useState<KanbanColumn | null>(null);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    setLocalColumns(columns);
  }, [columns]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveColumn(localColumns.find(col => col.id === active.id) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null);

    if (!over || active.id === over.id) return;

    const oldIndex = localColumns.findIndex((col) => col.id === active.id);
    const newIndex = localColumns.findIndex((col) => col.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedColumns = [...localColumns];
      const [movedColumn] = reorderedColumns.splice(oldIndex, 1);
      reorderedColumns.splice(newIndex, 0, movedColumn);

      // Update order values
      const updatedColumns = reorderedColumns.map((col, index) => ({
        ...col,
        order: index
      }));

      setLocalColumns(updatedColumns);
    }
  };

  const addColumn = (name: string) => {
    if (!name.trim()) return;

    const newColumn: KanbanColumn = {
      id: `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      order: localColumns.length
    };

    setLocalColumns([...localColumns, newColumn]);
    setNewColumnName('');
    setShowPredefined(false);
  };

  const editColumn = (id: string, newName: string) => {
    setLocalColumns(prev => prev.map(col =>
      col.id === id ? { ...col, name: newName } : col
    ));
  };

  const deleteColumn = (id: string) => {
    if (localColumns.length <= 1) {
      alert('En az bir kolon bulunmalıdır.');
      return;
    }

    setLocalColumns(prev => prev.filter(col => col.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const workspaceRef = doc(db, 'workspaces', workspaceId);
      await updateDoc(workspaceRef, {
        kanbanColumns: localColumns,
        updatedAt: new Date().toISOString()
      });
      
      onColumnsUpdated(localColumns);
      onClose();
    } catch (error) {
      console.error('Error saving columns:', error);
      alert('Kolonlar kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Kanban Kolonlarını Yönet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Add New Column */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Yeni Kolon Ekle
            </h3>
            
            <div className="flex items-center space-x-3 mb-3">
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addColumn(newColumnName)}
                placeholder="Kolon adını girin..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => addColumn(newColumnName)}
                disabled={!newColumnName.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Ekle</span>
              </button>
            </div>

            <button
              onClick={() => setShowPredefined(!showPredefined)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline"
            >
              {showPredefined ? 'Hazır şablonları gizle' : 'Hazır şablonları göster'}
            </button>

            {showPredefined && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Hazır şablonlardan seçin:
                </p>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_COLUMNS.map(name => (
                    <button
                      key={name}
                      onClick={() => addColumn(name)}
                      disabled={localColumns.some(col => col.name === name)}
                      className="px-3 py-1 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Existing Columns */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Mevcut Kolonlar ({localColumns.length})
            </h3>
            
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={localColumns.map(col => col.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {localColumns.map((column) => (
                    <SortableColumnItem
                      key={column.id}
                      column={column}
                      onEdit={editColumn}
                      onDelete={deleteColumn}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay>
                {activeColumn ? (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 opacity-90">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 text-sm font-medium text-gray-900 dark:text-white">
                      {activeColumn.name}
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            {localColumns.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Henüz kolon eklenmemiş.</p>
                <p className="text-sm">Yukarıdan yeni kolon ekleyebilirsiniz.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || localColumns.length === 0}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnManagementModal;
