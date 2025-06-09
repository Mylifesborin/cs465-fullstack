// Bring in the DB connection and the Trip schema
const Mongoose = require('./db');
const Trip = require('./travlr'); // make sure this exports the model

// Read seed data from JSON file
const fs = require('fs');
const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

// Seed the database
const seedDB = async () => {
  try {
    await Trip.deleteMany({});
    console.log('Deleted all existing trips');

    await Trip.insertMany(trips);
    console.log('Inserted new trip data');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await Mongoose.connection.close();
    console.log('Closed DB connection');
    process.exit(0);
  }
};

// Wait for Mongoose to be connected before seeding
Mongoose.connection.once('open', () => {
  console.log('MongoDB connection open, starting seed...');
  seedDB();
});
