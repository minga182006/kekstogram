const API_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const HASHTAG_MAX_LENGTH = 20;
const HASHTAG_MAX_COUNT = 5;
const COMMENT_MAX_LENGTH = 140;

const COMMENTS_PORTION = 5;
const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const EFFECTS = {
  none: {
    filter: '',
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  },
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  phobos: {
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
  },
};

const FilterType = {
  DEFAULT: 'default',
  RANDOM: 'random',
  DISCUSSED: 'discussed',
};

export {
  API_URL,
  SCALE_STEP,
  SCALE_MIN,
  SCALE_MAX,
  SCALE_DEFAULT,
  HASHTAG_MAX_LENGTH,
  HASHTAG_MAX_COUNT,
  COMMENT_MAX_LENGTH,
  COMMENTS_PORTION,
  RANDOM_PHOTOS_COUNT,
  DEBOUNCE_DELAY,
  EFFECTS,
  FilterType,
};
