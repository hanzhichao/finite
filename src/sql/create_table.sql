CREATE TABLE IF NOT EXISTS "notes"
(
    id          VARCHAR(64) PRIMARY KEY,
    parent      VARCHAR(64),
    title       VARCHAR(255) NOT NULL,
    icon        CHAR(1),
    tags        VARCHAR(255),
    cover       TEXT,
    content     TEXT,
    markdown    TEXT,
    is_archived BOOLEAN  DEFAULT false,
    is_favorite BOOLEAN  DEFAULT false,
    is_locked   BOOLEAN  DEFAULT false,
    is_template BOOLEAN  DEFAULT false,
    create_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "by_parent" ON notes (parent);

CREATE TABLE IF NOT EXISTS "properties"
(
    id   VARCHAR(64) PRIMARY KEY,
    key  VARCHAR(255) NOT NULL,
    type SMALLINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "options"
(
    property_id VARCHAR(64),
    label       VARCHAR(255) UNIQUE NOT NULL,
    value       VARCHAR(255) UNIQUE NOT NULL,
    bg_color    VARCHAR(32),
    FOREIGN KEY (property_id) REFERENCES properties (id)
);

CREATE TABLE IF NOT EXISTS "notes_properties"
(
    property_id VARCHAR(64),
    note_id     VARCHAR(64),
    value       VARCHAR(255),
    is_visible  BOOLEAN DEFAULT true,
    FOREIGN KEY (property_id) REFERENCES properties (id),
    FOREIGN KEY (note_id) REFERENCES notes (id)
);