(function(document) {
  var $grid                = document.querySelector('.grid'),
      $icons               = $grid.querySelectorAll('.grid-item:not(.grid-item--ad)'),
      $search              = document.querySelector('.search'),
      $searchClose         = $search.querySelector('.search__close'),
      $searchInput         = $search.querySelector('input'),
      $orderByColor        = document.getElementById('sort-color'),
      $orderAlphabetically = document.getElementById('sort-alphabetically'),
      $orderByRelevance    = document.getElementById('sort-relevance');

  var queryParameter = 'q',
      orderingPreferenceIdentifier = 'ordering-preference',
      previousQuery  = null,
      previousOrdering  = $orderByColor;

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
    var query = normalizeSearchTerm(value);

    var matchedIcons = icons.map(function(icon, iconIndex) {
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
    });

    matchedIcons.sort(function(a, b) {
      return a.score - b.score;
    }).forEach(function(item, index) {
      var element = item.element;
      element.setAttribute('data-relevance', index);
      element.classList.remove('hidden');
    });

    $grid.classList.toggle('search__empty', matchedIcons.length == 0);
    if (query === '') {
      if ($orderByRelevance.classList.contains('active')) {
        selectOrdering(previousOrdering);
      }

      $orderByRelevance.setAttribute('display', 'none');
      previousQuery = null;
    } else {
      if (previousQuery === null) {
        selectOrdering($orderByRelevance);
      }

      previousQuery = query;
    }
  }
  function orderIcons() {
    if ($orderByColor.classList.contains('active')) {
      $icons.forEach(icon => { icon.style.order = null; });
    } else if ($orderAlphabetically.classList.contains('active')) {
      $icons.forEach(icon => { icon.style.order = icon.getAttribute('order'); });
    } else if ($orderByRelevance.classList.contains('active')) {
      $icons.forEach(icon => { icon.style.order = icon.getAttribute('data-relevance'); });
    }
  }
  function selectOrdering(selected) {
    selected.classList.add('active');

    var options = [$orderByColor, $orderAlphabetically, $orderByRelevance];
    for (var option of options.filter(option => option !== selected)) {
      option.classList.remove('active');
    }

    if (selected !== $orderByRelevance) {
      previousOrdering = selected;
    } else {
      $orderByRelevance.removeAttribute('display');
    }

    orderIcons();

    // Store ordering preference
    var preferenceOptions = [$orderByColor, $orderAlphabetically];
    if (localStorage && preferenceOptions.includes(selected)) {
      localStorage.setItem(orderingPreferenceIdentifier, selected.id);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Restore ordering preference of the user. This should be performed before
    // applying the search query as it would overwrite "order by relevance"
    if (localStorage) {
      var storedOrderingId = localStorage.getItem(orderingPreferenceIdentifier);
      var ordering = document.getElementById(storedOrderingId);
      if (ordering) selectOrdering(ordering);
    }

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
  }, 200), false);
  $searchClose.addEventListener('click', function(e) {
    e.stopPropagation();

    $searchInput.value = '';
    $search.classList.remove('search--active');
    window.history.replaceState(null, '', '/');
    search('');
  }, false);

  $orderByColor.addEventListener('click', function() {
    selectOrdering($orderByColor);
  });
  $orderAlphabetically.addEventListener('click', function() {
    selectOrdering($orderAlphabetically);
  });
  $orderByRelevance.addEventListener('click', function() {
    selectOrdering($orderByRelevance);
  });
})( document );
