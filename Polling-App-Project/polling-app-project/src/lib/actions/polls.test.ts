import * as pollsModule from './polls';
import { mockSupabaseClient } from '../supabase/server.mock';
import { revalidatePath } from 'next/cache';

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Mock the supabase server client
jest.mock('../supabase/server', () => ({
  getSupabaseServerClient: jest.fn(() => mockSupabaseClient),
}));

describe('Poll Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock data/error for each test
    mockSupabaseClient.mockReset();
    mockSupabaseClient.auth.getUser.mockClear();
  });
  
  // Create FormData mock
  function createMockFormData(data: Record<string, string | string[]>) {
    const formData = {
      get: jest.fn((key) => data[key]),
      getAll: jest.fn((key) => Array.isArray(data[key]) ? data[key] : [data[key]]),
    } as unknown as FormData;
    return formData;
  }

  describe('createPollAction', () => {
    it('should create a poll successfully', async () => {
      // Mock successful poll creation
      mockSupabaseClient.mockReturnValueOnce({ id: '123' });
      // Mock successful options insertion
      mockSupabaseClient.mockReturnValueOnce({});

      const formData = createMockFormData({
        title: 'Test Poll',
        description: 'Test Description',
        options: ['Option 1', 'Option 2'],
      });

      const result = await pollsModule.createPollAction(formData as FormData);

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('polls');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith([{
        title: 'Test Poll',
        description: 'Test Description',
        created_by: '123',
      }]);
      expect(mockSupabaseClient.select).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/polls');
      expect(result).toEqual({ ok: true, pollId: '123' });
    });

    it('should handle errors when creating a poll', async () => {
      // Mock error during poll creation
      mockSupabaseClient.mockReturnValueOnce(null, { message: 'Database error' });

      const formData = createMockFormData({
        title: 'Test Poll',
        description: 'Test Description',
        options: ['Option 1', 'Option 2'],
      });

      const result = await pollsModule.createPollAction(formData as FormData);

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('polls');
      expect(revalidatePath).not.toHaveBeenCalled();
      expect(result).toEqual({ ok: false, error: 'Database error' });
    });

    it('should return an error if the user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

      const formData = createMockFormData({
        title: 'Test Poll',
        description: 'Test Description',
        options: ['Option 1', 'Option 2'],
      });

      const result = await pollsModule.createPollAction(formData as FormData);

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
      expect(result).toEqual({ ok: false, error: 'You must be logged in to create a poll.' });
    });
  });

  describe('getPolls', () => {
    it('should get polls successfully', async () => {
      const mockPolls = [
        { id: '1', title: 'Poll 1', description: 'Description 1', created_at: new Date().toISOString(), created_by: { username: 'testuser' } },
        { id: '2', title: 'Poll 2', description: 'Description 2', created_at: new Date().toISOString(), created_by: { username: 'testuser2' } },
      ];
      
      const mockOptions = [
        { id: 'opt1', poll_id: '1', text: 'Option 1', votes: 5 },
        { id: 'opt2', poll_id: '1', text: 'Option 2', votes: 3 },
        { id: 'opt3', poll_id: '2', text: 'Option 3', votes: 2 },
      ];

      // Mock polls query
      mockSupabaseClient.mockReturnValueOnce(mockPolls);
      // Mock options query
      mockSupabaseClient.mockReturnValueOnce(mockOptions);

      const result = await pollsModule.getPolls();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('polls');
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toBeInstanceOf(Array);
      // We expect 2 polls because that's what we mocked
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('1');
      expect(result[0].createdBy).toBe('testuser');
      // We expect 2 options for the first poll because there are 2 options with poll_id '1'
      expect(result[0].options.length).toBe(2);
    });

    it('should handle errors when getting polls', async () => {
      mockSupabaseClient.mockReturnValueOnce(null, { message: 'Database error' });

      const result = await pollsModule.getPolls();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('polls');
      expect(result).toEqual([]);
    });
  });

  describe('voteOnPoll', () => {
    it('should vote on a poll successfully', async () => {
      mockSupabaseClient.mockReturnValueOnce({ success: true });

      const result = await pollsModule.voteOnPoll('123', '456');

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('poll_options');
      expect(mockSupabaseClient.update).toHaveBeenCalled();
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '456');
      expect(result).toEqual({ ok: true });
    });

    it('should handle errors when voting on a poll', async () => {
      mockSupabaseClient.mockReturnValueOnce(null, { message: 'Database error' });

      const result = await pollsModule.voteOnPoll('123', '456');

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('poll_options');
      expect(mockSupabaseClient.update).toHaveBeenCalled();
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '456');
      expect(result).toEqual({ ok: false, error: 'Database error' });
    });

    it('should return an error if the user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

      const result = await pollsModule.voteOnPoll('123', '456');

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
      expect(result).toEqual({ ok: false, error: 'You must be logged in to vote.' });
    });
  });
});
