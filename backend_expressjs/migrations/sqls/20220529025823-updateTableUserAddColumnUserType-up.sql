/* Replace with your SQL commands */
alter table user
    add user_type_id int default 4;

alter table user
    add constraint user_user_type_id_fk
        foreign key (user_type_id) references user_type (id)
            on update cascade on delete set null;

UPDATE airsense.user t
SET t.user_type_id = 1
WHERE t.id = 1;
