CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY,
  display_name TEXT,
  timezone TEXT NOT NULL DEFAULT 'Africa/Lagos',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  body TEXT NOT NULL,
  platform TEXT NOT NULL,
  source_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS content_items_user_id_idx ON content_items (user_id);

CREATE TABLE IF NOT EXISTS promises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  evidence_quote TEXT NOT NULL,
  summary TEXT NOT NULL,
  promise_type TEXT NOT NULL,
  due_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'open',
  confidence TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fulfilled_at TIMESTAMPTZ,
  CONSTRAINT promises_status_check CHECK (status IN ('open', 'drafted', 'fulfilled', 'dismissed')),
  CONSTRAINT promises_confidence_check CHECK (confidence IN ('high', 'medium', 'low'))
);

CREATE INDEX IF NOT EXISTS promises_user_id_idx ON promises (user_id);
CREATE INDEX IF NOT EXISTS promises_content_item_id_idx ON promises (content_item_id);
CREATE UNIQUE INDEX IF NOT EXISTS promises_user_source_evidence_uidx
  ON promises (user_id, content_item_id, evidence_quote);

CREATE TABLE IF NOT EXISTS follow_up_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  promise_id UUID NOT NULL REFERENCES promises(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS follow_up_drafts_user_id_idx ON follow_up_drafts (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS follow_up_drafts_promise_id_uidx ON follow_up_drafts (promise_id);
