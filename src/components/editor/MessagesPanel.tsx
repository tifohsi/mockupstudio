import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Message } from '../../types';
import MessageEditorRow from './MessageEditorRow';
import { generateId, getCurrentTime } from '../../utils/helpers';
import { Plus } from 'lucide-react';

interface MessagesPanelProps {
  messages: Message[];
  onChange: (messages: Message[]) => void;
}

const MessagesPanel: React.FC<MessagesPanelProps> = ({ messages, onChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = messages.findIndex((m) => m.id === active.id);
      const newIndex = messages.findIndex((m) => m.id === over.id);
      const newMessages = [...messages];
      const [removed] = newMessages.splice(oldIndex, 1);
      newMessages.splice(newIndex, 0, removed);
      onChange(newMessages);
    }
  }

  function addMessage(type: 'sent' | 'received') {
    const newMsg: Message = {
      id: generateId(),
      text: '',
      type,
      timestamp: getCurrentTime(),
      showTimestamp: false,
      showReadReceipt: false,
    };
    onChange([...messages, newMsg]);
  }

  function updateMessage(id: string, updates: Partial<Message>) {
    onChange(messages.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }

  function deleteMessage(id: string) {
    onChange(messages.filter((m) => m.id !== id));
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable message list */}
      <div className="flex-1 overflow-y-auto p-4 pb-2">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-sm font-medium text-gray-500">No messages yet</p>
            <p className="text-xs mt-1">Add your first message below</p>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={messages.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            {messages.map((message) => (
              <MessageEditorRow
                key={message.id}
                message={message}
                onUpdate={updateMessage}
                onDelete={deleteMessage}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add message buttons */}
      <div className="p-4 pt-2 border-t border-gray-100 bg-gray-50/80 flex gap-2">
        <button
          onClick={() => addMessage('received')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors bg-white"
        >
          <Plus size={15} />
          <span>Incoming</span>
        </button>
        <button
          onClick={() => addMessage('sent')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Plus size={15} />
          <span>Outgoing</span>
        </button>
      </div>
    </div>
  );
};

export default MessagesPanel;
