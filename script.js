$(document).ready(function(){
  const $gallery = $('.gallery');

  $gallery.on('init reInit afterChange breakpoint', function(event, slick, currentSlide){
    const s = slick || $gallery.slick('getSlick');
    if (!s) return;

    const slidesToShow = s.options.slidesToShow || 1;
    const slideCount = s.slideCount;
    const totalPages = Math.ceil(slideCount / slidesToShow);
    $('#total-pages').text(totalPages);

    const cur = (typeof currentSlide === 'number') ? currentSlide : (s.currentSlide || 0);
    const currentPage = Math.floor(cur / slidesToShow) + 1;
    $('#current-page').text(Math.min(currentPage, totalPages));
  });

  $gallery.slick({
    slidesToShow: 3,
    slidesToScroll: 1,      
    infinite: false,
    prevArrow: $('.prev'),
    nextArrow: $('.next'),
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1  
        }
      }
    ]
  });
});

