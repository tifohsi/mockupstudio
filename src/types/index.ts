// ─── iMessage ─────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  text: string;
  type: 'sent' | 'received';
  timestamp: string;
  showTimestamp: boolean;
  showReadReceipt: boolean;
  isTypingIndicator?: boolean;
  characterId?: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatarColor: string;
  avatarPhotoUrl: string | null;
  previewText: string;
  time: string;
  unreadCount: number;
  pinned: boolean;
  messages: Message[];
  isGroup: boolean;
  groupName: string;
  participants: string[];
}

export interface IMessageConfig {
  // status bar
  statusBarTime: string;
  batteryLevel: number;
  signalBars: number;
  wifiConnected: boolean;
  iosTheme: 'light' | 'dark';
  showReadReceipts: boolean;
  showTypingIndicator: boolean;
  // navigation state
  activeConversationId: string | null;
}

// ─── Twitter / X ──────────────────────────────────────────────────────────────

export interface TwitterPost {
  id: string;
  username: string;
  handle: string;
  avatarColor: string;
  avatarPhotoUrl: string | null;
  verified: boolean;
  verifiedType: 'blue' | 'gold' | 'gray';
  text: string;
  imageUrls: string[];
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
}

export interface TwitterFeedConfig {
  theme: 'light' | 'dim' | 'dark';
  statusBarTime: string;
  batteryLevel: number;
  posts: TwitterPost[];
}

// ─── Instagram ────────────────────────────────────────────────────────────────

export interface InstagramPost {
  id: string;
  username: string;
  avatarColor: string;
  avatarPhotoUrl: string | null;
  verified: boolean;
  location: string;
  imageUrls: string[];
  imagePlaceholderColor: string;
  caption: string;
  likes: number;
  timeAgo: string;
  hasStory: boolean;
}

export interface InstagramFeedConfig {
  theme: 'light' | 'dark';
  statusBarTime: string;
  batteryLevel: number;
  posts: InstagramPost[];
}

// ─── App ──────────────────────────────────────────────────────────────────────

export type GeneratorMode = 'imessage' | 'twitter' | 'instagram';

// ─── Saved Characters ─────────────────────────────────────────────────────────

// ─── Saved Characters ─────────────────────────────────────────────────────────

export interface Character {
  id: string;
  name: string;
  avatarColor: string;
  avatarPhotoUrl: string | null;
  handle: string;
  note: string;
}
