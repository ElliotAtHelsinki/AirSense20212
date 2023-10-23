/* Replace with your SQL commands */
drop table if exists sparc_location_sensor ;
drop table if exists sparc_group_location_sensor ;
drop table if exists sparc_sensor_max_min ;
drop table if exists sparc_sensor_warning ;
drop table if exists status_history_device ;
drop table if exists sparc_access_location_sensor ;

create table sensor_device
(
    id          int auto_increment,
    macId       varchar(255)                         not null,
    avatar       varchar(255)                        null,
    location_id int                                  null,
    is_active   tinyint  default 0                   null,
    step_time   int      default 300                 null comment 'giây',
    created_at  datetime default current_timestamp() null,
    updated_at  datetime default current_timestamp() null,
    deleted_at     datetime                             null,
    created_id  int                                  null,
    updated_id  int                                  null,
    device_type int      default 1                   null,
    constraint sensor_device_pk
        primary key (id),
    constraint sensor_device_location_id_fk
        foreign key (location_id) references location (id)
            on update cascade on delete set null
);

create unique index sensor_device_macId_uindex
    on sensor_device (macId);


