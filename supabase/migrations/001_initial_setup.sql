-- Create profiles table
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create messages table
create table messages (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table messages enable row level security;

-- Create policies for profiles
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);
create policy "Public profiles are viewable by username" on profiles for select using (true);

-- Create policies for messages
create policy "Users can view their own messages" on messages for select using (auth.uid() = recipient_id);
create policy "Anyone can send messages" on messages for insert with check (true);

-- Function to handle user profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- Trigger for automatic profile creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
