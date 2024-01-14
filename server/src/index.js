const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Orders = require('./models/Orders');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', true);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/takeaway',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB models
const Node = require('./models/Node');
const Edge = require('./models/Edge');

// Routes
const nodesRoutes = require('./routes/nodesRoutes');
const edgesRoutes = require('./routes/edgesRoutes');
const shortestPathRoutes = require('./routes/shortestPathRoutes');
const usersRouter = require('./routes/usersRouter');
const loginRouter = require('./routes/loginRouter');
const ordersRouter = require('./routes/ordersRouter');
const itemsRouter = require('./routes/itemsRouter');
const registerRouter = require('./routes/registerRouter');
const sendMailRouter = require('./routes/sendMailRouter');

// Socket.IO
io.on('connection', (socket) => {
  console.log('Socket is connected');
  socket.on('orderRequest', async (orderRequest) => {
    io.emit('orderRequest', orderRequest);
    await Orders.findByIdAndUpdate(orderRequest.id, {
      orderStatus: orderRequest.status,
      orderStatusId: orderRequest.statusId,
    });
  });
});

// REST API routes
app.use('/api/nodes', nodesRoutes);
app.use('/api/edges', edgesRoutes);
app.use('/api/shortest-path', shortestPathRoutes);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/items', itemsRouter);
app.use('/api/register', registerRouter);
app.use('/api/send-mail', sendMailRouter);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
