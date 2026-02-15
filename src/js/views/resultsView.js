import icons from 'url:../../img/icons.svg';
import View from './view.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'There are no recipes for your query. Please try again:)';
  _message = '';

  _generateMarkup() {
    // console.log(this._data);
    return this._data.map(ans => this._generateMarkupPreview(ans));
  }
  _generateMarkupPreview(res) {
    const id = window.location.hash.slice(1);
    return `
        <li class="preview">
            <a class="preview__link ${
              res.id === id ? 'preview__link--active' : ''
            }" href="#${res.id}">
              <figure class="preview__fig">
                <img src="${res.image}" alt="${res.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${res.title}</h4>
                <p class="preview__publisher">${res.publisher}</p>
                <div class="preview__user-generated ${res.key ? '' : 'hidden'}">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
        </li>
    `;
  }
}

export default new ResultsView();
