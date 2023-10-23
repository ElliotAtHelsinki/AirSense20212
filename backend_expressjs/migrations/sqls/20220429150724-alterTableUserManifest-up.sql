/* Replace with your SQL commands */
drop table if exists user_ref_manifest cascade;
-- user_ref_manifest: table
CREATE TABLE `user_ref_manifest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `manifest_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_id` int(11) DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_manifest_manifest_authen_id_fk` (`manifest_id`),
  KEY `user_ref_manifest_user_id_fk` (`user_id`),
  CONSTRAINT `user_manifest_manifest_authen_id_fk` FOREIGN KEY (`manifest_id`) REFERENCES `manifest_authen` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_ref_manifest_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


