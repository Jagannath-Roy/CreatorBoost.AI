import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { app } from './app.js';

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`\n MongoDB connected! DB Host: ${mongoose.connection.host}`);
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGODB connection FAILED: ", err);
    process.exit(1);
  });
