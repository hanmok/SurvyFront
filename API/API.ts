let localRestServer = "http://localhost:3000";

let restServer = "https://dearsurvy.herokuapp.com";

let graphServer = "https://dearsurvy.herokuapp.com/graphql";

// export const API_BASE_URL = localRestServer;
export const API_BASE_URL = restServer;
export const GQL_URL = graphServer;

// 'answer', 'CREATE TABLE `answer` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `question_id` int(11) DEFAULT NULL,\n  `selectable_option_id` int(11) DEFAULT NULL,\n  `user_id` int(11) DEFAULT NULL,\n  `survey_id` int(11) DEFAULT NULL,\n  `answer_text` text,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `answer_unique` (`selectable_option_id`,`user_id`),\n  KEY `question_id` (`question_id`),\n  KEY `user_id` (`user_id`),\n  KEY `survey_id` (`survey_id`),\n  CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`),\n  CONSTRAINT `answer_ibfk_2` FOREIGN KEY (`selectable_option_id`) REFERENCES `selectable_option` (`id`),\n  CONSTRAINT `answer_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),\n  CONSTRAINT `answer_ibfk_4` FOREIGN KEY (`survey_id`) REFERENCES `survey` (`id`)\n) ENGINE=InnoDB AUTO_INCREMENT=2034 DEFAULT CHARSET=utf8'
