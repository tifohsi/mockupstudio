import { Conversation, IMessageConfig } from '../types';

export const defaultConversations: Conversation[] = [];

export const defaultIMessageConfig: IMessageConfig = {
  statusBarTime: '9:41',
  batteryLevel: 100,
  signalBars: 4,
  wifiConnected: true,
  iosTheme: 'light',
  showReadReceipts: true,
  showTypingIndicator: false,
  activeConversationId: null,
};
