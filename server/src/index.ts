import message from 'shared';
import pino from 'pino';

const logger = pino({
  prettyPrint: true,
});

logger.info(message);
