require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 PayTodo Server is running smoothly on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
