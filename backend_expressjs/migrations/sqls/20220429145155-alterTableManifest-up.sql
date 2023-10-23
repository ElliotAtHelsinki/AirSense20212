/* Replace with your SQL commands */
drop table if exists manifest_authen cascade;
-- manifest_authen: table
CREATE TABLE `manifest_authen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(20) NOT NULL,
  `content` varchar(100) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

