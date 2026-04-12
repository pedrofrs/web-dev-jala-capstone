// Jest setup test - validates testing environment
describe('Testing Environment', () => {
  it('should have Jest configured correctly', () => {
    expect(jest).toBeDefined();
  });

  it('should support basic assertions', () => {
    const result = 1 + 1;
    expect(result).toBe(2);
  });
});

