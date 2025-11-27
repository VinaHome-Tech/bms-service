export default () => ({
  service: {
    port: process.env.PORT_SERVICE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
    queue: process.env.RABBITMQ_QUEUE,
  },

  
  connect: {
    port: parseInt(process.env.PORT_SERVICE || '3000', 10),
    host: process.env.HOST_SERVICE,
  },
  gateway: {
    public_api: process.env.PUBLIC_API_GATEWAY,
  },
  
  nats: {
    url: process.env.NATS_SERVER,
    user: process.env.NATS_USER || '',
    pass: process.env.NATS_PASS || '',
  },

});
