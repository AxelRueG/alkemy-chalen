CREATE DATABASE presupuestos;

CREATE TABLE profile (
  id                SERIAL        NOT NULL,
  username          VARCHAR(60)   NOT NULL,
  userpassword      VARCHAR(255)  NOT NULL,
  email             VARCHAR(60)   NOT NULL,
  img               VARCHAR(255)  NOT NULL,

  CONSTRAINT pk_profile PRIMARY KEY (id),
  CONSTRAINT uk_username UNIQUE (username)
);

CREATE TABLE category (
  id                SERIAL        NOT NULL,
  name              VARCHAR(60)   NOT NULL,
  img               VARCHAR(255)  NOT NULL,

  CONSTRAINT pk_category PRIMARY KEY (id)
);

CREATE TABLE OPERATION (
  id                SERIAL        NOT NULL,
  id_profile        INT           NOT NULL,
  id_category       INT           NOT NULL,
  title             VARCHAR(60)   NOT NULL,
  description       VARCHAR(255)  NULL,
  pub_date          DATE          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount            FLOAT         NOT NULL,
  operation_type    VARCHAR(2)    NOT NULL,

  CONSTRAINT pk_operation PRIMARY KEY (id),
  CONSTRAINT fk_operation_profile FOREIGN KEY (id_profile) REFERENCES profile(id),
  CONSTRAINT fk_operation_category FOREIGN KEY (id_category) REFERENCES category(id),
  CONSTRAINT ck_type_operation CHECK (operation_type IN ('entry','egress'))
);