/* Replace with your SQL commands */
alter table manifest_authen
    add system_default tinyint default 0 null;
UPDATE airsense.manifest_authen t
SET t.system_default = 1
WHERE t.id = 1;
