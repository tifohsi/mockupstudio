import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Message } from '../../types';
import { GripVertical, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

interface MessageEditorRowProps {
  message: Message;
  onUpdate: (id: string, updates: Partial<Message>) => void;
  onDelete: (id: string) => void;
}

const MessageEditorRow: React.FC<MessageEditorRowProps> = ({
  message,
  onUpdate,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: message.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const isSent = message.type === 'sent';

  return (
    <div
      ref={setNodeRef}
      style={style as React.CSSProperties}
      className={`
        message-row bg-white border border-gray-200 rounded-xl mb-2
        ${isDragging ? 'shadow-2xl ring-2 ring-blue-400' : 'shadow-sm'}
        transition-shadow duration-150
      `}
    >
      {/* Main row */}
      <div className="flex items-center gap-2 p-2.5">
        {/* Drag handle */}
        <button
          className="drag-handle opacity-30 hover:opacity-70 cursor-grab active:cursor-grabbing text-gray-400 flex-shrink-0 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </button>

        {/* Type toggle */}
        <button
          onClick={() => onUpdate(message.id, { type: isSent ? 'received' : 'sent' })}
          className={`
            flex-shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full transition-colors
            ${isSent
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }
          `}
          title="Toggle sent/received"
        >
          {isSent ? 'Sent' : 'Recv'}
        </button>

        {/* Message text input */}
        <input
          type="text"
          value={message.text}
          onChange={(e) => onUpdate(message.id, { text: e.target.value })}
          placeholder="Message text..."
          className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 min-w-0"
        />

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
          title="Message options"
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(message.id)}
          className="text-red-400 hover:text-red-600 flex-shrink-0 transition-colors"
          title="Delete message"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Expanded options */}
      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-gray-100 space-y-2.5">
          <div className="flex items-center gap-4 pt-2 flex-wrap">
            {/* Timestamp */}
            <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={message.showTimestamp}
                onChange={(e) => onUpdate(message.id, { showTimestamp: e.target.checked })}
                className="rounded"
              />
              Show timestamp
            </label>

            {/* Read receipt */}
            <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={message.showReadReceipt}
                onChange={(e) => onUpdate(message.id, { showReadReceipt: e.target.checked })}
                disabled={message.type !== 'sent'}
                className="rounded disabled:opacity-40"
              />
              Read receipt
            </label>
          </div>

          {/* Timestamp text */}
          {message.showTimestamp && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-20 flex-shrink-0">Time label</label>
              <input
                type="text"
                value={message.timestamp}
                onChange={(e) => onUpdate(message.id, { timestamp: e.target.value })}
                placeholder="e.g. 3:45 PM"
                className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-blue-400 bg-gray-50"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageEditorRow;
