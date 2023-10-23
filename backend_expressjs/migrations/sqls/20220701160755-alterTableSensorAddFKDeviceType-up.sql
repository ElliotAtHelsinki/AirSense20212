/* Replace with your SQL commands */
alter table sensor_device
    add constraint sensor_device_sensor_device_type_id_fk
        foreign key (device_type) references sensor_device_type (id)
            on update cascade on delete set null;
create unique index sensor_device_type_type_name_uindex
	on sensor_device_type (type_name);
