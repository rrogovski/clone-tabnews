test('GET to /api/v1/status should return 200', async () => {
  const response = await fetch(`http://localhost:3000/api/v1/status`);
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty('now');

  const parsedDate = new Date(responseBody.now).toISOString();
  expect(parsedDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
  expect(parsedDate).toEqual(responseBody.now);

  // expect(responseBody).toHaveProperty('version');
  expect(responseBody.dependencies.database.full_version).toMatch(
    /^\w+ \d+\.\d+/,
  );

  expect(responseBody.dependencies.database.version).toMatch(/^\d+\.\d+/);

  // expect(responseBody).toHaveProperty('max_connections');
  // expect(responseBody.dependencies.database.max_connections).toMatch(/^\d+$/);
  expect(responseBody.dependencies.database.max_connections).toBeGreaterThan(0);

  // expect(responseBody).toHaveProperty('current_connections');
  // expect(responseBody.dependencies.database.current_connections).toMatch(/^\d+$/,);
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});
