import { getData } from './api.js';
import { initFilters } from './filters.js';
import { initBigPicture } from './big-picture.js';
import { initForm } from './form.js';

const showLoadError = () => {
  const errorElement = document.createElement('div');
  errorElement.className = 'img-data-error';
  errorElement.textContent = 'Не удалось загрузить фотографии. Попробуйте обновить страницу.';

  document.querySelector('.pictures').prepend(errorElement);
};

const bootstrap = () => {
  initForm();

  getData(
    (photos) => {
      initFilters(photos);
      initBigPicture(photos);
    },
    showLoadError,
  );
};

bootstrap();
