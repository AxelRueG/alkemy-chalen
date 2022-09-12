ALTER TABLE profile ADD CONSTRAINT uk_email UNIQUE (email);

-- in the new model of the tables operation_type is an category
ALTER TABLE operation DROP COLUMN operation_type;

-- creating new table
CREATE TABLE img_profile (
  id      SERIAL        NOT NULL,
  img_url VARCHAR(250)  NOT NULL,
  CONSTRAINT pk_img_profile PRIMARY KEY (id),
  CONSTRAINT uk_img_url UNIQUE (img_url)
);

INSERT INTO img_profile (img_url) 
  VALUES ('http://localhost:3000/public/profile-img/user_profile_default.webp');

ALTER TABLE profile DROP COLUMN img;
ALTER TABLE profile ADD COLUMN id_img INT NOT NULL DEFAULT 1;
ALTER TABLE profile ADD CONSTRAINT fk_user_img FOREIGN KEY (id_img) REFERENCES img_profile(id);