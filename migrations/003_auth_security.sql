BEGIN;

CREATE TABLE application_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES application_users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expires_at > created_at)
);

CREATE INDEX application_sessions_user_id_idx ON application_sessions(user_id);
CREATE INDEX application_sessions_active_token_idx
  ON application_sessions(token_hash, expires_at) WHERE revoked_at IS NULL;

CREATE TABLE authentication_attempts (
  identifier_hash text PRIMARY KEY,
  failed_count integer NOT NULL DEFAULT 0 CHECK (failed_count >= 0),
  window_started_at timestamptz NOT NULL DEFAULT now(),
  blocked_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES application_users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expires_at > created_at)
);

CREATE INDEX password_reset_tokens_user_id_idx ON password_reset_tokens(user_id);

CREATE TABLE security_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES application_users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('success','failure','blocked')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX security_events_type_date_idx ON security_events(event_type, created_at DESC);

INSERT INTO schema_migrations(version) VALUES ('003_auth_security');
COMMIT;
