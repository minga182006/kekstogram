import {
  FilterType,
  RANDOM_PHOTOS_COUNT,
  DEBOUNCE_DELAY,
} from './constants.js';
import { debounce, shuffleArray } from './util.js';
import { renderThumbnails } from './thumbnails.js';

const filtersContainer = document.querySelector('.img-filters');
const filterButtons = filtersContainer.querySelectorAll('.img-filters__button');

let photos = [];

const getFilterType = (buttonId) => {
  if (buttonId === 'filter-random') {
    return FilterType.RANDOM;
  }

  if (buttonId === 'filter-discussed') {
    return FilterType.DISCUSSED;
  }

  return FilterType.DEFAULT;
};

const getFilteredPhotos = (filterType) => {
  switch (filterType) {
    case FilterType.RANDOM:
      return shuffleArray(photos).slice(0, RANDOM_PHOTOS_COUNT);
    case FilterType.DISCUSSED:
      return [...photos].sort((first, second) => second.comments.length - first.comments.length);
    default:
      return photos;
  }
};

const setActiveFilter = (activeButton) => {
  filterButtons.forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });
  activeButton.classList.add('img-filters__button--active');
};

const initFilters = (loadedPhotos) => {
  photos = loadedPhotos;
  filtersContainer.classList.remove('img-filters--inactive');

  const renderFiltered = debounce((filterType) => {
    renderThumbnails(getFilteredPhotos(filterType));
  }, DEBOUNCE_DELAY);

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setActiveFilter(button);
      renderFiltered(getFilterType(button.id));
    });
  });

  renderThumbnails(photos);
};

export { initFilters };
