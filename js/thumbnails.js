const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture');

const createThumbnail = (photo) => {
  const thumbnail = pictureTemplate.content.querySelector('.picture').cloneNode(true);
  const img = thumbnail.querySelector('.picture__img');
  const commentsElement = thumbnail.querySelector('.picture__comments');
  const likesElement = thumbnail.querySelector('.picture__likes');

  img.src = photo.url;
  img.alt = photo.description;
  commentsElement.textContent = photo.comments.length;
  likesElement.textContent = photo.likes;
  thumbnail.dataset.photoId = String(photo.id);

  return thumbnail;
};

const clearThumbnails = () => {
  picturesContainer.querySelectorAll('.picture').forEach((element) => {
    element.remove();
  });
};

const renderThumbnails = (photos) => {
  clearThumbnails();

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    fragment.appendChild(createThumbnail(photo));
  });

  picturesContainer.append(fragment);
};

export { renderThumbnails };
