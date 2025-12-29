import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { connectDatabase, closeDatabase } from './config/database';
import { setupAssociations } from './models/index';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';
import { authMiddleware, AuthRequest, jwtAuthMiddleware } from './middleware/auth';
import { tenantContextMiddleware } from './middleware/tenantContext';

async function startServer(): Promise<void> {
  try {
    // Initialize Express app
    const app: Application = express();

    // Setup middleware
    app.use(helmet({
      contentSecurityPolicy: config.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false
    }));
    
    app.use(cors({
      origin: config.CORS_ORIGIN,
      credentials: true
    }));
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Connect to database
    await connectDatabase();
    
    // Setup model associations
    setupAssociations();

    // Apply custom middleware
    app.use(authMiddleware);
    app.use(tenantContextMiddleware);
    
// initialize Apollo Server
 const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,

  introspection: config.NODE_ENV === 'development',

  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      code: error.extensions?.code,
      path: error.path
    };
  }
});

await apolloServer.start();

app.use(
  '/graphql',
  express.json(),
  jwtAuthMiddleware,
  expressMiddleware(apolloServer, {  
    context: async ({ req }: { req: AuthRequest }) => ({
      userId: req.userId,
      organizationId: req.organizationId,
    }),
  })
);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV
      });
    });

    // Start server
    app.listen(config.PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🚀 Server is running!                                  ║
║                                                          ║
║   📍 URL: http://localhost:${config.PORT}                          ║
║   🔗 GraphQL: http://localhost:${config.PORT}/graphql              ║
║   🏥 Health: http://localhost:${config.PORT}/health                ║
║   🌍 Environment: ${config.NODE_ENV.padEnd(10)}                            ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      await closeDatabase();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server');
      await closeDatabase();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();