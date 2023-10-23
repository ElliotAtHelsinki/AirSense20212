/* Replace with your SQL commands */
-- manifest_ref_permission: table
CREATE TABLE `manifest_ref_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `manifest_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `manifest_ref_permission_manifest_authen_id_fk` (`manifest_id`),
  KEY `manifest_ref_permission_permission_id_fk` (`permission_id`),
  CONSTRAINT `manifest_ref_permission_manifest_authen_id_fk` FOREIGN KEY (`manifest_id`) REFERENCES `manifest_authen` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `manifest_ref_permission_permission_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- No native definition for element: manifest_ref_permission_permission_id_fk (index)


