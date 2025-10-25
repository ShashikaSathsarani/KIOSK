-- ============================================================
-- Notifications Database Setup Script
-- ============================================================

CREATE DATABASE kiosk_notifications;

\c kiosk_notifications;

CREATE TABLE public.notifications (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'info',
    data JSONB,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.notifications (title, body, level, data)
VALUES
('System Update', 'The drone show will start at 8 PM instead of 6 PM.', 'info', '{"event":"drone_show"}'),
('Warning', 'Server CPU usage is high.', 'warning', '{"server":"kiosk-main"}'),
('Error', 'Database connection lost temporarily.', 'error', '{"service":"backend_notifications"}');

SELECT * FROM public.notifications;
