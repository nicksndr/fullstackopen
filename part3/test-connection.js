require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('Testing connection to MongoDB...')
console.log('Connection string:', url.replace(/:([^:@]+)@/, ':****@')) // Hide password

mongoose.connect(url, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!')
    mongoose.connection.close()
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Failed to connect to MongoDB')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)

    if (error.message.includes('ENOTFOUND')) {
      console.error('\n🔍 DNS Resolution Issue: Cannot find MongoDB server hostname')
      console.error('Possible solutions:')
      console.error('1. Check your internet connection')
      console.error('2. Try using a different network (e.g., mobile hotspot)')
      console.error('3. Flush DNS cache: sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder')
      console.error('4. Check if VPN is blocking the connection')
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timed out')) {
      console.error('\n⏱️  Connection Timeout Issue')
      console.error('Possible solutions:')
      console.error('1. Check MongoDB Atlas Network Access (whitelist 0.0.0.0/0)')
      console.error('2. Make sure cluster is not paused')
      console.error('3. Try a different network')
      console.error('4. Check firewall settings')
    }

    process.exit(1)
  })

