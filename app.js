const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'chat_log',
});

app.get('/messages', async (req, res) => {
    try {
      const messages = await db.query('SELECT * FROM chat_log.messages');
      const formattedMessages = JSON.parse(JSON.stringify(messages.data));
      
      const links = [
        {
          rel: 'self',
          href: '/messages',
        },
      ];
  
      res.json({
        _links: links,
        messages: formattedMessages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.get('/messages/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const message = await db.query('SELECT * FROM chat_log.messages WHERE id = ?', [id]);
      const formattedMessage = JSON.parse(JSON.stringify(message));
      
      const links = [
        {
          rel: 'self',
          href: `/messages/${id}`,
        },
      ];
  
      res.json({
        _links: links,
        message: formattedMessage,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});