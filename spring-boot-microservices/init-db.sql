-- Create databases for each microservice
CREATE DATABASE userdb;
CREATE DATABASE eventdb;
CREATE DATABASE notificationdb;

-- Create user for the application
CREATE USER eventhub_user WITH PASSWORD 'password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE userdb TO eventhub_user;
GRANT ALL PRIVILEGES ON DATABASE eventdb TO eventhub_user;
GRANT ALL PRIVILEGES ON DATABASE notificationdb TO eventhub_user;

-- Connect to userdb and create extensions
\c userdb;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Connect to eventdb and create extensions
\c eventdb;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Connect to notificationdb and create extensions
\c notificationdb;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
