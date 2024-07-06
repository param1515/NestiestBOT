module.exports = {
    type: 'sqlite',
    database: 'subscribers.sqlite',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
};
