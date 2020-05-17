module.exports = {
    HOST: "0.0.0.0",
    USER: "postgres",
    PASSWORD: "F1234Cytu",
    DB: "teste1",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }