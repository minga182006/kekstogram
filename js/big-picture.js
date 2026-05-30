import { COMMENTS_PORTION } from './constants.js';
import { isEscapeKey } from './util.js';

const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const socialPicture = bigPicture.querySelector('.social__header .social__picture');
const socialCaption = bigPicture.querySelector('.social__caption');
const likesCount = bigPicture.querySelector('.likes-count');
const socialCommentCount = bigPicture.querySelector('.social__comment-count');
const commentsList = bigPicture.querySelector('.social__comments');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const cancelButton = bigPicture.querySelector('.big-picture__cancel');
const picturesContainer = document.querySelector('.pictures');

let galleryPhotos = [];
let currentPhoto = null;
let shownCommentsCount = 0;

const getAvatarPath = (id) => `img/avatar-${(id % 6) + 1}.svg`;

const createCommentElement = (comment) => {
  const commentItem = document.createElement('li');
  commentItem.classList.add('social__comment');

  const avatar = document.createElement('img');
  avatar.classList.add('social__picture');
  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  avatar.width = 35;
  avatar.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  commentItem.append(avatar, text);

  return commentItem;
};

const updateCommentsCounter = () => {
  socialCommentCount.innerHTML = `${shownCommentsCount} из <span class="comments-count">${currentPhoto.comments.length}</span> комментариев`;
};

const renderCommentsPortion = (count) => {
  const fragment = document.createDocumentFragment();
  const portion = currentPhoto.comments.slice(shownCommentsCount, shownCommentsCount + count);

  portion.forEach((comment) => {
    fragment.appendChild(createCommentElement(comment));
  });

  commentsList.append(fragment);
  shownCommentsCount += portion.length;
  updateCommentsCounter();

  if (shownCommentsCount >= currentPhoto.comments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const openBigPicture = (photo) => {
  currentPhoto = photo;
  shownCommentsCount = 0;
  commentsList.innerHTML = '';

  bigPictureImg.src = photo.url;
  bigPictureImg.alt = photo.description;
  socialPicture.src = getAvatarPath(photo.id);
  socialPicture.alt = 'Аватар автора фотографии';
  socialCaption.textContent = photo.description;
  likesCount.textContent = photo.likes;

  renderCommentsPortion(COMMENTS_PORTION);

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  currentPhoto = null;
};

const initBigPicture = (photos) => {
  galleryPhotos = photos;

  picturesContainer.addEventListener('click', (evt) => {
    const thumbnail = evt.target.closest('.picture');

    if (!thumbnail) {
      return;
    }

    evt.preventDefault();

    const photoId = Number(thumbnail.dataset.photoId);
    const photo = galleryPhotos.find((item) => item.id === photoId);

    if (photo) {
      openBigPicture(photo);
    }
  });

  commentsLoader.addEventListener('click', () => {
    renderCommentsPortion(COMMENTS_PORTION);
  });

  cancelButton.addEventListener('click', closeBigPicture);

  document.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt) && !bigPicture.classList.contains('hidden')) {
      closeBigPicture();
    }
  });
};

export { initBigPicture };
