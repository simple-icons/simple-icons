(function(document) {
  var queryParameter = 'q',
      $grid          = document.querySelector('.grid'),
      $icons         = $grid.querySelectorAll('.grid-item:not(.grid-item--ad)'),
      $search        = document.querySelector('.search'),
      $searchClose   = $search.querySelector('.search__close'),
      $searchInput   = $search.querySelector('input'),
      $sortColor     = document.getElementById('sort-color'),
      $sortAlpha     = document.getElementById('sort-alphabetically');

  // Remove the "disabled" attribute from the search input
  $searchInput.setAttribute('title', 'Search Simple Icons');
  $searchInput.removeAttribute('disabled');

  // include a modified debounce underscorejs helper function.
  // see
  //   - http://underscorejs.org/docs/underscore.html#section-83
  //   - http://underscorejs.org/#debounce
  function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = +new Date - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = +new Date;
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  }

  // Get any parameter from the URL's search section (location.search).
  // see
  //   - https://davidwalsh.name/query-string-javascript
  //   - https://github.com/WebReflection/url-search-params
  function getUrlParameter(parameter) {
    name = parameter.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  function search(value) {
    var hiddenCounter = 0,
        query = normalizeSearchTerm(value);

    icons.map(function(icon, iconIndex) {
      var letters = query.split(''),
          indexes = [],
          index = 0;

      if (icon === query) {
        return {element: $icons[iconIndex], score: 1};
      }

      for (var i = 0; i < letters.length; i++) {
        var letter = letters[i];
        index = icon.indexOf(letter, index);

        if (index === -1) {
          $icons[iconIndex].classList.add('hidden');
          return null;
        }

        indexes.push(index);
        index++;
      }

      return {
        element: $icons[iconIndex],
        score: indexes.reduce(function(a, b) {
          return a + b;
        }, 2)
      };
    }).filter(function(item) {
      return item !== null;
    }).sort(function(a, b) {
      return a.score - b.score;
    }).forEach(function(item, index) {
      item.element.classList.remove('hidden');

      if (query !== '') {
        // Order according to relevance (i.e. score) if there is a query
        item.element.style.order = index;
      } else {
        // Use color-based order if there is no query
        item.element.style.removeProperty('order');
      }
    });

    $grid.classList.toggle('search__empty', hiddenCounter == icons.length);
    if (query === '') {
      $sortColor.removeAttribute('disabled');
      $sortAlpha.removeAttribute('disabled');
    } else {
      $sortColor.setAttribute('disabled', true);
      $sortAlpha.setAttribute('disabled', true);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Load search query if present
    var query = getUrlParameter(queryParameter);
    if (query) {
      $search.classList.add('search--active');
      $searchInput.value = query;
      search(query);
    }
  });
  $search.addEventListener('input', debounce(function(e) {
    e.preventDefault();

    var value = e.target.value;
    if (value) {
      $search.classList.add('search--active');
      window.history.replaceState(null, '', '?' + queryParameter + '=' + value);
    } else {
      $search.classList.remove('search--active');
      window.history.replaceState(null, '', '/');
    }
    search(value);
  }, 50), false);
  $searchClose.addEventListener('click', function(e) {
    e.stopPropagation();

    $searchInput.value = '';
    $search.classList.remove('search--active');
    window.history.replaceState(null, '', '/');
    search('');
  }, false);

  $sortColor.addEventListener('click', function() {
    $icons.forEach(icon => { icon.style.order = null; });

    $sortColor.classList.add('active');
    $sortAlpha.classList.remove('active');
  });
  $sortAlpha.addEventListener('click', function() {
    $icons.forEach(icon => { icon.style.order = icon.getAttribute('order'); });

    $sortAlpha.classList.add('active');
    $sortColor.classList.remove('active');
  });
})( document );
