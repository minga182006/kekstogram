import {
  SCALE_STEP,
  SCALE_MIN,
  SCALE_MAX,
  SCALE_DEFAULT,
  EFFECTS,
  HASHTAG_MAX_LENGTH,
  HASHTAG_MAX_COUNT,
  COMMENT_MAX_LENGTH,
} from './constants.js';
import { isEscapeKey } from './util.js';
import { sendData } from './api.js';

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const previewImg = document.querySelector('.img-upload__preview img');
const effectPreviews = document.querySelectorAll('.effects__preview');
const scaleValue = document.querySelector('.scale__control--value');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const effectRadios = document.querySelectorAll('.effects__radio');
const effectLevel = document.querySelector('.img-upload__effect-level');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const hashtagsField = document.querySelector('.text__hashtags');
const descriptionField = document.querySelector('.text__description');
const submitButton = document.querySelector('.img-upload__submit');
const errorTemplate = document.querySelector('#error');
const successTemplate = document.querySelector('#success');

const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

let pristine;
let effectSlider = null;
let currentEffect = 'none';
let imageUrl = null;

const getScaleValue = () => parseInt(scaleValue.value, 10);

const updateScale = () => {
  previewImg.style.transform = `scale(${getScaleValue() / 100})`;
};

const setScaleValue = (value) => {
  scaleValue.value = `${value}%`;
  updateScale();
};

const getFilterStyle = (effectName, value) => {
  const effect = EFFECTS[effectName];

  if (effectName === 'none') {
    return '';
  }

  return `${effect.filter}(${value}${effect.unit})`;
};

const applyFilter = (value) => {
  previewImg.style.filter = getFilterStyle(currentEffect, value);
};

const hideSlider = () => {
  effectLevel.classList.add('hidden');
};

const showSlider = () => {
  effectLevel.classList.remove('hidden');
};

const destroySlider = () => {
  if (effectSlider) {
    effectSlider.destroy();
    effectSlider = null;
  }
};

const createSlider = (effectName) => {
  const effect = EFFECTS[effectName];

  destroySlider();
  currentEffect = effectName;

  if (effectName === 'none') {
    hideSlider();
    previewImg.style.filter = '';
    effectLevelValue.value = '';
    return;
  }

  showSlider();

  effectSlider = noUiSlider.create(effectLevelSlider, {
    range: {
      min: effect.min,
      max: effect.max,
    },
    start: effect.max,
    step: effect.step,
    connect: 'lower',
  });

  effectSlider.on('update', () => {
    const value = effectSlider.get();
    effectLevelValue.value = value;
    applyFilter(value);
  });

  effectLevelValue.value = effect.max;
  applyFilter(effect.max);
};

const setPreviewImage = (file) => {
  if (imageUrl) {
    URL.revokeObjectURL(imageUrl);
  }

  imageUrl = URL.createObjectURL(file);
  previewImg.src = imageUrl;

  effectPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url('${imageUrl}')`;
  });
};

const resetPreviewImage = () => {
  if (imageUrl) {
    URL.revokeObjectURL(imageUrl);
    imageUrl = null;
  }

  previewImg.src = 'img/upload-default-image.jpg';
  previewImg.style.transform = '';
  previewImg.style.filter = '';

  effectPreviews.forEach((preview) => {
    preview.style.backgroundImage = '';
  });
};

const resetFormState = () => {
  form.reset();
  setScaleValue(SCALE_DEFAULT);
  document.querySelector('#effect-none').checked = true;
  createSlider('none');
  resetPreviewImage();
  pristine.reset();
};

const openForm = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  setScaleValue(SCALE_DEFAULT);
  createSlider('none');
};

const closeForm = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetFormState();
};

const validateHashtag = (value) => {
  if (!value.trim()) {
    return true;
  }

  return value.trim().split(/\s+/).every((hashtag) => (
    hashtag.length <= HASHTAG_MAX_LENGTH && HASHTAG_REGEX.test(hashtag)
  ));
};

const validateHashtagCount = (value) => {
  if (!value.trim()) {
    return true;
  }

  return value.trim().split(/\s+/).length <= HASHTAG_MAX_COUNT;
};

const validateHashtagDuplicate = (value) => {
  if (!value.trim()) {
    return true;
  }

  const hashtags = value.trim().split(/\s+/).map((hashtag) => hashtag.toLowerCase());

  return new Set(hashtags).size === hashtags.length;
};

const validateComment = (value) => value.length <= COMMENT_MAX_LENGTH;

const initValidation = () => {
  pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__field-wrapper--invalid',
  });

  pristine.addValidator(
    hashtagsField,
    validateHashtag,
    'Неверный формат хэш-тега',
  );
  pristine.addValidator(
    hashtagsField,
    validateHashtagCount,
    'Превышено количество хэш-тегов',
  );
  pristine.addValidator(
    hashtagsField,
    validateHashtagDuplicate,
    'Хэш-теги повторяются',
  );
  pristine.addValidator(
    descriptionField,
    validateComment,
    `Длина комментария не должна превышать ${COMMENT_MAX_LENGTH} символов`,
  );
};

const showMessage = (template, className) => {
  const message = template.content.cloneNode(true).querySelector(`.${className}`);
  document.body.append(message);

  const button = message.querySelector(`.${className}__button`);

  function closeMessage() {
    message.remove();
    document.removeEventListener('keydown', onMessageKeydown);
  }

  function onMessageKeydown(evt) {
    if (isEscapeKey(evt)) {
      closeMessage();
    }
  }

  const onMessageClick = (evt) => {
    if (evt.target === message) {
      closeMessage();
    }
  };

  button.addEventListener('click', closeMessage);
  message.addEventListener('click', onMessageClick);
  document.addEventListener('keydown', onMessageKeydown);
};

const showSuccessMessage = () => {
  showMessage(successTemplate, 'success');
};

const showErrorMessage = () => {
  showMessage(errorTemplate, 'error');
};

const blockSubmitButton = () => {
  submitButton.disabled = true;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  blockSubmitButton();

  sendData(
    new FormData(evt.target),
    () => {
      unblockSubmitButton();
      closeForm();
      showSuccessMessage();
    },
    () => {
      unblockSubmitButton();
      showErrorMessage();
    },
  );
};

const onFileChange = () => {
  const file = fileInput.files[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    fileInput.value = '';
    showErrorMessage();
    return;
  }

  setPreviewImage(file);
  openForm();
};

const onScaleSmallerClick = () => {
  const value = getScaleValue();

  if (value > SCALE_MIN) {
    setScaleValue(value - SCALE_STEP);
  }
};

const onScaleBiggerClick = () => {
  const value = getScaleValue();

  if (value < SCALE_MAX) {
    setScaleValue(value + SCALE_STEP);
  }
};

const onEffectChange = (evt) => {
  createSlider(evt.target.value);
};

const onDocumentEscapeKeydown = (evt) => {
  if (!isEscapeKey(evt)) {
    return;
  }

  if (document.activeElement === hashtagsField || document.activeElement === descriptionField) {
    return;
  }

  if (!overlay.classList.contains('hidden')) {
    closeForm();
  }
};

const initForm = () => {
  initValidation();
  hideSlider();

  fileInput.addEventListener('change', onFileChange);
  cancelButton.addEventListener('click', closeForm);
  scaleSmaller.addEventListener('click', onScaleSmallerClick);
  scaleBigger.addEventListener('click', onScaleBiggerClick);
  effectRadios.forEach((radio) => {
    radio.addEventListener('change', onEffectChange);
  });
  form.addEventListener('submit', onFormSubmit);
  document.addEventListener('keydown', onDocumentEscapeKeydown);
};

export { initForm };
