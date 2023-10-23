/* Replace with your SQL commands */
INSERT INTO airsense.user_type (name,vi_name,is_active ,deleted_at , created_at, updated_at)
VALUES
        ('admin', 'quản trị hệ thống',1, null, DEFAULT, DEFAULT) ,
        ('teacher', 'cộng tác viên giảng dạy',1, null, DEFAULT, DEFAULT) ,
        ('blogger', 'cộng tác viên viết bài',1, null, DEFAULT, DEFAULT) ,
        ('customer', 'khách hàng',1, null, DEFAULT, DEFAULT) ,
        ('sensorOwner', 'admin trạm',1, null, DEFAULT, DEFAULT)
;
