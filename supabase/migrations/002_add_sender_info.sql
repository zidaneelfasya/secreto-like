-- Add sender information to messages table
alter table messages add column sender_ip inet;
alter table messages add column sender_user_agent text;
alter table messages add column sender_location text;
