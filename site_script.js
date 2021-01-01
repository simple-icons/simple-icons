(function(document) {
  var $body                = document.body,
      $grid                = document.querySelector('.grid'),
      $icons               = $grid.querySelectorAll('.grid-item:not(.grid-item--ad)'),
      $search              = document.querySelector('.search'),
      $searchClose         = $search.querySelector('.search__close'),
      $searchInput         = $search.querySelector('input'),
      $orderByColor        = document.getElementById('sort-color'),
      $orderAlphabetically = document.getElementById('sort-alphabetically'),
      $orderByRelevance    = document.getElementById('sort-relevance');

  var queryParameter = 'q',
      orderingPreferenceIdentifier = 'ordering-preference',
      previousQuery  = '',
      previousOrdering  = $orderByColor;

  // Remove the "disabled" attribute from the search input
  $searchInput.setAttribute('title', 'Search Simple Icons');
  $searchInput.removeAttribute('disabled');
  $searchInput.focus();

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

  // Get a parameter from the URL's search section (location.search). Based on:
  //   - https://davidwalsh.name/query-string-javascript
  //   - https://github.com/WebReflection/url-search-params
  //   - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
  function getUrlParameter(parameter) {
    var name = parameter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  function normalizeSearchTerm(value) {
    return value.toLowerCase()
      .replace(/à|á|â|ã|ä/g, "a")
      .replace(/ç|č|ć/g, "c")
      .replace(/è|é|ê|ë/g, "e")
      .replace(/ì|í|î|ï/g, "i")
      .replace(/ñ|ň|ń/g, "n")
      .replace(/ò|ó|ô|õ|ö/g, "o")
      .replace(/š|ś/g, "s")
      .replace(/ù|ú|û|ü/g, "u")
      .replace(/ý|ÿ/g, "y")
      .replace(/ž|ź/g, "z");
  }

  function search(value) {
    var query = normalizeSearchTerm(value)
        queryLetters = query.split('');

    var matchedIcons = icons.filter(function(iconName, iconIndex) {
      var element = $icons[iconIndex];
      var score = iconName.length - query.length;
      var index = 0;

      for (var i = 0; i < queryLetters.length; i++) {
        var letter = queryLetters[i];
        index = iconName.indexOf(letter, index);

        if (index === -1) {
          element.classList.add('hidden');
          return false;
        }

        score += index;
        index++;
      }

      element.style.setProperty("--order-relevance", score);
      element.classList.remove('hidden');
      return true;
    });

    $grid.classList.toggle('search__empty', matchedIcons.length == 0);
    $body.classList.toggle('search__active', matchedIcons.length < icons.length);

    if (query === '') {
      if ($body.classList.contains('order-by-relevance')) {
        selectOrdering(previousOrdering);
      }
    } else {
      if (previousQuery === '') {
        selectOrdering($orderByRelevance);
      }
    }

    previousQuery = query;
  }
  function selectOrdering(selected) {
    // Set the ordering type as a class on body
    $body.classList.remove('order-alphabetically', 'order-by-color', 'order-by-relevance');
    if (selected === $orderByColor) {
      $body.classList.add('order-by-color');
    } else if (selected === $orderAlphabetically) {
      $body.classList.add('order-alphabetically');
    } else if (selected === $orderByRelevance) {
      $body.classList.add('order-by-relevance');
    }

    // Store ordering preference
    var preferenceOptions = [$orderByColor, $orderAlphabetically];
    if (localStorage && preferenceOptions.includes(selected)) {
      localStorage.setItem(orderingPreferenceIdentifier, selected.id);
    }
    if (selected !== $orderByRelevance) {
      previousOrdering = selected;
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
