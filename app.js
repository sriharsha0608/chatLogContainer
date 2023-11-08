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
    } 
    catch (error) {
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
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
app.delete('/messages/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      await db.query('DELETE FROM chat_log.messages WHERE id = ?', [id]);
      res.status(204).json({ message: 'Message deleted successfully' });
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.post('/messages', async (req, res) => {
    const { text } = req.body;
  
    try {
     
      const result = await db.query('INSERT INTO chat_log.messages (text) VALUES (?)', [text]);
  
      const newMessageId = result.insertId; 
  
      const links = [
        {
          rel: 'self',
          href: `/messages/${newMessageId}`,
        },
      ];
  
      res.status(201).json({
        _links: links,
        message: {
          id: newMessageId,
          text: text,
          timestamp: new Date(),
        },
      });
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
