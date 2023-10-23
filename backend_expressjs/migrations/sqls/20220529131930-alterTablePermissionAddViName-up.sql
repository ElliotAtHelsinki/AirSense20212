/* Replace with your SQL commands */
alter table permission
    add vi_name varchar(255) collate utf8mb4_vietnamese_ci null;

alter table permission
    add parent_id int null;
