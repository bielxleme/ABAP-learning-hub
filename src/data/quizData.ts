import { QuizQuestion } from '../types';
import { ABAP_QUESTIONS_LEVEL_1 } from './abapQuestionsLevel1';
import { ABAP_QUESTIONS_LEVEL_2 } from './abapQuestionsLevel2';
import { ABAP_QUESTIONS_LEVEL_3 } from './abapQuestionsLevel3';
import { ABAP_QUESTIONS_LEVEL_4 } from './abapQuestionsLevel4';
import { ABAP_QUESTIONS_LEVEL_5 } from './abapQuestionsLevel5';

// Export combined master list of questions (over 250+ categorized questions across all 5 levels)
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  ...ABAP_QUESTIONS_LEVEL_1,
  ...ABAP_QUESTIONS_LEVEL_2,
  ...ABAP_QUESTIONS_LEVEL_3,
  ...ABAP_QUESTIONS_LEVEL_4,
  ...ABAP_QUESTIONS_LEVEL_5,
];

