
export interface WordForm {
  verb?: string | string[];
  noun_thing?: string | string[];
  noun_person?: string | string[];
  adjective?: string | string[];
  adverb?: string | string[];
}

export type WordFormType = keyof WordForm;

export interface Question {
  baseWord: string;
  baseForm: WordFormType;
  targetForm: WordFormType;
  answer: string | string[];
}
