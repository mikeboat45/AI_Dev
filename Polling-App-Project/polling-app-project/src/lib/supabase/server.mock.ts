// Mock for Supabase server client

export const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  rpc: jest.fn().mockReturnThis(),
  count: jest.fn().mockReturnThis(),
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123', email: 'test@example.com' } } }),
  },
  _data: null as any,
  _error: null as any,
  _responses: [] as Array<{data: any, error: any}>,
  _responseIndex: 0,
  
  // Mock implementation for then to simulate async response
  then: jest.fn().mockImplementation(function(callback) {
    if (this._responses.length > 0) {
      const response = this._responses[this._responseIndex];
      this._responseIndex = (this._responseIndex + 1) % this._responses.length;
      return Promise.resolve(callback(response));
    }
    return Promise.resolve(callback({ data: this._data, error: this._error }));
  }),
  
  // Helper to set mock return values
  mockReturnValueOnce: function(data: any, error: any = null) {
    this._responses.push({ data, error });
    return this;
  },
  
  // Reset the mock
  mockReset: function() {
    this._data = null;
    this._error = null;
    this._responses = [];
    this._responseIndex = 0;
    return this;
  }
};

// Create a proper mock that returns the mockSupabaseClient
export const getSupabaseServerClient = jest.fn(() => mockSupabaseClient);