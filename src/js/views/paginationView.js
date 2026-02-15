import icons from 'url:../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _generateMarkupNext(curPage) {
    // console.log(curPage + 1);
    return `
        <button data-goto = ${
          curPage + 1
        } class="btn--inline pagination__btn--next">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
            <span>Page ${curPage + 1}</span>
        </button>
        `;
  }

  _generateMarkupPrev(curPage) {
    return `
            <button data-goto = ${
              curPage - 1
            } class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
            `;
  }

  _generateMarkup() {
    const curPage = this._data.page;
    // console.log(curPage);
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    if (curPage == 1 && numPages > 1) {
      // console.log(1);
      return this._generateMarkupNext(curPage);
    } else if (curPage == numPages && numPages > 1) {
      return this._generateMarkupPrev(curPage);
    } else if (curPage < numPages) {
      return (
        this._generateMarkupNext(curPage) + this._generateMarkupPrev(curPage)
      );
    }
    return '';
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      // console.log(btn);
      const gotoPage = +btn.dataset.goto;
      // console.log(gotoPage);
      handler(gotoPage);
    });
  }
}

export default new PaginationView();
