import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import seedRoutes from './routes/seedsRoutes.js';
import seedBankRoutes from './routes/seedBankRoutes.js';

const app = express();

app.use(bodyParser.json());

app.use('/api/seeds', seedRoutes);
app.use('/api/seedBanks', seedBankRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

export default app;