const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const otelApi  = require("@opentelemetry/api");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { registerInstrumentations }  = require( "@opentelemetry/instrumentation");
const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { WinstonInstrumentation } = require("@opentelemetry/instrumentation-winston");
const { ExpressInstrumentation }  = require("@opentelemetry/instrumentation-express");
const { GraphQLInstrumentation }  = require("@opentelemetry/instrumentation-graphql");

//###### OTEL initialization begin
const resource = Resource.default().merge(new Resource({
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: "graphql",
    [SemanticResourceAttributes.SERVICE_NAME]: "subgraph",
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: "DEV",
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.VERSION || "latest",
    ["nodejs.version"]: process.version,
}));

const provider = new NodeTracerProvider({
    resource,
});

provider.register();

registerInstrumentations({
    instrumentations:  [
        new HttpInstrumentation({}),
        new ExpressInstrumentation({}),
        new WinstonInstrumentation({}),
        new GraphQLInstrumentation(),
    ],
});

// Init logger here so WinstonInstrumentation added in previous command is really used
const winston = require("winston");
const log = winston.createLogger({level: "info", format: winston.format.simple(), transports: [new winston.transports.Console()]});

// winston misses correct `verbose` method required by diag, so we have to add it and translate it to debug
const ol = {
    warn(msg){log.warn(msg);},
    info(msg){log.info(msg);},
    error(msg){log.error(msg);},
    debug(msg){log.debug(msg);},
    verbose(msg){log.debug(msg);},
};
otelApi.diag.setLogger(ol, otelApi.DiagLogLevel.VERBOSE);

log.info(`Open-telemetry initialized.`);
//###### OTEL initialization end


//###### Apollo gateway initialization begin
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
        subgraphs: [
            { name: 'accounts', url: 'http://localhost:4001' },
        ],
    }),
});

const server = new ApolloServer({
    gateway,
});

startStandaloneServer(server, { listen: { port: 4000} })
    .then((value) => {
        console.log(`🚀  Server ready at ${value.url}`);
    }).catch((error) => {
        console.error(error);
    });
 

