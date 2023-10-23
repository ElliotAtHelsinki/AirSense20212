/* Replace with your SQL commands */

alter table user
    modify phone_number varchar(20) null;

alter table user
    add first_name varchar(255) collate utf32_unicode_ci not null;

alter table user
    add last_name varchar(255) collate utf32_unicode_ci not null;

alter table user
    add gender tinyint null;

alter table user
    add date_of_birth DATE null;

drop index user_name_uindex on user;

alter table user
    drop column user_name;
alter table user
    drop column  full_name;


