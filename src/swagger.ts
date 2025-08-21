const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';

const endpointsFiles = ['src/index.ts'];

const doc = {
    info: {
        title: 'Express API',
        description: 'Automatically generated Swagger documentation',
    },
    host: 'localhost:3000',

    schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated!');
});
