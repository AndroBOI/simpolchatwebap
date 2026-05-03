export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export type Props = {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
};

export type OtherParticipant = {
  conversation_id: string;
  users: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  }[];
};

export type LastMessage = {
  conversation_id: string;
  content: string;
  created_at: string;
  sender_id: string;
};

export type ChatInboxCotentProps = {
  currentUserId: string;
  initialLastMessageMap: Record<string, LastMessage>;
  otherParticipants: OtherParticipant[];
  initialUnreadSet: string[];
};
