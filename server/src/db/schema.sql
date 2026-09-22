-- PayTodo PostgreSQL Database Schema for Supabase

-- Drop tables if needed during clean migration (in reverse dependency order)
-- DROP TABLE IF EXISTS webhook_events CASCADE;
-- DROP TABLE IF EXISTS tasks CASCADE;
-- DROP TABLE IF EXISTS payments CASCADE;
-- DROP TABLE IF EXISTS subscriptions CASCADE;
-- DROP TABLE IF EXISTS plans CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_name_hash UNIQUE (name, password_hash)
);

-- 2. PLANS TABLE
CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    billing_interval VARCHAR(50) DEFAULT 'monthly',
    description TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    razorpay_plan_id VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    razorpay_subscription_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, cancelled, expired, pending
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'successful', -- pending, successful, failed, refunded
    payment_method VARCHAR(50) DEFAULT 'card_upi',
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TASKS TABLE
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    category VARCHAR(100) DEFAULT 'General',
    priority VARCHAR(50) DEFAULT 'Medium', -- Low, Medium, High
    completed BOOLEAN DEFAULT FALSE,
    recurrence VARCHAR(50) DEFAULT 'None', -- None, Daily, Weekly, Monthly
    checkbox_style VARCHAR(20) DEFAULT 'circle', -- circle, square, ballot, check
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WEBHOOK EVENTS TABLE (for idempotency)
CREATE TABLE IF NOT EXISTS webhook_events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for optimal performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);

-- SEED DEFAULT PLANS
INSERT INTO plans (name, slug, price, billing_interval, description, features, is_active)
VALUES
(
    'Free',
    'free',
    0.00,
    'monthly',
    'Basic to-do list for personal everyday productivity.',
    '["basic_tasks", "task_limit_10"]'::jsonb,
    TRUE
),
(
    'Starter',
    'starter',
    5.00,
    'monthly',
    'Expanded task limits and custom personal style.',
    '["basic_tasks", "more_tasks", "custom_checkboxes"]'::jsonb,
    TRUE
),
(
    'Pro',
    'pro',
    10.00,
    'monthly',
    'Advanced organization with priority tags and custom categories.',
    '["basic_tasks", "more_tasks", "custom_checkboxes", "priority_labels", "categories"]'::jsonb,
    TRUE
),
(
    'Business',
    'business',
    20.00,
    'monthly',
    'Unlimited power, recurring automation, analytics, and CSV exports.',
    '["basic_tasks", "unlimited_tasks", "custom_checkboxes", "priority_labels", "categories", "recurring_tasks", "task_analytics", "export_tasks"]'::jsonb,
    TRUE
)
ON CONFLICT (slug) DO UPDATE 
SET 
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    is_active = EXCLUDED.is_active;
