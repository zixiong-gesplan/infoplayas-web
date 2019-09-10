jQuery(window).on("load", function () {
    "use strict";

    setTimeout(function () {
        $(window).scrollTop(0);
    }, 200);

    /*  ===================================
     Loading Timeout
     ====================================== */
    $("#loader-fade").fadeOut(800);
});

jQuery(function ($) {
    "use strict";

    var $window = $(window);
    var windowsize = $(window).width();
    var $root = $("html, body");
    var $this = $(this);


    //Contact Us
    $("#submit_btn").on("click", function() {

        var user_name = $('input[name=first_name]').val() + ' ' + $('input[name=last_name]').val();
        var user_email = $('input[name=email]').val();
        var user_phone = $('input[name=phone]').val();
        var user_message = $('textarea[name=message]').val();

        //simple validation at client's end
        var post_data, output;
        var proceed = true;
        if (user_name == "") {
            proceed = false;
        }
        if (user_email == "") {
            proceed = false;
        }
        // if (user_phone == "") {
        //proceed = false;
        // }

        if (user_message == "") {
            proceed = false;
        }
        //everything looks good! proceed...
        if (proceed) {

            //data to be sent to server
            post_data = { 'userName': user_name, 'userEmail': user_email, 'userPhone': user_phone, 'userMessage': user_message };

            //Ajax post data to server
            $.post('contact.php', post_data, function(response) {

                //load json data from server and output message
                if (response.type == 'error') {
                    output = '<div class="alert-danger" style="padding:10px; margin-bottom:25px;">' + response.text + '</div>';
                } else {
                    output = '<div class="alert-success" style="padding:10px; margin-bottom:25px;">' + response.text + '</div>';

                    //reset values in all input fields
                    $('.contact-form-outer input').val('');
                    $('.contact-form-outer textarea').val('');
                }

                $("#result").hide().html(output).slideDown();
            }, 'json');

        }
        else {
            output = '<div class="alert-danger">Please provide the <strong> missing </strong> fields.</div>';
            $("#result").hide().html(output).slideDown();
        }

    });

    /* ===================================
    Nav Scroll
    ====================================== */

        $(".scroll").on("click", function(event){
            event.preventDefault();
            $('html,body').animate({scrollTop: $(this.hash).offset().top}, 700);
        });

    /* =====================================
            Wow
       ======================================== */

    if ($(window).width() > 767) {
        var wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: false,
            live: true
        });
        new WOW().init();
    }

    /* ===================================
       SideBar Menu On click
       ====================================== */
    var $menu_left = $(".side-nav-left");
    var $menu_right = $(".side-nav-right");
    var $menu_full = $(".full-nav");
    var $toggler = $("#menu_bars");
    var $toggler2 = $("#menu_bars2");
    if ($("#menu_bars").length) {
        $("#side-nav").addClass("side-nav-push");

        if($toggler.hasClass("left")){
            $toggler.on("click", function (e) {
                $(this).toggleClass("active");

                $menu_left.toggleClass("side-nav-open");
                e.stopPropagation();
            });
        }
        else if ($toggler.hasClass("right")) {
            $toggler.on("click", function (e) {
                $(this).toggleClass("active");
                $menu_right.toggleClass("side-nav-open");
                e.stopPropagation();
            });
        }
        else if ($toggler.hasClass("right-bottom")) {
            $toggler.on("click", function (e) {
                $menu_right.toggleClass("side-nav-open");
                e.stopPropagation();
            });
        }
        else {
            if ($toggler.hasClass("full")) {
                $toggler.on("click", function (e) {
                    $(this).toggleClass("active");
                    $menu_full.toggleClass("side-nav-open");
                    e.stopPropagation();
                });
            }
        }

    }
    if ($("#menu_bars2").length) {

         if ($toggler2.hasClass("right")) {
            $toggler2.on("click", function (e) {
                $menu_right.removeClass("side-nav-open");
                e.stopPropagation();
            });
        }
        else {
            if ($toggler.hasClass("full")) {
                $toggler.on("click", function (e) {
                    $(this).toggleClass("active");
                    $menu_full.toggleClass("side-nav-open");
                    e.stopPropagation();
                });
            }
        }

    }


    /* ===================================
       Features Section Number Scroller
       ====================================== */

$(".stats").appear(function () {
    $('.numscroller').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 5000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
});

    /* ===================================
       Equal Heights
       ====================================== */
    checheight();
    $window.on("resize", function () {
        checheight();
    });

    function checheight() {
        var $smae_height = $(".equalheight");
        if ($smae_height.length) {
            if (windowsize > 767) {
                $smae_height.matchHeight({
                    property: "height",
                });
            }
        }
    }

    /* ===================================
       Rotating Text
       ====================================== */

    $("#js-rotating").Morphext({
        // The [in] animation type. Refer to Animate.css for a list of available animations.
        animation: "flipInX",
        // An array of phrases to rotate are created based on this separator. Change it if you wish to separate the phrases differently (e.g. So Simple | Very Doge | Much Wow | Such Cool).
        separator: ",",
        // The delay between the changing of each phrase in milliseconds.
        speed: 3000,
        complete: function () {
            // Called after the entrance animation is executed.
        }
    });

    /* ===================================
       Cube Portfolio
       ====================================== */

(function ($, window, document, undefined) {

    // // // init cubeportfolio
    // $('#js-grid-mosaic-flat').cubeportfolio({
    //     filters: '#js-filters-mosaic-flat',
    //     layoutMode: 'mosaic',
    //     defaultFilter: 'none',
    //     animationType: 'fadeOutTop',
    //     gapHorizontal: 0,
    //     gapVertical: 0,
    //     gridAdjustment: 'responsive',
    //     caption: 'zoom',
    //     displayType: 'fadeIn',
    //     displayTypeSpeed: 100,
    //     sortByDimension: true,
    //         mediaQueries: [{
    //             width: 1500,
    //             cols: 3
    //         }, {
    //             width: 1100,
    //             cols: 3
    //         }, {
    //             width: 768,
    //             cols: 2
    //         }, {
    //             width: 480,
    //             cols: 1
    //         }, {
    //             width: 320,
    //             cols: 1
    //         }],
    //
    //     // lightbox
    //     lightboxDelegate: '.cbp-lightbox',
    //     lightboxGallery: true,
    //     lightboxTitleSrc: 'data-title',
    //     lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
    //
    //     plugins: {
    //         loadMore: {
    //             element: '#js-loadMore-mosaic-flat',
    //             action: 'click',
    //             loadItems: 3
    //         }
    //     }
    // })
    //Project Filter
    $("#projects").cubeportfolio({
        layoutMode: 'grid',
        filters: '#project-filter',
        defaultFilter: '*',
        animationType: "quicksand",
        gapHorizontal: 30,
        gapVertical: 30,
        gridAdjustment: "responsive",
        mediaQueries: [{
            width: 1500,
            cols: 4
        }, {
            width: 1100,
            cols: 4
        }, {
            width: 800,
            cols: 3
        }, {
            width: 480,
            cols: 2
        }, {
            width: 320,
            cols: 1
        }],
    });

    // Shop
    $('#js-grid-blog-posts').cubeportfolio({
        filters: '#js-filters-blog-posts',
        search: '#js-search-blog-posts',
        defaultFilter: '*',
        animationType: '3dflip',
        gapHorizontal: 0,
        gapVertical: 0,
        gridAdjustment: 'responsive',
        mediaQueries: [{
            width: 1500,
            cols: 4,
        }, {
            width: 1100,
            cols: 3,
        }, {
            width: 800,
            cols: 3,
        }, {
            width: 480,
            cols: 1,
            options: {
                caption: '',
                gapHorizontal: 50,
                gapVertical: 20,
            }
        }, {
            width: 320,
            cols: 1,
            options: {
                caption: '',
                gapHorizontal: 50,
            }
        }],
        caption: 'revealBottom',
        displayType: 'fadeIn',
        displayTypeSpeed: 400,
    })

    // Shop Detail
    $('#js-grid-clients').cubeportfolio({
        layoutMode: 'slider',
        drag: true,
        auto: true,
        animationType: '3dflip',
        autoTimeout: 3000,
        autoPauseOnHover: true,
        showNavigation: true,
        showPagination: true,
        rewindNav: true,
        scrollByPage: false,
        gridAdjustment: 'responsive',
        mediaQueries: [{
            width: 1500,
            cols: 3,
        }, {
            width: 1100,
            cols: 3,
        }, {
            width: 800,
            cols: 2,
        }, {
            width: 480,
            cols: 1,
        }],
        gapHorizontal: 0,
        gapVertical: 0,

        caption: 'revealBottom',
        displayType: 'fadeIn',
        displayTypeSpeed: 400,
    })


        .on('initComplete.cbp', function () {
            // your functionality
            var $this = $(this);
            if ($(".cbp-filter-item-active").attr("data-filter") === "*") {
                $("#js-loadMore-mosaic-flat").addClass("active");
            } else {
                $("#js-loadMore-mosaic-flat").removeClass("active");
            }
            $this.find(".cbp-wrapper").find(".cbp-item:not(.cbp-item-off)").each(function (index) {
                $(this).removeClass("even");

                var val = index + 1;
                if ($(this).css('left') !== "0px") {
                    $(this).addClass("even");

                }
            });
        })
        .on('onAfterLoadMore.cbp', function () {
            // your functionality
            var $this = $(this);
            $("#js-loadMore-mosaic-flat a").addClass("d-none");
            $("#js-loadMore-mosaic-flat").addClass("active-outer");
            $this.find(".cbp-wrapper").find(".cbp-item:not(.cbp-item-off)").each(function (index) {
                $(this).removeClass("even");
                console.log()
                var val = index + 1;
                if ($(this).css('left') !== "0px") {
                    $(this).addClass("even");
                }
            });
        })
        .on('filterComplete.cbp', function () {
            // your functionality
            var $this = $(this);
            if ($(".cbp-filter-item-active").attr("data-filter") === "*") {
                $("#js-loadMore-mosaic-flat").addClass("active");
                $("#js-loadMore-mosaic-flat").removeClass("d-none");
            } else {
                $("#js-loadMore-mosaic-flat").removeClass("active");
                $("#js-loadMore-mosaic-flat").addClass("d-none");
            }
            $this.find(".cbp-wrapper").find(".cbp-item:not(.cbp-item-off)").each(function (index) {
                $(this).removeClass("even");
                var val = index + 1;
                if ($(this).css('left') !== "0px") {
                    $(this).addClass("even");
                }
            });
        });


})(jQuery, window, document);

    // Blog Listing Image Slider
    new Swiper(".blog-listing-image-slider", {
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        effect: 'fade',
        autoplay: {
            delay: 3000
        }
    });

    /* ===================================
       Owl Carousel
       ====================================== */

    $('#blog-slider').owlCarousel({
        items:1,
        autoplay: 1500,
        smartSpeed:900,
        autoplayHoverPause:true,
        loop:true,
        margin:10,
        responsiveClass:true,
        dots:false,
        nav: true
    });
    $( ".owl-prev").html('<span class="arrow left"></span>');
    $( ".owl-next").html('<span class="arrow right"></span>');

    $('.brand-carousel').owlCarousel({

            margin: 90,
            nav: false,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            dots: false,
            autoWidth: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: false,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 2
                },
                600: {
                    items: 4
                },
                1000: {
                    items: 5
                }
            }
        });




    /*=========================================================================
               Navigation Bar 2 Hamburger Menu
       =========================================================================*/

    $(".navicon-wrap").on( 'click', function() {
        $(".navicon").toggleClass("expanded");
        $('#slide-menu').toggleClass('expanded')
    });


    /*------ MENU Fixed ------*/
    if ($("nav.navbar").hasClass("static-nav")) {
        $window.scroll(function () {
            var $scroll = $window.scrollTop();
            var $navbar = $(".static-nav");
            if ($scroll >= 150) {
                $navbar.addClass("fixed-menu");
            } else {
                $navbar.removeClass("fixed-menu");
            }
        });
    }

    /*bottom menu fix*/
    if ($("nav.navbar").hasClass("fixed-bottom")) {
        var navHeight = $(".fixed-bottom").offset().top;
        $window.scroll(function () {
            if ($window.scrollTop() > navHeight) {
                $('.fixed-bottom').addClass('fixed-menu');
            } else {
                $('.fixed-bottom').removeClass('fixed-menu');
            }
        });
    }


    /* ----- Full Screen ----- */
    function resizebanner() {
        var $fullscreen = $(".full-screen");
        $fullscreen.css("height", $window.height());
        $fullscreen.css("width", $window.width());
    }
    resizebanner();
    $window.resize(function () {
        resizebanner();
    });

    /* ===================================
          Parallax
       ====================================== */
    if (windowsize > 992) {
        $(".parallaxie").parallaxie({
            speed: 0.4,
            offset: 0,
        });
    }

    /* ===================================
          Fancy Box
       ====================================== */
    $('[data-fancybox]').fancybox({
        protect: true,
        animationEffect: "fade",
        hash: null,
    });


    /* ===================================
       Revolution Slider
       ====================================== */
    /*arrows thumb Slider*/
    $("#rev_arrows").show().revolution({
        sliderType: "standard",
        jsFileLocation: "js/revolution/",
        sliderLayout: "fullscreen",
        autoHeight:'off',
        dottedOverlay: "none",
        delay: 9000,
        navigation: {
            keyboardNavigation: "off",
            keyboard_direction: "horizontal",
            mouseScrollNavigation: "off",
            mouseScrollReverse: "default",
            onHoverStop: "on",
            touch: {
                touchenabled: "on",
                swipe_threshold: 75,
                swipe_min_touches: 1,
                swipe_direction: "horizontal",
                drag_block_vertical: false
            },
            arrows: {
                style: "zeus",
                enable: true,
                hide_onmobile: true,
                hide_under: 600,
                hide_onleave: true,
                hide_delay: 200,
                hide_delay_mobile: 1200,
                tmp: '<div class="tp-title-wrap"> <div class="tp-arr-imgholder"></div> </div>',
                left: {
                    h_align: "left",
                    v_align: "center",
                    h_offset: 30,
                    v_offset: 0
                },
                right: {
                    h_align: "right",
                    v_align: "center",
                    h_offset: 30,
                    v_offset: 0
                }
            }
        },
        viewPort: {
            enable: true,
            outof: "pause",
            visible_area: "80%",
            presize: false
        },
        responsiveLevels: [1240, 1024, 778, 480],
        visibilityLevels: [1240, 1024, 778, 480],
        gridwidth: [1140, 1024, 768, 480],
        gridheight: [668, 650, 600, 490],
        lazyType: "none",
        parallax: {
            type: "mouse",
            origo: "slidercenter",
            speed: 2000,
            speedbg: 0,
            speedls: 0,
            levels: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 20, 25, 55],
            disable_onmobile: "on"
        },
        shadow: 0,
        spinner: "off",
        stopLoop: "off",
        stopAfterLoops: -1,
        stopAtSlide: -1,
        shuffle: "off",

        hideThumbsOnMobile: "off",
        hideSliderAtLimit: 0,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        debugMode: false,
        fallbacks: {
            simplifyAll: "off",
            nextSlideOnWindowFocus: "off",
            disableFocusListener: false,
        }
    });
        /*Main Slider*/
    $("#banner-main").show().revolution({
    sliderType: "standard",
    sliderLayout: "fullscreen",
    scrollbarDrag: "true",
    dottedOverlay: "none",
    navigation: {
        keyboardNavigation: "off",
        keyboard_direction: "horizontal",
        mouseScrollNavigation: "off",
        bullets: {
            style: "",
            enable: true,
            rtl: false,
            hide_onmobile: false,
            hide_onleave: false,
            hide_under: 767,
            hide_over: 9999,
            tmp: '',
            direction: "vertical",
            space: 10,
            h_align: "right",
            v_align: "center",
            h_offset: 40,
            v_offset: 0
        },
        arrows: {
            enable: false,
            hide_onmobile: true,
            hide_onleave: false,
            hide_under: 767,
            left: {
                h_align: "left",
                v_align: "center",
                h_offset: 20,
                v_offset: 30
            },
            right: {
                h_align: "right",
                v_align: "center",
                h_offset: 20,
                v_offset: 30
            }
        },
        touch: {
            touchenabled: "on",
            swipe_threshold: 75,
            swipe_min_touches: 1,
            swipe_direction: "horizontal",
            drag_block_vertical: false
        }
    },
    viewPort: {
        enable: true,
        outof: "pause",
        visible_area: "90%"
    },
    responsiveLevels: [4096, 1024, 778, 480],
    gridwidth: [1140, 1024, 750, 480],
    gridheight: [600, 500, 500, 350],
    lazyType: "none",
    parallax: {
        type: "mouse",
        origo: "slidercenter",
        speed: 9000,
        levels: [2, 3, 4, 5, 6, 7, 12, 16, 10, 50]
    },
    shadow: 0,
    spinner: "off",
    stopLoop: "off",
    stopAfterLoops: -1,
    stopAtSlide: -1,
    shuffle: "off",
    autoHeight: "off",
    hideThumbsOnMobile: "off",
    hideSliderAtLimit: 0,
    hideCaptionAtLimit: 0,
    hideAllCaptionAtLilmit: 0,
    debugMode: false,
    fallbacks: {
        simplifyAll: "off",
        nextSlideOnWindowFocus: "off",
        disableFocusListener: false
    }
});
    /*Video Background*/
    $("#video-bg").show().revolution({
        sliderType: "standard",
        sliderLayout: "fullscreen",
        scrollbarDrag: "true",
        dottedOverlay: "none",
        navigation: {
            keyboardNavigation: "off",
            keyboard_direction: "horizontal",
            mouseScrollNavigation: "off",
            bullets: {
                enable: false
            },
            touch: {
                touchenabled: "on",
                swipe_threshold: 75,
                swipe_min_touches: 1,
                swipe_direction: "horizontal",
                drag_block_vertical: false
            }
        },
        viewPort: {
            enable: true,
            outof: "pause",
            visible_area: "90%"
        },
        responsiveLevels: [4096, 1024, 778, 480],
        gridwidth: [1140, 1024, 750, 480],
        gridheight: [600, 500, 500, 350],
        lazyType: "none",
        parallax: {
            type: "mouse",
            origo: "slidercenter",
            speed: 9000,
            levels: [2, 3, 4, 5, 6, 7, 12, 16, 10, 50]
        },
        shadow: 0,
        spinner: "off",
        stopLoop: "off",
        stopAfterLoops: -1,
        stopAtSlide: -1,
        shuffle: "off",
        autoHeight: "off",
        hideThumbsOnMobile: "off",
        hideSliderAtLimit: 0,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        debugMode: false,
        fallbacks: {
            simplifyAll: "off",
            nextSlideOnWindowFocus: "off",
            disableFocusListener: false
        }
    });
    /* Index5 */
    $("#rev_slider_5_1").show().revolution({
        sliderType: "standard",
        jsFileLocation:"//localhost:82/revslider/revslider/public/assets/js/",
        sliderLayout: "fullscreen",
        dottedOverlay: "none",
        delay: 9000,
        navigation: {},
        responsiveLevels: [1240, 1024, 778, 480],
        visibilityLevels: [1240, 1024, 778, 480],
        gridwidth: [1240, 1024, 778, 480],
        gridheight: [868, 768, 960, 720],
        lazyType: "none",
        parallax: {
            type: "mouse",
            origo: "slidercenter",
            speed: 2000,
            speedbg: 0,
            speedls: 0,
            levels: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 55],
            disable_onmobile: "on"
        },
        shadow: 0,
        spinner: "off",
        autoHeight: "off",
        fullScreenAutoWidth: "off",
        fullScreenAlignForce: "off",
        fullScreenOffsetContainer: "",
        fullScreenOffset: "",
        disableProgressBar: "on",
        hideThumbsOnMobile: "off",
        hideSliderAtLimit: 0,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        debugMode: false,
        fallbacks: {
            simplifyAll: "off",
            disableFocusListener: false
        }
    });
    /* Shop */
    $("#rev_slider_349_1").show().revolution({
        sliderType:"standard",
        jsFileLocation:"//localhost:82/revslider/revslider/public/assets/js/",
        sliderLayout:"fullscreen",
        dottedOverlay:"none",
        delay:9000,
        navigation: {
            keyboardNavigation:"off",
            keyboard_direction: "horizontal",
            mouseScrollNavigation:"off",
            mouseScrollReverse:"default",
            onHoverStop:"on",
            arrows: {
                style:"hesperiden",
                enable:true,
                hide_onmobile:true,
                hide_under:778,
                hide_onleave:false,
                left: {
                    h_align:"left",
                    v_align:"center",
                    h_offset:30,
                    v_offset:0
                },
                right: {
                    h_align:"right",
                    v_align:"center",
                    h_offset:30,
                    v_offset:0
                }
            }
        },
        responsiveLevels:[1240,1024,778,480],
        visibilityLevels:[1240,1024,778,480],
        gridwidth:[1240,1024,778,480],
        gridheight:[900,768,960,720],
        lazyType:"none",
        parallax: {
            type:"scroll",
            origo:"slidercenter",
            speed:1000,
            speedbg:0,
            speedls:1000,
            levels:[5,10,15,20,25,30,35,40,45,46,47,48,49,50,51,30],
        },
        shadow:0,
        spinner:"off",
        stopLoop:"off",
        stopAfterLoops:-1,
        stopAtSlide:-1,
        shuffle:"off",
        autoHeight:"off",
        fullScreenAutoWidth:"off",
        fullScreenAlignForce:"off",
        fullScreenOffsetContainer: "",
        fullScreenOffset: "",
        hideThumbsOnMobile:"off",
        hideSliderAtLimit:0,
        hideCaptionAtLimit:0,
        hideAllCaptionAtLilmit:0,
        debugMode:false,
        fallbacks: {
            simplifyAll:"off",
            nextSlideOnWindowFocus:"off",
            disableFocusListener:false,
        }
    });
    /* Multi Page Slider 2*/
    $("#rev_slider_1078_1").show().revolution({
        sliderType: "standard",
        jsFileLocation: "revolution/js/",
        sliderLayout: "fullscreen",
        dottedOverlay: "none",
        delay: 9000,
        navigation: {
            keyboardNavigation: "on",
            keyboard_direction: "horizontal",
            mouseScrollNavigation: "off",
            mouseScrollReverse: "default",
            onHoverStop: "off",
            touch: {
                touchenabled: "on",
                swipe_threshold: 75,
                swipe_min_touches: 1,
                swipe_direction: "horizontal",
                drag_block_vertical: false
            },
            arrows: {
                style: "zeus",
                enable: false,
                hide_onmobile: true,
                hide_under: 600,
                hide_onleave: true,
                hide_delay: 200,
                hide_delay_mobile: 1200,
                tmp: '<div class="tp-title-wrap">  	<div class="tp-arr-imgholder"></div> </div>',
                left: {
                    h_align: "left",
                    v_align: "center",
                    h_offset: 30,
                    v_offset: 0
                },
                right: {
                    h_align: "right",
                    v_align: "center",
                    h_offset: 30,
                    v_offset: 0
                }
            },
            bullets: {
                enable: true,
                hide_onmobile: false,
                hide_under: 300,
                style: "hermes",
                hide_onleave: false,
                hide_delay: 200,
                hide_delay_mobile: 1200,
                direction: "horizontal",
                h_align: "center",
                v_align: "bottom",
                h_offset: 0,
                v_offset: 30,
                space: 8,
                tmp: '<span class="tp-bullet-img-wrap">  <span class="tp-bullet-image"></span></span><span class="tp-bullet-title">{{title}}</span>'
            }
        },
        viewPort: {
            enable: true,
            outof: "pause",
            visible_area: "80%",
            presize: false
        },
        responsiveLevels: [1240, 1024, 778, 480],
        visibilityLevels: [1240, 1024, 778, 480],
        gridwidth: [1240, 1024, 778, 480],
        gridheight: [600, 600, 500, 400],
        lazyType: "none",
        parallax: {
            type: "mouse",
            origo: "slidercenter",
            speed: 2000,
            levels: [2, 3, 4, 5, 6, 7, 12, 16, 10, 50, 46, 47, 48, 49, 50, 55]
        },
        shadow: 0,
        spinner: "off",
        stopLoop: "off",
        stopAfterLoops: -1,
        stopAtSlide: -1,
        shuffle: "off",
        autoHeight: "off",
        hideThumbsOnMobile: "off",
        hideSliderAtLimit: 0,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        debugMode: false,
        fallbacks: {
            simplifyAll: "off",
            nextSlideOnWindowFocus: "off",
            disableFocusListener: false
        }
    });

    /* Creative 2 */
    $("#rev_slider_347_1").show().revolution({
                sliderType: "hero",
                jsFileLocation:"//localhost:82/revslider/revslider/public/assets/js/",
                sliderLayout: "fullscreen",
                dottedOverlay: "none",
                delay: 9000,
                responsiveLevels: [1240, 1240, 778, 480],
                visibilityLevels: [1240, 1240, 778, 480],
                gridwidth: [1240, 1240, 778, 480],
                gridheight: [868, 868, 960, 720],
                lazyType: "none",
                parallax: {
                    type: "scroll",
                    origo: "slidercenter",
                    speed: 1000,
                    speedbg: 0,
                    speedls: 2000,
                    levels: [8, 16, 24, 32, -8, -16, -24, -32, 36, 2, 4, 6, 50, -30, -20, 55],
                },
               shadow: 0,
               spinner: "off",
                autoHeight: "off",
                fullScreenAutoWidth: "off",
            fullScreenAlignForce: "off",
        fullScreenOffsetContainer: "",
        fullScreenOffset: "",
        disableProgressBar: "on",
        hideThumbsOnMobile: "off",
        hideSliderAtLimit: 0,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        debugMode: false,
        fallbacks: {
            simplifyAll: "off",
            disableFocusListener: false
        }
            });

    /* Construction */
    $("#rev_slider_1078_2").show().revolution({
        sliderType: "standard",
        jsFileLocation: "revolution/js/",
        sliderLayout: "fullscreen",
        dottedOverlay: "none",
        delay: 6000,
        navigation: {
            keyboardNavigation: "on",
            keyboard_direction: "horizontal",
            mouseScrollNavigation: "off",
            mouseScrollReverse: "default",
            onHoverStop: "off",
            touch: {
                touchenabled: "on",
                swipe_threshold: 75,
                swipe_min_touches: 1,
                swipe_direction: "horizontal",
                drag_block_vertical: false
            },
            arrows: {
                style: "zeus",
                enable: true,
                hide_onmobile: true,
                hide_under: 600,
                hide_onleave: true,
                hide_delay: 200,
                hide_delay_mobile: 1200,
                tmp: '<div class="tp-title-wrap">  	<div class="tp-arr-imgholder"></div> </div>',
                left: {
                    h_align: "left",
                    v_align: "center",
                    h_offset: 30,
                    v_offset: 0
                },
                right: {
                    h_align: "right",
                    v_align: "center",
                    h_offset: 30,
                    v_offset: 0
                }
            },
            bullets: {
                enable: false,
                hide_onmobile: false,
                hide_under: 300,
                style: "hermes",
                hide_onleave: false,
                hide_delay: 200,
                hide_delay_mobile: 1200,
                direction: "horizontal",
                h_align: "center",
                v_align: "bottom",
                h_offset: 0,
                v_offset: 30,
                space: 8,
                tmp: '<span class="tp-bullet-img-wrap">  <span class="tp-bullet-image"></span></span><span class="tp-bullet-title">{{title}}</span>'
            }
        },
        viewPort: {
            enable: true,
            outof: "pause",
            visible_area: "80%",
            presize: false
        },
        responsiveLevels: [1240, 1024, 778, 480],
        visibilityLevels: [1240, 1024, 778, 480],
        gridwidth: [1240, 1024, 778, 480],
        gridheight: [600, 600, 500, 400],
        lazyType: "none",
        parallax: {
            type: "mouse",
            origo: "slidercenter",
            speed: 2000,
            levels: [2, 3, 4, 5, 6, 7, 12, 16, 10, 50, 46, 47, 48, 49, 50, 55]
        },
        shadow: 0,
        spinner: "off",
        stopLoop: "off",
        stopAfterLoops: -1,
        stopAtSlide: -1,
        shuffle: "off",
        autoHeight: "off",
        hideThumbsOnMobile: "off",
        hideSliderAtLimit: 0,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        debugMode: false,
        fallbacks: {
            simplifyAll: "off",
            nextSlideOnWindowFocus: "off",
            disableFocusListener: false
        }
    });


});
