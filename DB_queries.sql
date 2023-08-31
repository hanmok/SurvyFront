SHOW DATABASES;
USE heroku_3df4ab91447196b;
SHOW TABLES;

ALTER TABLE posting
ADD CONSTRAINT unique_key UNIQUE (user_id, survey_id);
ALTER TABLE participating

DROP participating_ibfk_1;

SELECT CONSTRAINT_NAME
FROM participating.TABLE_CONSTRAINTS WHERE TABLE_NAME=participating;



-- INSERT 
INSERT INTO posting(survey_id, user_id) VALUES(244, 4);




SET FOREIGN_KEY_CHECKS = 0; -- 비활성화
ALTER TABLE question
MODIFY survey_id INT NOT NULL;
SET FOREIGN_KEY_CHECKS = 1; -- 재활성화

-- Nullable Foreign Key 추가
ALTER TABLE survey ADD initial_section_id INT NULL;

ALTER TABLE survey ADD CONSTRAINT FK_section
FOREIGN KEY (initial_section_id) REFERENCES section(id);

ALTER TABLE response RENAME TO answer;

-- UPDATE
UPDATE section SET survey_id=244 WHERE id=284;

-- DROP FOREIGN KEY
ALTER TABLE question
DROP FOREIGN KEY FK_Section_Question;

ALTER TABLE question
DROP FOREIGN KEY question_ibfk_1;
ALTER TABLE posting DROP PRIMARY KEY;


-- FOREIGN KEY CONSTRAINT 비활성화
SET FOREIGN_KEY_CHECKS = 0;
SET FOREIGN_KEY_CHECKS = 1;


-- MODIFY COLUMN
ALTER TABLE question
MODIFY COLUMN question_type ENUM ('SINGLE_SELECTION', 
'MULTIPLE_SELECTION', 'SHORT_TEXT', 'LONG_TEXT') NOT NULL;

ALTER TABLE question
MODIFY COLUMN required TINYINT NOT NULL DEFAULT 1;

ALTER TABLE user
MODIFY COLUMN registered_at DATETIME DEFAULT CURRENT_TIMESTAMP;


-- ALTER TABLE ADD COLUMN
ALTER TABLE participating
ADD COLUMN create_at TIMESTAMP DEFAULT NOW();

ALTER TABLE question
ADD COLUMN question_type ENUM ('SINGLE_SELECTION', 'MULTIPLE_SELECTION', 'SHORT_TEXT', 'LONG_TEXT'); 


-- CHANGE COLUMN
ALTER TABLE participating
CHANGE COLUMN create_at created_at TIMESTAMP;

ALTER TABLE survey
CHANGE COLUMN participationGoal participation_goal INT DEFAULT 10 NOT NULL;

-- ADD FOREIGN KEY

ALTER TABLE question
ADD FOREIGN KEY FK_Section (section_id) REFERENCES section (id);

ALTER TABLE section
DROP COLUMN sequence;

SHOW CREATE TABLE posting;

DELETE FROM question WHERE survey_id is null;



DESC user;

DROP TABLE user;

CREATE TABLE participating_sections(
participating_id INT,
section_id INT,
CONSTRAINT FOREIGN KEY (participating_id) REFERENCES participating(id),
CONSTRAINT FOREIGN KEY (section_id) REFERENCES section(id),
PRIMARY KEY (participating_id, section_id)
);
CREATE TABLE Participating(
user_id INT,
survey_id INT,
section_id INT,
CONSTRAINT FOREIGN KEY (user_id) REFERENCES user(id),
CONSTRAINT FOREIGN KEY (survey_id) REFERENCES survey(id),
CONSTRAINT FOREIGN KEY (section_id) REFERENCES section(id),
UNIQUE (user_id, survey_id, section_id)
);
CREATE TABLE Section(
id INT PRIMARY KEY AUTO_INCREMENT,
survey_id INT, 
CONSTRAINT FOREIGN KEY (survey_id) REFERENCES Survey(id),
title VARCHAR(255) NOT NULL,
expectedTimeInSec INT,
reward INT NOT NULL DEFAULT 0
);
CREATE TABLE Question(
 id INT PRIMARY KEY,
 questionType_id INT,
 section_id INT,
 position INT NOT NULL,
 text TEXT NOT NULL,
 expectedTimeInSec INT DEFAULT 5,
 CONSTRAINT FK_QuestionType_Question FOREIGN KEY (questionType_id) REFERENCES QuestionType(id),
 CONSTRAINT FK_Section_Question FOREIGN KEY (section_id) REFERENCES Section(id)
 );
 CREATE TABLE SelectableOption(
 id INT PRIMARY KEY AUTO_INCREMENT,
 question_id INT,
 position INT NOT NULL,
 value TEXT,
 placeholder TEXT,
 CONSTRAINT FK_Question_SelectableOption FOREIGN KEY (question_id) REFERENCES Question(id)
 );
 CREATE TABLE Response(
 question_id INT,
 selectableOption_id INT,
 user_id INT,
 answerText TEXT,
 timeTookInSec INT,
 CONSTRAINT FOREIGN KEY (question_id) REFERENCES Question(id),
 CONSTRAINT FOREIGN KEY (selectableOption_id) REFERENCES SelectableOption(id),
 CONSTRAINT FOREIGN KEY (user_id) REFERENCES User(id),
 PRIMARY KEY (question_id, selectableOption_id, user_id)
 );
 CREATE TABLE SectionBridge(
 current_id INT,
 next_id INT,
 question_id INT,
 selectableOption_id INT,
 CONSTRAINT FOREIGN KEY (current_id) REFERENCES Section(id),
 CONSTRAINT FOREIGN KEY (next_id) REFERENCES Section(id),
 CONSTRAINT FOREIGN KEY (question_id) REFERENCES Question(id),
 CONSTRAINT FOREIGN KEY (selectableOption_id) REFERENCES SelectableOption(id),
 PRIMARY KEY (current_id, next_id, question_id, selectableOption_id)
 );
CREATE TABLE User(
id INT PRIMARY KEY AUTO_INCREMENT,
username VARCHAR(30) UNIQUE,
password VARCHAR(20) NOT NULL,
collectedReward INT NOT NULL DEFAULT 0,
fatigue INT NOT NULL DEFAULT 0,
birthDate DATETIME,
nickname VARCHAR(100) UNIQUE,
isMale TINYINT,
registeredAt DATETIME DEFAULT NOW(),
deviceToken TEXT
);
CREATE TABLE QuestionType(
id INT PRIMARY KEY AUTO_INCREMENT,
description VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE Survey(
id INT PRIMARY KEY AUTO_INCREMENT,
title TEXT,
numOfParticipation INT NOT NULL DEFAULT 0,
participationGoal INT NOT NULL,
created_at DATETIME DEFAULT NOW(),
ended_at DATETIME,
reward_range VARCHAR(100) 
);
CREATE TABLE Participate(
user_id INT,
survey_id INT,
CONSTRAINT FOREIGN KEY (user_id) REFERENCES User(id),
CONSTRAINT FOREIGN KEY (survey_id) REFERENCES Survey(id),
PRIMARY KEY(user_id, survey_id)
);
CREATE TABLE Survey_tag(
tag_id INT,
survey_id INT,
CONSTRAINT FOREIGN KEY (tag_id) REFERENCES Tag(id),
CONSTRAINT FOREIGN KEY (survey_id) REFERENCES Survey(id),
PRIMARY KEY (tag_id, survey_id)
);
CREATE TABLE User_tag(
user_id INT,
tag_id INT,
CONSTRAINT FOREIGN KEY (user_id) REFERENCES User(id),
CONSTRAINT FOREIGN KEY (tag_id) REFERENCES Tag(id),
PRIMARY KEY(user_id, tag_id)
);
CREATE TABLE Posting(
 survey_id INT,
 user_id INT,
 CONSTRAINT FOREIGN KEY (survey_id) REFERENCES Survey(id),
 CONSTRAINT FOREIGN KEY (user_id) REFERENCES User(id),
 PRIMARY KEY(survey_id, user_id)
);