const express = require('express');
const { sequelize } = require('./models');
const userRoutes = require('./routes/user');
const deedRoutes= require("./routes/deed");
const disputeRoutes = require("./routes/dispute");
const logRoutes = require("./routes/log");
const workRoutes = require("./routes/work");
const faqRoutes = require('./routes/faq');

const app = express();

app.use(express.json());
app.use('/user', userRoutes);
app.use('/deed', deedRoutes);
app.use('/dispute', disputeRoutes);
app.use('/log', logRoutes);
app.use('/work', workRoutes);
app.use('/faq', faqRoutes); 

app.get('/', (req, res) => {
  res.send('Escrow Backend Server');
});

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});
