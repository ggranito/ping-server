/* Add Extensions */
-- Generate UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 

/* Set up Ping Application Server Account */
DROP USER IF EXISTS pingapp;
CREATE USER pingapp WITH PASSWORD 'pingapp';

/*
 *  USER TABLES
 */

/* Main User Row*/
CREATE TABLE users (
    first_name VARCHAR(50),
    -- Auto Generated below
    id UUID NOT NULL DEFAULT uuid_generate_v4 (),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);
GRANT SELECT ON users TO pingapp;
GRANT INSERT(first_name) ON users TO pingapp; --no permission to create uuids
GRANT UPDATE(first_name) ON users TO pingapp; --Same but with update

/* Password Credentials */
CREATE TABLE user_credentials_password (
    username VARCHAR(50) PRIMARY KEY,
    bcrypted_pword VARCHAR(60) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    --Auto Generated Below
    created_at TIMESTAMP DEFAULT NOW()
);
GRANT SELECT, DELETE ON user_credentials_password TO pingapp;
GRANT INSERT(username, bcrypted_pword, user_id) ON user_credentials_password TO pingapp;

/*
 *  Audiopile Tables
 */

CREATE TABLE audiopile (
    creator UUID REFERENCES users(id) NOT NULL,
    -- Auto generated below
    id UUID NOT NULL DEFAULT uuid_generate_v4 (),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);
GRANT SELECT, INSERT(creator) ON audiopile TO pingapp;

/*
 *  Call Tables
 */

CREATE TABLE calls (
    sender UUID REFERENCES users(id) NOT NULL,
    sender_audio UUID REFERENCES audiopile(id) NOT NULL,
    recipient UUID REFERENCES users(id),
    -- Start autogenerated
    id UUID NOT NULL DEFAULT uuid_generate_v4 (),
    call_start TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);
GRANT SELECT, INSERT(sender, sender_audio, recipient) ON calls TO pingapp;
GRANT UPDATE(recipient) ON calls to pingapp;