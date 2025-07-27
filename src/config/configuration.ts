export default () => ({
  connect: {
    port: parseInt(process.env.PORT_SERVICE || '3000', 10),
    host: process.env.HOST_SERVICE,
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  nats: {
    url: process.env.NATS_SERVER,
  },
});
