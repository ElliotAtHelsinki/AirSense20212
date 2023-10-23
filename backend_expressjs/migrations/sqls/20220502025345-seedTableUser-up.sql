/* Replace with your SQL commands */
INSERT INTO airsense.user (name, full_name, phone_number, email, password, contact, avatar, created_at, updated_at,
                           created_id, updated_id, note, deleted_at)
VALUES ('admin', 'admin', '0389444312', 'admin@gmail.com', '123456aA@', null, null, DEFAULT, DEFAULT, null, null, null,
        null);
INSERT INTO airsense.user_ref_manifest (user_id, manifest_id, created_at, updated_at, created_id, updated_id,
                                        deleted_at)
VALUES (1, 1, DEFAULT, DEFAULT, null, null, null);



