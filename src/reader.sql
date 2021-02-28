PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

CREATE TABLE collection (
  id INTEGER PRIMARY KEY,
  title TEXT
);

CREATE TABLE source (
  id INTEGER PRIMARY KEY,
  collection_id INTEGER,
  title TEXT,
  urlindex INTEGER
);

CREATE TABLE url (
  id INTEGER PRIMARY KEY,
  source_id INTEGER,
  url TEXT,
  scroll INTEGER,
  maxscroll INTEGER
);

CREATE TABLE bookmark (
  id INTEGER PRIMARY KEY,
  url_id INTEGER,
  source_id INTEGER,
  phrase TEXT,
  note TEXT,
  scroll INTEGER
);

CREATE TABLE tag (
  id INTEGER PRIMARY KEY,
  label TEXT
);

CREATE TABLE tag_ref (
  tag_id INTEGER,
  bookmark_id INTEGER
);

CREATE TABLE language (
  source_id INTEGER,
  source_type INTEGER,
  label TEXT
);

CREATE INDEX idx_url_source_id ON url (source_id);
CREATE INDEX idx_source_collection_id ON source (collection_id);
CREATE INDEX idx_bookmark_url_id ON bookmark (url_id);
CREATE INDEX idx_tag_ref_tag_id ON tag_ref (tag_id);
CREATE INDEX idx_tag_ref_bookmark_id ON tag_ref (bookmark_id);

COMMIT;