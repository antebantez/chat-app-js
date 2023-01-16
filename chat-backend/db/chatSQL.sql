CREATE DATABASE "chat_app"
    WITH
    OWNER = postgres
    ENCODING = 'UTF-8'
    CONNECTION LIMIT = -1;

--Connect to database and run rest of the queries--
-- if in gui remove command below and switch manually
\c chat_app


------------

--To change one user to adminRole, run this query after registering an admin account

--
-- update users set user_role = 'admin' where user_name = 'admin';
--



------------

CREATE TABLE "users"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY ,
    "user_name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "user_role" VARCHAR(255) NOT NULL
);

INSERT INTO "users" ("user_name", "password", "user_role") VALUES("admin", "pass", "admin")

CREATE TABLE "chats"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_by" uuid NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    CONSTRAINT created_by_fk FOREIGN KEY(created_by) REFERENCES users(id)
);

CREATE TABLE "chat_users"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "chat_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "banned" BOOLEAN NOT NULL DEFAULT FALSE,
    "invitation_accepted" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT chat_id_fk FOREIGN KEY(chat_id) REFERENCES chats(id),
    CONSTRAINT user_id_fk FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE "messages"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "chat_id" uuid NOT NULL,
    "from_id" uuid NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "timestamp" TIMESTAMP NOT NULL,
    CONSTRAINT chat_id_fk FOREIGN KEY(chat_id) REFERENCES chats(id),
    CONSTRAINT from_id_fk FOREIGN KEY(from_id) REFERENCES users(id)
);

CREATE TABLE "user_blockings"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" uuid NOT NULL,
    "blocked_user_id" uuid NOT null,
    CONSTRAINT user_id_fk FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT blocked_user_id_fk FOREIGN KEY(blocked_user_id) REFERENCES users(id)
);




CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- SQL functions


-- Checks if user is admin or creator of the chat
CREATE OR REPLACE FUNCTION f_insert_chat_creator()
RETURNS trigger AS $$
BEGIN
    INSERT INTO chat_users (chat_id, user_id, invitation_accepted)
    VALUES (new.id, new.created_by, true);
    return NEW;
END;
$$
language plpgsql;

CREATE TRIGGER t_create_chat 
    AFTER INSERT ON chats
    FOR EACH ROW
    EXECUTE PROCEDURE f_insert_chat_creator();