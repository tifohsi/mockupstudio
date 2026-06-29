import React from 'react';
import { TimelineConfig, TimelineEvent } from '../../types';
import { generateId } from '../../utils/helpers';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

const EVENT_COLORS = [
  '#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6',
  '#EF4444', '#8B5CF6', '#14B8A6', '#F97316', '#64748B',
];

const EVENT_ICONS = ['🚀', '🎯', '💰', '✨', '📱', '🏆', '💡', '🔥', '📊', '🎉', '⚡', '🌟', '🛠️', '📅', '🔑'];
const ACCENT_COLORS = ['#6366F1', '#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#0EA5E9'];

// Sortable event row
function SortableEventRow({
  event, onUpdate, onDelete,
}: {
  event: TimelineEvent;
  onUpdate: (id: string, updates: Partial<TimelineEvent>) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: event.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const [open, setOpen] = React.useState(false);

  return (
    <div ref={setNodeRef} style={style}
      className={`bg-white border border-gray-200 rounded-xl mb-2 ${isDragging ? 'shadow-2xl' : 'shadow-sm'}`}>
      <div className="flex items-center gap-2 p-2.5">
        <button className="opacity-30 hover:opacity-70 cursor-grab active:cursor-grabbing text-gray-400 flex-shrink-0" {...attributes} {...listeners}>
          <GripVertical size={16} />
        </button>
        {/* Color dot */}
        <div className="relative flex-shrink-0">
          <div className="w-5 h-5 rounded-full cursor-pointer" style={{ background: event.color }}
            onClick={() => setOpen(!open)} />
          {open && (
            <div className="absolute top-7 left-0 z-10 bg-white border border-gray-200 rounded-xl p-2 shadow-lg flex flex-wrap gap-1.5" style={{ width: '140px' }}>
              {EVENT_COLORS.map((c) => (
                <button key={c} onClick={() => { onUpdate(event.id, { color: c }); setOpen(false); }}
                  className="w-5 h-5 rounded-full border-2 transition-all"
                  style={{ background: c, borderColor: event.color === c ? '#007AFF' : 'transparent' }} />
              ))}
            </div>
          )}
        </div>
        {/* Icon picker */}
        <select value={event.icon} onChange={(e) => onUpdate(event.id, { icon: e.target.value })}
          className="text-base bg-transparent border-0 outline-none cursor-pointer flex-shrink-0 w-10">
          {EVENT_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
        </select>
        {/* Title */}
        <input type="text" value={event.title} onChange={(e) => onUpdate(event.id, { title: e.target.value })}
          placeholder="Event title" className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 min-w-0 font-medium" />
        {/* Date */}
        <input type="text" value={event.date} onChange={(e) => onUpdate(event.id, { date: e.target.value })}
          placeholder="Date" className="w-20 text-xs bg-transparent outline-none text-gray-500 placeholder-gray-300 text-right" />
        <button onClick={() => onDelete(event.id)} className="text-red-400 hover:text-red-600 flex-shrink-0 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
      {/* Description */}
      <div className="px-10 pb-3">
        <input type="text" value={event.description} onChange={(e) => onUpdate(event.id, { description: e.target.value })}
          placeholder="Description (optional)"
          className="w-full text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-300 placeholder-gray-300" />
      </div>
    </div>
  );
}

interface TimelineEditorProps {
  config: TimelineConfig;
  onChange: (updates: Partial<TimelineConfig>) => void;
}

const TimelineEditor: React.FC<TimelineEditorProps> = ({ config, onChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = config.events.findIndex((e) => e.id === active.id);
      const newIdx = config.events.findIndex((e) => e.id === over.id);
      const newEvents = [...config.events];
      const [removed] = newEvents.splice(oldIdx, 1);
      newEvents.splice(newIdx, 0, removed);
      onChange({ events: newEvents });
    }
  }

  function addEvent() {
    const colors = EVENT_COLORS;
    const color = colors[config.events.length % colors.length];
    const newEvent: TimelineEvent = {
      id: generateId(),
      title: '',
      description: '',
      date: '',
      icon: '⭐',
      color,
    };
    onChange({ events: [...config.events, newEvent] });
  }

  function updateEvent(id: string, updates: Partial<TimelineEvent>) {
    onChange({ events: config.events.map((e) => e.id === id ? { ...e, ...updates } : e) });
  }

  function deleteEvent(id: string) {
    onChange({ events: config.events.filter((e) => e.id !== id) });
  }

  const sectionTitle = "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3";
  const label = "text-sm text-gray-600 font-medium";
  const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white transition-colors";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* Header info */}
        <section>
          <h3 className={sectionTitle}>Header</h3>
          <div className="space-y-2">
            <input type="text" value={config.title} onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Timeline title" className={inputClass} />
            <input type="text" value={config.subtitle} onChange={(e) => onChange({ subtitle: e.target.value })}
              placeholder="Subtitle (optional)" className={inputClass} />
          </div>
        </section>

        {/* Style */}
        <section>
          <h3 className={sectionTitle}>Style</h3>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-3">
            {(['minimal', 'cards', 'bold'] as const).map((s) => (
              <button key={s} onClick={() => onChange({ style: s })}
                className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${config.style === s ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {s === 'minimal' ? '— Minimal' : s === 'cards' ? '▣ Cards' : '◆ Bold'}
              </button>
            ))}
          </div>

          {/* Accent color (used in bold style) */}
          {config.style === 'bold' && (
            <div>
              <span className={`${label} block mb-2`}>Accent color</span>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map((color) => (
                  <button key={color} onClick={() => onChange({ accentColor: color })}
                    className="w-6 h-6 rounded-full border-2 transition-all"
                    style={{ background: color, borderColor: config.accentColor === color ? '#007AFF' : 'transparent', boxShadow: config.accentColor === color ? '0 0 0 2px white, 0 0 0 4px #007AFF' : 'none' }} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Theme */}
        <section>
          <h3 className={sectionTitle}>Theme</h3>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {(['light', 'dark'] as const).map((t) => (
              <button key={t} onClick={() => onChange({ theme: t })}
                className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${config.theme === t ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {t === 'light' ? '☀️ Light' : '🌙 Dark'}
              </button>
            ))}
          </div>
        </section>

        {/* Events */}
        <section>
          <h3 className={sectionTitle}>Events ({config.events.length})</h3>
          {config.events.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">No events yet — add one below</div>
          )}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={config.events.map((e) => e.id)} strategy={verticalListSortingStrategy}>
              {config.events.map((event) => (
                <SortableEventRow key={event.id} event={event} onUpdate={updateEvent} onDelete={deleteEvent} />
              ))}
            </SortableContext>
          </DndContext>
        </section>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 pb-4">
          <p className="text-[11px] text-amber-700 leading-relaxed">
            <span className="font-semibold">⚠️ For creative & design use only.</span> Timelines are fictional mockups for storytelling and presentations.
          </p>
        </div>
      </div>

      {/* Add event button */}
      <div className="p-4 pt-2 border-t border-gray-100 bg-gray-50/80">
        <button onClick={addEvent}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
          <Plus size={15} /> Add Event
        </button>
      </div>
    </div>
  );
};

export default TimelineEditor;
