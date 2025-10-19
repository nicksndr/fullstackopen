const mongoose = require('mongoose')

const password = '5HTYlPTMqAzufrHB'
const url = `mongodb+srv://nicklas-user:${password}@fullstackopen.ne6xdzf.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.connect(url)
  .then(() => {
    console.log('✅ Connected successfully')
    return mongoose.connection.close()
  })
  .catch(err => {
    console.error('❌ Connection failed:', err)
  })