// Script to start both frontend and backend servers
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting development servers...');

// Start the Next.js frontend
const frontend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Start the backend server
const backend = spawn('node', ['server/server.js'], {
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  frontend.kill('SIGINT');
  backend.kill('SIGINT');
  process.exit(0);
});

console.log('Both servers started. Press Ctrl+C to exit.'); 