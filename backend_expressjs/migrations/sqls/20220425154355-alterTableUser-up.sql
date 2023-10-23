drop table if exists user cascade;

-- user: table
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `phone_number` varchar(20) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci NOT NULL,
  `contact` varchar(255) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_id` int(11) DEFAULT NULL,
  `updated_id` int(11) DEFAULT NULL,
  `note` varchar(255) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_uindex` (`email`),
  UNIQUE KEY `user_name_uindex` (`name`),
  UNIQUE KEY `user_phone_number_uindex` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;




