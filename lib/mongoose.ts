import mongoose from 'mongoose'

let isConnected = false;
export const connectToDb = async () => {
    mongoose.set('strictQuery',true);

    if(!process.env.MONGODB_URI) return console.error('Please define the MONGODB_URI environment variable inside .env.local');
    
    if(isConnected) 
        return console.log('MongoDB is already connected');
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.log('MongoDB connection failed:', error);

    }
}