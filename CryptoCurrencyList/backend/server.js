

const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes, Op } = require('sequelize');
const cors =require('cors')
// Initialize app and database
const app = express();
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // SQLite database file
});

app.use(cors());


// app.use(
//   cors({
//     origin: 'http://localhost:3000', // Allow requests only from this origin
//     methods: ['GET', 'POST'], // Specify allowed HTTP methods
//     allowedHeaders: ['Content-Type'], // Specify allowed headers
//   })
// );
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync database
sequelize.sync({ force: true }).then(() => {
  console.log('Database synced.');
});

// Routes

// 1. Register a user
app.post('/register', async (req, res) => {
  try {
    const { name, username, password, email, gender, country } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    // Create the new user
    const newUser = await User.create({ name, username, password, email, gender, country });
    res.status(201).json({ message: 'User registered successfully.', user: newUser });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

// 2. Login a user
// app.post('/login', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Ensure either username or email is provided
//     if (!username && !email) {
//       return res.status(400).json({ message: 'Username or email is required.' });
//     }

//     // Find user by username or email
//     const user = await User.findOne({
//       where: {
//         [Op.or]: [
//           { username: username || null },
//           { email: email || null },
//         ],
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     // Check if the password matches
//     if (user.password !== password) {
//       return res.status(400).json({ message: 'Invalid password.' });
//     }

//     return res.status(200).json({ message: 'Login successful.', user });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ message: 'Internal server error.', error: error.message });
//   }
// });


// 2. Login a user
app.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Ensure either username or email is provided
    if (!username && !email) {
      return res.status(400).json({ message: 'Username or email is required.' });
    }

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: username }, // Match username if provided
          { email: email },        // Match email if provided
        ],
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    return res.status(200).json({ message: 'Login successful.', user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});



// 3. Get all users (server-side only, no authentication)
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

// Start the server
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
