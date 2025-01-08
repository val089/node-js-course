const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
  'mongodb+srv://kamilszerlag:qQLIRtav22NKoan2@cluster-nodejs.eeutf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-NodeJS';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

let _db;

const mongoConnect = (callback) => {
  client
    .connect()
    .then((client) => {
      _db = client.db();
      callback(client);
    })
    .catch((err) => console.log(err));
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

// const mongoConnect = () => {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db('admin').command({ ping: 1 });
//     console.log(
//       'Pinged your deployment. You successfully connected to MongoDB!'
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
