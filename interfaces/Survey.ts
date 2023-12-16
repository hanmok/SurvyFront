import { Genre } from "./Genre";
import { Question } from "./Question";
import { Section } from "./Section";

export interface Survey {
    id: number | undefined;
    userId: number | undefined;
    title: string;
    participationGoal: number;
    currentParticipation: number | undefined;
    initialSectionId: number | undefined;
    // geoCode: number;
    targetMinAge: number;
    targetMaxAge: number;
    genreIds: number[];
    geoIds: number[];
    isTargetMale: number | null;
    reward: number;
    cost: number;
    numOfSections: number;
    sections: Section[];
    genres: Genre[];
    createdAt: string;
}

export class SurveyBuilder {
    private survey: Survey;

    constructor(
        public userId: number,
        public title: string,
        public participationGoal: number,
        public targetMinAge: number,
        public targetMaxAge: number,
        public genreIds: number[],
        public geoIds: number[],
        public isTargetMale: number | undefined,
        public reward: number,
        public cost: number,
        public numOfSections: number
    ) {
        this.survey = {
            userId,
            title,
            participationGoal,
            targetMinAge,
            targetMaxAge,
            genreIds,
            geoIds,
            isTargetMale,
            reward,
            cost,
            initialSectionId: undefined,
            currentParticipation: 0,
            createdAt: "",
            id: undefined,
            numOfSections,
            sections: [],
            genres: [],
        };
    }

    build(): Survey {
        return this.survey;
    }
}

export interface SurveyProps {
    surveyTitle: string;
    sections: Section[];
    questions: Question[];
}

// 'survey', 'CREATE TABLE `survey` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `title` text,\n  `current_participation` int(11) DEFAULT \'0\',\n  `participation_goal` int(11) NOT NULL DEFAULT \'10\',\n  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,\n  `ended_at` datetime DEFAULT NULL,\n  `reward` int(11) DEFAULT \'0\',\n  `code` varchar(8) NOT NULL,\n  `is_public` tinyint(4) DEFAULT \'1\',\n  `is_completed` tinyint(4) DEFAULT \'0\',\n  `num_of_sections` int(11) DEFAULT \'1\',\n  `target_min_age` int(11) DEFAULT \'16\',\n  `target_max_age` int(11) DEFAULT \'100\',\n  `expected_time_in_sec` int(11) DEFAULT NULL,\n  `cost` int(11) NOT NULL,\n  `is_target_male` tinyint(4) DEFAULT NULL,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB AUTO_INCREMENT=1064 DEFAULT CHARSET=utf8'
