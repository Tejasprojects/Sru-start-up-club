
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { CalendarEvent, PastRecording, EventRegistration, UserProfile, UserSettings, SlideImage, User, SuccessStory, ImportantMember, IntroductionRequest, ForumCategory, ForumTopic, ForumReply, MentorProfile, MentorSession, ResourceCategory, Resource, Startup, StartupMember, StartupWithFounder, Connection, Notification, ChatMessage, ChatRoom, DatabaseTable } from '@/lib/types';

export { supabase };

export const fetchEvents = async (): Promise<CalendarEvent[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_datetime', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return (data || []).map(event => ({
    ...event,
    location_type: event.location_type as 'virtual' | 'physical' | 'hybrid'
  }));
};

export const fetchPastRecordings = async (): Promise<PastRecording[]> => {
  const { data, error } = await supabase
    .from('past_recordings')
    .select('*')
    .order('recorded_at', { ascending: false });

  if (error) {
    console.error('Error fetching past recordings:', error);
    return [];
  }

  return data || [];
};

export const fetchEventRegistrations = async (eventId: string): Promise<EventRegistration[]> => {
  const { data, error } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching event registrations:', error);
    return [];
  }

  return (data || []).map(registration => ({
    ...registration,
    status: registration.status as 'registered' | 'canceled' | 'attended' | 'no-show'
  }));
};

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data || null;
};

export const fetchUserSettings = async (userId: string): Promise<UserSettings | null> => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user settings:', error);
    return null;
  }

  if (!data) return null;

  // Type conversion with proper handling of Json types
  return {
    id: data.id,
    user_id: data.user_id,
    theme_preference: data.theme_preference as 'light' | 'dark' | 'system',
    notification_preferences: data.notification_preferences as {
      email: boolean;
      push: boolean;
      site: boolean;
      [key: string]: boolean;
    },
    privacy_settings: data.privacy_settings as {
      profile_visibility: 'public' | 'members' | 'private';
      [key: string]: any;
    },
    created_at: data.created_at,
    updated_at: data.updated_at
  } as UserSettings;
};

export const fetchSlideImages = async (): Promise<SlideImage[]> => {
  const { data, error } = await supabase
    .from('slide_images')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching slide images:', error);
    return [];
  }

  return data || [];
};

export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data || [];
};

export const fetchSuccessStories = async (): Promise<SuccessStory[]> => {
  const { data, error } = await supabase
    .from('success_stories')
    .select('*');

  if (error) {
    console.error('Error fetching success stories:', error);
    return [];
  }

  return data || [];
};

export const fetchImportantMembers = async (): Promise<ImportantMember[]> => {
  const { data, error } = await supabase
    .from('important_members')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching important members:', error);
    return [];
  }

  return data || [];
};

export const fetchIntroductionRequests = async (userId: string): Promise<IntroductionRequest[]> => {
  const { data, error } = await supabase
    .from('introduction_requests')
    .select('*')
    .or(`requester_id.eq.${userId},target_id.eq.${userId},intermediary_id.eq.${userId}`);

  if (error) {
    console.error('Error fetching introduction requests:', error);
    return [];
  }

  return (data || []).map(request => ({
    ...request,
    status: request.status as 'pending' | 'accepted' | 'rejected' | 'completed'
  }));
};

export const fetchForumCategories = async (): Promise<ForumCategory[]> => {
  const { data, error } = await supabase
    .from('forum_categories')
    .select('*')
    .order('order_num', { ascending: true });

  if (error) {
    console.error('Error fetching forum categories:', error);
    return [];
  }

  return data || [];
};

export const fetchForumTopics = async (): Promise<ForumTopic[]> => {
  const { data, error } = await supabase
    .from('forum_topics')
    .select('*');

  if (error) {
    console.error('Error fetching forum topics:', error);
    return [];
  }

  return data || [];
};

export const fetchForumReplies = async (): Promise<ForumReply[]> => {
  const { data, error } = await supabase
    .from('forum_replies')
    .select('*');

  if (error) {
    console.error('Error fetching forum replies:', error);
    return [];
  }

  return data || [];
};

export const fetchMentorProfiles = async (): Promise<MentorProfile[]> => {
  const { data, error } = await supabase
    .from('mentor_profiles')
    .select('*');

  if (error) {
    console.error('Error fetching mentor profiles:', error);
    return [];
  }

  return data || [];
};

export const fetchMentorSessions = async (): Promise<MentorSession[]> => {
  const { data, error } = await supabase
    .from('mentor_sessions')
    .select('*');

  if (error) {
    console.error('Error fetching mentor sessions:', error);
    return [];
  }

  return (data || []).map(session => ({
    ...session,
    status: session.status as 'scheduled' | 'completed' | 'canceled'
  }));
};

export const fetchResourceCategories = async (): Promise<ResourceCategory[]> => {
  const { data, error } = await supabase
    .from('resource_categories')
    .select('*');

  if (error) {
    console.error('Error fetching resource categories:', error);
    return [];
  }

  return data || [];
};

export const fetchResources = async (): Promise<Resource[]> => {
  const { data, error } = await supabase
    .from('resources')
    .select('*');

  if (error) {
    console.error('Error fetching resources:', error);
    return [];
  }

  return data || [];
};

export const fetchStartups = async (): Promise<Startup[]> => {
  const { data, error } = await supabase
    .from('startups')
    .select('*');

  if (error) {
    console.error('Error fetching startups:', error);
    return [];
  }

  return data || [];
};

export const fetchStartupMembers = async (): Promise<StartupMember[]> => {
  const { data, error } = await supabase
    .from('startup_members')
    .select('*');

  if (error) {
    console.error('Error fetching startup members:', error);
    return [];
  }

  return data || [];
};

export const fetchConnections = async (): Promise<Connection[]> => {
  const { data, error } = await supabase
    .from('connections')
    .select('*');

  if (error) {
    console.error('Error fetching connections:', error);
    return [];
  }

  return (data || []).map(connection => ({
    ...connection,
    status: connection.status as 'pending' | 'accepted' | 'rejected'
  }));
};

export const fetchNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*');

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data || [];
};

export const fetchChatMessages = async (): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*');

  if (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }

  return data || [];
};

export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  const { data, error } = await supabase
    .from('chat_rooms')
    .select('*');

  if (error) {
    console.error('Error fetching chat rooms:', error);
    return [];
  }

  return data || [];
};

// Generic function to fetch data from any existing table
export const fetchDatabaseTable = async (tableName: keyof Database['public']['Tables']): Promise<DatabaseTable[]> => {
  const { data, error } = await supabase
    .from(tableName)
    .select('*');

  if (error) {
    console.error(`Error fetching data from table ${tableName}:`, error);
    return [];
  }

  return data || [];
};
