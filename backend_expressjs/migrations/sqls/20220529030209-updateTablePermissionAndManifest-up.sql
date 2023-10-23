/* Replace with your SQL commands */

alter table manifest_authen
    add user_type_id int null;

alter table manifest_authen
    add constraint manifest_authen_user_type_id_fk
        foreign key (user_type_id) references user_type (id)
            on update cascade on delete set null;

UPDATE airsense.manifest_authen t
SET t.user_type_id = 2
WHERE t.id = 6;

UPDATE airsense.manifest_authen t
SET t.user_type_id = 5
WHERE t.id = 3;

UPDATE airsense.manifest_authen t
SET t.user_type_id = 1
WHERE t.id = 2;

UPDATE airsense.manifest_authen t
SET t.user_type_id = 1
WHERE t.id = 1;

UPDATE airsense.manifest_authen t
SET t.user_type_id = 3
WHERE t.id = 5;

UPDATE airsense.manifest_authen t
SET t.user_type_id = 4
WHERE t.id = 4;



