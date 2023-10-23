/* Replace with your SQL commands */
create table user_type
(
    id         int auto_increment,
    name       varchar(255)       not null,
    vi_name    varchar(255) collate utf32_vietnamese_ci null,
    deleted_at datetime                null,
    is_active  tinyint            null,
    created_at datetime default current_timestamp null,
    updated_at datetime default current_timestamp null,
    constraint user_type_pk
        primary key (id)
);

create unique index user_type_name_uindex
    on user_type (name);

