drop table if exists location ;
create table location
(
    id            int auto_increment,
    location_name varchar(255)   CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci    not null,
    latitude      float(8,5)                               null,
    longitude    float(8,5)                                null,
    avatar        varchar(255)                         null,
    description   text         CHARACTER SET utf8mb4 collate utf8mb4_vietnamese_ci        null,
    contact       varchar(255)     CHARACTER SET utf8mb4  collate utf8mb4_vietnamese_ci    null,
    status        int      default 1                   null comment '1 : thử nghiệm
2 : hoạt động chính thức
3 : dừng hoạt động',
    testing_date  date                                 null,
    created_at    datetime default current_timestamp() null,
    updated_at    datetime default current_timestamp() null,
    deleted_at    datetime                             null,
    created_id    int                                  null,
    updated_id    int                                  null,
    constraint location_pk
        primary key (id)
);

create unique index location_location_name_uindex
    on location (location_name);

