ALTER TABLE profile ADD CONSTRAINT uk_email UNIQUE (email);

-- in the new model of the tables operation_type is an category
ALTER TABLE operation DROP CONSTAINT ck_type_operation;
ALTER TABLE operation DROP COLUMN operation_type;