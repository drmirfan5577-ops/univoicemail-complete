export interface EmailAddress {
  name?: string;
  email: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface Email {
  id: string;
  threadId: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject: string;
  body: string;
  bodyHtml?: string;
  preview: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  labels: string[];
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | 'archive' | 'starred';
  attachments?: Attachment[];
  hasAttachments: boolean;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  count?: number;
  unread?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  domain: string;
}
