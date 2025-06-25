const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:admin@cluster0.9vqrteh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['jobseeker', 'admin'] },
  location: String,
  skills: [String]
});

const applicationSchema = new mongoose.Schema({
  jobId: String,
  jobTitle: String,
  jobCompany: String,
  applicantName: String,
  applicantEmail: String,
  status: { type: String, default: 'pending' }, // ✅ Add this line
  dateApplied: { type: Date, default: Date.now }
});


const User = mongoose.model('User', userSchema);
const Application = mongoose.model('Application', applicationSchema);

async function connectToMongoDB() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

connectToMongoDB();

module.exports = { User, Application };