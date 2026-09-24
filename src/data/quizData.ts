import { QuizQuestion } from '../types';
import { ABAP_QUESTIONS_LEVEL_1 } from './abapQuestionsLevel1';
import { ABAP_QUESTIONS_LEVEL_2 } from './abapQuestionsLevel2';
import { ABAP_QUESTIONS_LEVEL_3 } from './abapQuestionsLevel3';
import { ABAP_QUESTIONS_LEVEL_4 } from './abapQuestionsLevel4';
import { ABAP_QUESTIONS_LEVEL_5 } from './abapQuestionsLevel5';
import { ABAP_QUESTIONS_LEVEL_6 } from './abapQuestionsLevel6';
import { ABAP_QUESTIONS_LEVEL_7 } from './abapQuestionsLevel7';

// Export combined master list of questions (across all 7 levels)
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  ...ABAP_QUESTIONS_LEVEL_1,
  ...ABAP_QUESTIONS_LEVEL_2,
  ...ABAP_QUESTIONS_LEVEL_3,
  ...ABAP_QUESTIONS_LEVEL_4,
  ...ABAP_QUESTIONS_LEVEL_5,
  ...ABAP_QUESTIONS_LEVEL_6,
  ...ABAP_QUESTIONS_LEVEL_7,
];
