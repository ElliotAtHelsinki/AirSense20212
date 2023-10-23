-- address: table

CREATE TABLE `address` (
  `addrid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `contactPhoneNumber` varchar(20) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `province` varchar(100) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `city` varchar(100) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `streetaddr` varchar(100) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `postCode` varchar(12) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`addrid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- content_group: table
CREATE TABLE `content_group` (
  `content_group_id` int(11) NOT NULL AUTO_INCREMENT,
  `content_group` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `title` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`content_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- content_page: table
CREATE TABLE `content_page` (
  `content_page_id` int(11) NOT NULL AUTO_INCREMENT,
  `content_sub_id` int(11) NOT NULL,
  `group_file` varchar(50) DEFAULT NULL,
  `filesave` varchar(100) DEFAULT NULL,
  `title` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `content` varchar(1024) CHARACTER SET utf8 DEFAULT NULL,
  `content_img` varchar(1024) CHARACTER SET utf8 DEFAULT NULL,
  `is_main_pages_id` int(11) NOT NULL,
  `set_to_fist` bigint(20) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`content_page_id`)
) ENGINE=InnoDB AUTO_INCREMENT=544 DEFAULT CHARSET=latin1;

-- content_sub: table
CREATE TABLE `content_sub` (
  `content_sub_id` int(11) NOT NULL AUTO_INCREMENT,
  `content_group` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `content_group_id` int(11) NOT NULL,
  `title` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`content_sub_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=latin1;

-- course: table
CREATE TABLE `course` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_group` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `course_group_id` int(11) NOT NULL,
  `title` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=latin1;

-- course_group: table
CREATE TABLE `course_group` (
  `course_group_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_group` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `title` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`course_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- course_page: table
CREATE TABLE `course_page` (
  `course_page_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `group_file` varchar(50) DEFAULT NULL,
  `filesave` varchar(100) DEFAULT NULL,
  `title` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `content` varchar(1024) CHARACTER SET utf8 DEFAULT NULL,
  `content_img` varchar(1024) CHARACTER SET utf8 DEFAULT NULL,
  `is_main_pages_id` int(11) NOT NULL,
  `set_to_fist` bigint(20) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`course_page_id`)
) ENGINE=InnoDB AUTO_INCREMENT=542 DEFAULT CHARSET=latin1;

-- course_register: table
CREATE TABLE `course_register` (
  `course_register_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `value` int(11) NOT NULL,
  `bank` varchar(128) CHARACTER SET utf8 DEFAULT NULL,
  `detail_bank` varchar(128) CHARACTER SET utf8 DEFAULT NULL,
  `content` varchar(128) CHARACTER SET utf8 DEFAULT NULL,
  `course_register_status_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`course_register_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- course_register_status: table
CREATE TABLE `course_register_status` (
  `course_register_status_id` int(11) NOT NULL AUTO_INCREMENT,
  `value` int(11) NOT NULL,
  `detail` varchar(128) CHARACTER SET utf8 DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`course_register_status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- customer: table
CREATE TABLE `customer` (
  `customer_id` int(20) unsigned NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token_reset` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fullname` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `permission_id` int(10) unsigned DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `note` varchar(100) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- exam: table
CREATE TABLE `exam` (
  `exam_id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_group` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `exam_group_id` int(11) NOT NULL,
  `title` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`exam_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=latin1;

-- exam_detail: table
CREATE TABLE `exam_detail` (
  `exam_detail_id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_id` int(11) NOT NULL,
  `group_file` varchar(50) DEFAULT NULL,
  `filesave` varchar(100) DEFAULT NULL,
  `title` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `content` varchar(1024) CHARACTER SET utf8 DEFAULT NULL,
  `content_img` varchar(1024) CHARACTER SET utf8 DEFAULT NULL,
  `is_main_pages_id` int(11) NOT NULL,
  `reply` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `set_to_fist` bigint(20) NOT NULL,
  `mark` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`exam_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;

-- exam_group: table
CREATE TABLE `exam_group` (
  `exam_group_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `exam_group` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `title` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`exam_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- exam_reply: table
CREATE TABLE `exam_reply` (
  `reply_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `exam_detail_id` int(11) NOT NULL,
  `reply` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `mark` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`reply_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- extended_data: table
CREATE TABLE `extended_data` (
  `NodeId` bigint(11) NOT NULL,
  `Time` int(11) NOT NULL,
  `CO` int(11) NOT NULL,
  `CO2` int(11) NOT NULL,
  `SO2` int(11) NOT NULL,
  `NO2` int(11) NOT NULL,
  `O3` int(11) NOT NULL,
  PRIMARY KEY (`Time`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- history_delivery_warehouse_return: table
CREATE TABLE `history_delivery_warehouse_return` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idreturn` int(11) NOT NULL,
  `id_user_send` int(11) NOT NULL,
  `id_adress` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- location: table
CREATE TABLE `location` (
  `Id` int(3) NOT NULL AUTO_INCREMENT,
  `Latitude` decimal(10,4) DEFAULT NULL,
  `Longtitude` decimal(10,4) DEFAULT NULL,
  `Altitude` int(11) DEFAULT NULL,
  `Type` int(3) DEFAULT NULL,
  `PictureLinks` varchar(20) DEFAULT NULL,
  `StartTime` int(5) DEFAULT NULL,
  `StopTime` int(5) DEFAULT NULL,
  `Description` varchar(20) DEFAULT NULL,
  `ReverseGeocode` varchar(200) DEFAULT NULL,
  `NodeId` bigint(20) NOT NULL,
  `Name` varchar(3) NOT NULL,
  `DateCreated` int(11) DEFAULT NULL,
  `Status` varchar(13) DEFAULT NULL,
  `Note` varchar(50) DEFAULT NULL,
  `Contact` varchar(50) DEFAULT NULL,
  `NoteStatus` varchar(11) DEFAULT NULL,
  `Implement_TestingDate` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;

-- manifest_authen: table
CREATE TABLE `manifest_authen` (
  `manifestid` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(20) NOT NULL,
  `content` varchar(100) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`manifestid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- oauthen2: table
CREATE TABLE `oauthen2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `manifestid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `tocken` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_updated` int(11) NOT NULL,
  `id_created` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) DEFAULT NULL,
  `time_relase` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

-- oauthen2customer: table
CREATE TABLE `oauthen2customer` (
  `id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `tocken` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `value_manifest` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `time_relase` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oldid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- oauthen2design: table
CREATE TABLE `oauthen2design` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deviceid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `link` varchar(200) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `tocken` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `time_release` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- oauthen2design_data: table
CREATE TABLE `oauthen2design_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `link` varchar(200) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `tocken` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `linkfile` varchar(200) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- orders_sale: table
CREATE TABLE `orders_sale` (
  `orderid` int(11) NOT NULL AUTO_INCREMENT,
  `saleid` int(11) NOT NULL,
  `user_aproved_id` int(11) NOT NULL,
  `shipperid` int(11) NOT NULL,
  `content` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `weight` float NOT NULL,
  `width` float NOT NULL,
  `height` float NOT NULL,
  `length` float NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`orderid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- orders_sale_historyshiper: table
CREATE TABLE `orders_sale_historyshiper` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderid` int(11) NOT NULL,
  `user_save_id` int(11) NOT NULL,
  `user_aproved_id` int(11) NOT NULL,
  `shipperid` int(11) NOT NULL,
  `location` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `adressid` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- setup_device: table
CREATE TABLE `setup_device` (
  `setupid` int(11) NOT NULL AUTO_INCREMENT,
  `user_setup_id` int(11) NOT NULL,
  `customerid` int(11) NOT NULL,
  `note` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`setupid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- setup_device_bill: table
CREATE TABLE `setup_device_bill` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deviceid` int(11) NOT NULL,
  `setupid` int(11) NOT NULL,
  `km` float NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- sparc_access_location_sensor: table
CREATE TABLE `sparc_access_location_sensor` (
  `id_access` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `id_group` int(11) NOT NULL,
  `station_id` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `manifestid` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`id_access`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- sparc_aqi: table
CREATE TABLE `sparc_aqi` (
  `time` int(11) NOT NULL,
  `station_id` bigint(18) NOT NULL,
  `aqi` int(4) DEFAULT NULL,
  `SO2_aqi` float DEFAULT NULL,
  `PM25_aqi` float DEFAULT NULL,
  `PM10_aqi` float DEFAULT NULL,
  `NO2_aqi` float DEFAULT NULL,
  `PM1_aqi` float DEFAULT NULL,
  `CO_aqi` float DEFAULT NULL,
  `O3_aqi` float DEFAULT NULL,
  `CO2_aqi` float DEFAULT NULL,
  PRIMARY KEY (`station_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- sparc_group_location_sensor: table
CREATE TABLE `sparc_group_location_sensor` (
  `id_group` int(11) NOT NULL AUTO_INCREMENT,
  `name_group` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_updated` datetime NOT NULL,
  `id_created` datetime NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`id_group`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- sparc_location_sensor: table
CREATE TABLE `sparc_location_sensor` (
  `id` int(11) NOT NULL,
  `mac` varchar(30) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `station_id` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `location_lat` float NOT NULL,
  `location_long` float NOT NULL,
  `adress` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `content` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  `id_group` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- sparc_posts: table
CREATE TABLE `sparc_posts` (
  `ID` int(3) NOT NULL,
  `post_author` int(3) NOT NULL,
  `post_date` datetime DEFAULT NULL,
  `post_date_gmt` datetime DEFAULT NULL,
  `post_content` varchar(8000) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `post_title` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `post_excerpt` varchar(40) DEFAULT NULL,
  `post_status` varchar(40) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `comment_status` varchar(20) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `ping_status` varchar(40) DEFAULT NULL,
  `post_password` varchar(40) DEFAULT NULL,
  `post_name` varchar(40) DEFAULT NULL,
  `to_ping` varchar(40) DEFAULT NULL,
  `pinged` varchar(40) DEFAULT NULL,
  `post_modified` datetime DEFAULT NULL,
  `post_modified_gmt` datetime DEFAULT NULL,
  `post_content_filtered` varchar(40) DEFAULT NULL,
  `post_parent` int(3) DEFAULT NULL,
  `guid` varchar(100) DEFAULT NULL,
  `menu_order` int(3) DEFAULT NULL,
  `post_type` varchar(11) DEFAULT NULL,
  `post_mime_type` varchar(20) DEFAULT NULL,
  `comment_count` int(11) DEFAULT NULL,
  `image_intro` varchar(100) DEFAULT NULL,
  `content_intro` varchar(256) DEFAULT NULL,
  `deleteflag` int(11) DEFAULT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- sparc_sensor_data: table
CREATE TABLE `sparc_sensor_data` (
  `station_id` bigint(18) NOT NULL,
  `Time` int(11) NOT NULL,
  `PM2p5` float NOT NULL,
  `PM10` float NOT NULL,
  `PM1` float NOT NULL,
  `Temperature` float NOT NULL,
  `Humidity` float NOT NULL,
  `Pressure` float DEFAULT NULL,
  `SO2` float DEFAULT NULL,
  `NO2` float DEFAULT NULL,
  `CO2` float DEFAULT NULL,
  `CO` float DEFAULT NULL,
  `O3` float DEFAULT NULL,
  `NO2A` float DEFAULT NULL,
  `NO2W` float DEFAULT NULL,
  `O3W` float DEFAULT NULL,
  `O3A` float DEFAULT NULL,
  `COW` float DEFAULT NULL,
  `COA` float DEFAULT NULL,
  `SO2W` float DEFAULT NULL,
  `SO2A` float DEFAULT NULL,
  PRIMARY KEY (`Time`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- sparc_sensor_max_min: table
CREATE TABLE `sparc_sensor_max_min` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `station_id` varchar(40) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `pm25_max` float NOT NULL,
  `pm25_min` float NOT NULL,
  `pm25_max_enanble` tinyint(1) NOT NULL,
  `pm25_min_enanble` tinyint(1) NOT NULL,
  `pm10_max` float NOT NULL,
  `pm10_min` float NOT NULL,
  `pm10_max_enanble` tinyint(1) NOT NULL,
  `pm10_min_enanble` tinyint(1) NOT NULL,
  `pm1_max` float NOT NULL,
  `pm1_min` float NOT NULL,
  `pm1_max_enanble` tinyint(1) NOT NULL,
  `pm1_min_enanble` tinyint(1) NOT NULL,
  `temp_max` float NOT NULL,
  `temp_min` float NOT NULL,
  `temp_max_enanble` tinyint(1) NOT NULL,
  `temp_min_enanble` tinyint(1) NOT NULL,
  `humid_max` float NOT NULL,
  `humid_min` float NOT NULL,
  `humid_max_enanble` tinyint(1) NOT NULL,
  `humid_min_enanble` tinyint(1) NOT NULL,
  `special` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- sparc_sensor_warning: table
CREATE TABLE `sparc_sensor_warning` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `station_id` int(11) NOT NULL,
  `content` varchar(1024) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- status_history_device: table
CREATE TABLE `status_history_device` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deviceid` int(11) NOT NULL,
  `content` varchar(2000) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `note` varchar(100) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- user_manifest: table
CREATE TABLE `user_ref_manifest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `type_manifest` int(11) NOT NULL,
  `username` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `password` varchar(50) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- warehouse_product: table
CREATE TABLE `warehouse_product` (
  `warehouseid` int(11) NOT NULL AUTO_INCREMENT,
  `productid` int(11) NOT NULL,
  `cost_in` float NOT NULL,
  `content` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `id_user_send` int(11) NOT NULL,
  `id_adress` int(11) NOT NULL,
  `deviceid` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`warehouseid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- wp_comments: table
CREATE TABLE `wp_comments` (
  `comment_ID` int(3) NOT NULL AUTO_INCREMENT,
  `comment_post_ID` int(11) NOT NULL,
  `comment_author` varchar(40) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `comment_author_email` varchar(40) NOT NULL,
  `comment_author_url` varchar(40) NOT NULL,
  `comment_author_IP` varchar(20) NOT NULL,
  `comment_date` datetime NOT NULL,
  `comment_date_gmt` datetime NOT NULL,
  `comment_content` varchar(1000) NOT NULL,
  `comment_karma` int(3) NOT NULL,
  `comment_approved` varchar(10) NOT NULL,
  `comment_agent` varchar(100) NOT NULL,
  `comment_type` varchar(10) NOT NULL,
  `comment_parent` int(3) NOT NULL,
  `user_ID` int(11) NOT NULL,
  PRIMARY KEY (`comment_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- wp_ninja_table_items: table
CREATE TABLE `wp_ninja_table_items` (
  `id` int(3) NOT NULL,
  `position` varchar(40) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `table_id` int(3) NOT NULL,
  `owner_id` int(3) NOT NULL,
  `attribute` varchar(20) NOT NULL,
  `settings` varchar(20) DEFAULT NULL,
  `value` varchar(40) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- wp_options: table
CREATE TABLE `wp_options` (
  `option_id` int(3) NOT NULL,
  `option_name` varchar(40) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `option_value` varchar(40) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `autoload` varchar(5) NOT NULL,
  PRIMARY KEY (`option_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- wp_postmeta: table
CREATE TABLE `wp_postmeta` (
  `meta_id` int(3) NOT NULL,
  `post_id` int(3) NOT NULL,
  `meta_key` varchar(40) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `meta_value` varchar(100) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  PRIMARY KEY (`meta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- wp_term_relationships: table
CREATE TABLE `wp_term_relationships` (
  `object_id` int(3) NOT NULL,
  `term_taxonomy_id` int(3) NOT NULL,
  `term_order` int(3) NOT NULL,
  PRIMARY KEY (`object_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- wp_term_taxonomy: table
CREATE TABLE `wp_term_taxonomy` (
  `term_taxonomy_id` int(3) NOT NULL,
  `term_id` int(3) NOT NULL,
  `taxonomy` varchar(20) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `description` varchar(40) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `parent` int(3) NOT NULL,
  `count` int(3) NOT NULL,
  PRIMARY KEY (`term_taxonomy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- wp_terms: table
CREATE TABLE `wp_terms` (
  `term_id` int(3) NOT NULL,
  `name` varchar(40) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `slug` varchar(40) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `term_group` int(3) NOT NULL,
  PRIMARY KEY (`term_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- wp_usermeta: table
CREATE TABLE `wp_usermeta` (
  `umeta_id` int(3) NOT NULL,
  `user_id` int(3) NOT NULL,
  `meta_key` varchar(40) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `meta_value` varchar(100) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  PRIMARY KEY (`umeta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- wp_users: table
CREATE TABLE `wp_users` (
  `ID` int(3) NOT NULL,
  `user_login` varchar(20) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `user_pass` varchar(40) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `user_nicename` varchar(15) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `user_email` varchar(20) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `user_url` varchar(30) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `user_registered` varchar(20) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `user_activation_key` datetime NOT NULL,
  `user_status` int(3) NOT NULL,
  `display_name` varchar(20) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

