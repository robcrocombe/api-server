import express from 'express';
import dotenv from 'dotenv';
import log from './log';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';

dotenv.config();

const app = express();

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

const port = process.env.CSBLOGS_API_PORT;

app.listen(port, () => {
  log.info({ port }, 'CSBlogs API now running');
});
