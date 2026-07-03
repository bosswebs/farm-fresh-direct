BEGIN;
DROP TABLE IF EXISTS security_events, password_reset_tokens, authentication_attempts, application_sessions;
DELETE FROM schema_migrations WHERE version = '003_auth_security';
COMMIT;
