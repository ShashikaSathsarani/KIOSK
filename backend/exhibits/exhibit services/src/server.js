import app from './index.js';

const PORT = process.env.PORT || process.env.BACKEND_EXHIBITS_SERVICE_PORT || 5003;

app.listen(PORT, () => {
  console.log(`Exhibit Service running on port ${PORT}`);
});

export default null;
