test('GET to /api/v1/status should return 200', async () => {
  const response = await fetch(`http://localhost:3000/api/v1/status`);
  expect(response.status).toBe(200);
});

test('GET to /api/v1/status should return 200 by callback', () => {
  return fetch(`http://localhost:3000/api/v1/status`).then((response) => {
    expect(response.status).toBe(200);
  });
});

test('GET to /api/v1/status should return 200 with Promise', () => {
  return new Promise((resolve) => {
    fetch(`http://localhost:3000/api/v1/status`).then((response) => {
      expect(response.status).toBe(200);
      resolve();
    });
  });
});
