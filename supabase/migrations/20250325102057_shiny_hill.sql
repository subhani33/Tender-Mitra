/*
  # Initial Schema Setup for EdtoDo Platform

  1. Tables
    - users (managed by Supabase Auth)
    - tenders
      - id (uuid, primary key)
      - title (text)
      - department (text)
      - deadline (timestamp with time zone)
      - value (numeric)
      - status (text)
      - created_at (timestamp with time zone)
      - user_id (uuid, foreign key to auth.users)
    
    - learning_progress
      - id (uuid, primary key)
      - user_id (uuid, foreign key to auth.users)
      - resource_id (text)
      - completed (boolean)
      - completed_at (timestamp with time zone)
      - created_at (timestamp with time zone)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Create tenders table
CREATE TABLE IF NOT EXISTS tenders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  deadline timestamptz NOT NULL,
  value numeric NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create learning_progress table
CREATE TABLE IF NOT EXISTS learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  resource_id text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

-- Policies for tenders
CREATE POLICY "Users can view their own tenders"
  ON tenders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tenders"
  ON tenders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tenders"
  ON tenders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for learning_progress
CREATE POLICY "Users can view their own learning progress"
  ON learning_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning progress"
  ON learning_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning progress"
  ON learning_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);