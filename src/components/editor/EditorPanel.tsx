import React, { useState } from 'react';
import { Message, ConversationConfig, EditorTab } from '../../types';
import MessagesPanel from './MessagesPanel';
import SettingsPanel from './SettingsPanel';
import { MessageSquare, Settings } from 'lucide-react';

interface EditorPanelProps {
  messages: Message[];
  config: ConversationConfig;
  onMessagesChange: (messages: Message[]) => void;
  onConfigChange: (updates: Partial<ConversationConfig>) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  messages,
  config,
  onMessagesChange,
  onConfigChange,
}) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('messages');

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 bg-white px-2 pt-2">
        <button
          onClick={() => setActiveTab('messages')}
          className={`
            flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg mr-1
            transition-colors relative
            ${activeTab === 'messages'
              ? 'text-blue-600 bg-gray-50 border-t border-l border-r border-gray-200 -mb-px'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          <MessageSquare size={15} />
          Messages
          <span className="ml-1 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">
            {messages.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`
            flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg
            transition-colors relative
            ${activeTab === 'settings'
              ? 'text-blue-600 bg-gray-50 border-t border-l border-r border-gray-200 -mb-px'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          <Settings size={15} />
          Settings
        </button>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'messages' ? (
          <MessagesPanel messages={messages} onChange={onMessagesChange} />
        ) : (
          <SettingsPanel config={config} onChange={onConfigChange} />
        )}
      </div>
    </div>
  );
};

export default EditorPanel;
