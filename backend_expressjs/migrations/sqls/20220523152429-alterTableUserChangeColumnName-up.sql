/* Replace with your SQL commands */
alter table user
    change name user_name varchar(24) collate utf32_unicode_ci not null;
