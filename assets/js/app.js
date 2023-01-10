$(document).ready(function() {

  'use strict';

  // =====================
  // Koenig Gallery
  // =====================
  var gallery_images = document.querySelectorAll('.kg-gallery-image img');

  gallery_images.forEach(function (image) {
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = ratio + ' 1 0%';
  });

  // =====================
  // Decode HTML entities returned by Ghost translations
  // Input: Plus d&#x27;articles
  // Output: Plus d'articles
  // =====================

  function decoding_translation_chars(string) {
    return $('<textarea/>').html(string).text();
  }

  // =====================
  // Headroom
  // =====================

  $('.js-header').headroom({
    tolerance: {
      down : 10,
      up : 20
    },
    classes: {
      initial:  'js-header--headroom',
      top:      'js-header--top',
      notTop:   'js-header--not-top',
      pinned:   'js-header--pinned',
      unpinned: 'js-header--unpinned'
    }
  });

  // =====================
  // Navigation
  // =====================

  $('.js-nav-toggle').click(function(e) {
    e.preventDefault();
    $('.c-nav-wrap').toggleClass('is-active');
    $(this).toggleClass('c-nav-toggle--close');
  });

  // =====================
  // Responsive videos
  // =====================

  $('.c-content').fitVids({
    'customSelector': [ 'iframe[src*="ted.com"]'          ,
                        'iframe[src*="player.twitch.tv"]' ,
                        'iframe[src*="dailymotion.com"]'  ,
                        'iframe[src*="facebook.com"]'
                      ]
  });

  // =====================
  // Images zoom
  // =====================

  $('.c-post img').attr('data-action', 'zoom');

  // If the image is inside a link, remove zoom
  $('.c-post a img').removeAttr('data-action');

  // =====================
  // Clipboard URL Copy
  // =====================

  var clipboard = new ClipboardJS('.js-share__link--clipboard');

  clipboard.on('success', function(e) {
    var element = $(e.trigger);

    element.addClass('tooltipped tooltipped-s');
    element.attr('aria-label', clipboard_copied_text);

    element.mouseleave(function() {
      $(this).removeAttr('aria-label');
      $(this).removeClass('tooltipped tooltipped-s');
    });
  });

  // =====================
  // Search
  // =====================

  var search_field = $('.js-search-input'),
      search_results = $('.js-search-results'),
      toggle_search = $('.js-search-toggle'),
      search_result_template = "\
      <a href={{link}} class='c-search-result'>\
        <div class='c-search-result__content'>\
          <h3 class='c-search-result__title'>{{title}}</h3>\
          <time class='c-search-result__date'>{{pubDate}}</time>\
        </div>\
        <div class='c-search-result__media'>\
          <div class='c-search-result__image is-inview' style='background-image: url({{featureImage}})'></div>\
        </div>\
      </a>";

  toggle_search.click(function(e) {
    e.preventDefault();
    $('.js-search').addClass('is-active');

    // If off-canvas is active, just disable it
    $('.js-off-canvas-container').removeClass('is-active');

    setTimeout(function() {
      search_field.focus();
    }, 500);
  });

  $('.c-search, .js-search-close, .js-search-close .icon').on('click keyup', function(event) {
    if (event.target == this || event.target.className == 'js-search-close' || event.target.className == 'icon' || event.keyCode == 27) {
      $('.c-search').removeClass('is-active');
    }
  });

  search_field.ghostHunter({
    results: search_results,
    onKeyUp         : true,
    result_template : search_result_template,
    zeroResultsInfo : false,
    displaySearchInfo: false,
    before: function() {
      search_results.fadeIn();
    }
  });

  // =====================
  // Ajax Load More
  // =====================

  var pagination_next_url = $('link[rel=next]').attr('href'),
    $load_posts_button = $('.js-load-posts');

  $load_posts_button.click(function(e) {
    e.preventDefault();

    var request_next_link =
      pagination_next_url.split(/page/)[0] +
      'page/' +
      pagination_next_page_number +
      '/';

    $.ajax({
      url: request_next_link,
      beforeSend: function() {
        $load_posts_button.text(decoding_translation_chars(pagination_loading_text));
        $load_posts_button.addClass('c-btn--loading');
      }
    }).done(function(data) {
      var posts = $('.js-post-card-wrap', data);

      $('.js-grid').append(posts);

      $load_posts_button.text(decoding_translation_chars(pagination_more_posts_text));
      $load_posts_button.removeClass('c-btn--loading');

      pagination_next_page_number++;

      // If you are on the last pagination page, hide the load more button
      if (pagination_next_page_number > pagination_available_pages_number) {
        $load_posts_button.addClass('c-btn--disabled').attr('disabled', true);
      }
    });
  });
});

const shopSwiper = new Swiper('.c-shop-carousel__swiper', {
  // If we need pagination
  pagination: {
    el: '.c-shop-carousel .swiper-pagination',
    enabled: true
  },

  // Navigation arrows
  navigation: {
    nextEl: '.c-shop-carousel .swiper-button-next',
    prevEl: '.c-shop-carousel .swiper-button-prev',
    enabled: false
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.c-shop-carousel .swiper-scrollbar',
  },

  slidesPerView: 2,
  spaceBetween: 20,
  grid: {
    rows: 2
  },

  // Responsive breakpoints
  breakpoints: {
    // when window width is >= 320px
    480: {
      slidesPerView: 2,
      spaceBetween: 20,
      grid: {
        rows: 2
      },
      navigation: {
        enabled: false
      },
      pagination: {
        enabled: true
      }
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 40,
      grid: {
        rows: 2
      },
      navigation: {
        enabled: false
      },
      pagination: {
        enabled: true
      }
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 26,
      grid: {
        rows: 1
      },
      navigation: {
        enabled: false
      },
      pagination: {
        enabled: false
      }
    },
    1240: {
      slidesPerView: 4,
      spaceBetween: 26,
      grid: {
        rows: 1
      },
      navigation: {
        enabled: true
      },
      pagination: {
        enabled: false
      }
    }
  }
});

const shop_hero = new Swiper('.c-shop-featured__carousel--swiper', {
  // Navigation arrows
  navigation: {
    nextEl: '.c-shop-featured__carousel .swiper-button-next',
    prevEl: '.c-shop-featured__carousel .swiper-button-prev',
  },

  slidesPerView: 1,
  spaceBetween: 40,
});

history.scrollRestoration = "manual"