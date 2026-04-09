import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (erro) {
    console.error(`Erro ao conectar com o MongoDB: ${erro.mensagem}`);
    // process.exit(1);
  }
};

export default connectDB;
