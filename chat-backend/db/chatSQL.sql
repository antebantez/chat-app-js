CREATE DATABASE "chat_app"
    WITH
    OWNER = postgres
    ENCODING = 'UTF-8'
    CONNECTION LIMIT = -1;

CREATE TABLE "users"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY ,
    "user_name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "user_role" VARCHAR(255) NOT NULL
);

CREATE TABLE "chats"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "subject" VARCHAR(255) NOT NULL
);

CREATE TABLE "chat_users"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "chat_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "invitation_accepted" BOOLEAN NOT NULL,
    "creator" BOOLEAN NOT NULL
);

CREATE TABLE "messages"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "chat_id" uuid NOT NULL,
    "timestamp" DATE NOT NULL
);

CREATE TABLE "user_blockings"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" uuid NOT NULL,
    "blocked_user_id" uuid NOT NULL
);

ALTER TABLE
    "chat_users" ADD CONSTRAINT "chat_users_chat_id_foreign" FOREIGN KEY("chat_id") REFERENCES "chats"("id");
ALTER TABLE
    "chat_users" ADD CONSTRAINT "chat_users_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "messages" ADD CONSTRAINT "messages_chat_id_foreign" FOREIGN KEY("chat_id") REFERENCES "chats"("id");
ALTER TABLE
    "user_blockings" ADD CONSTRAINT "user_blockings_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "user_blockings" ADD CONSTRAINT "user_blockings_blocked_user_id_foreign" FOREIGN KEY("blocked_user_id") REFERENCES "users"("id");





CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");