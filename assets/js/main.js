(function($) {
    "use strict";
  
    const $documentOn = $(document);
    const $windowOn = $(window);
  
    $documentOn.ready( function() {
  
 /* ================================
       Mobile Menu Js Start
    ================================ */
    
      $('#mobile-menu').meanmenu({
        meanMenuContainer: '.mobile-menu',
        meanScreenWidth: "1199",
        meanExpand: ['<i class="far fa-plus"></i>'],
    });

       $('#mobile-menus').meanmenu({
        meanMenuContainer: '.mobile-menus',
        meanScreenWidth: "19920",
        meanExpand: ['<i class="far fa-plus"></i>'],
    });

     

    /* ================================
        Sidebar Toggle & Sticky Item Logic
        ================================ */

        // Open offcanvas
        $(".sidebar__toggle").on("click", function () {
        $(".offcanvas__info").addClass("info-open");
        $(".offcanvas__overlay").addClass("overlay-open");

        // Hide sticky item
        $(".sidebar-sticky-item").fadeOut().removeClass("active");
        });

        // Close offcanvas
        $(".offcanvas__close, .offcanvas__overlay").on("click", function () {
        $(".offcanvas__info").removeClass("info-open");
        $(".offcanvas__overlay").removeClass("overlay-open");

        // Show sticky item
        $(".sidebar-sticky-item").fadeIn().addClass("active");
        });

        /* ================================
        Body Overlay Js Start
        ================================ */

        $(".body-overlay").on("click", function () {
        $(".offcanvas__area").removeClass("offcanvas-opened");
        $(".df-search-area").removeClass("opened");
        $(".body-overlay").removeClass("opened");

        // Show sticky item when overlay clicked
        $(".sidebar-sticky-item").fadeIn().addClass("active");
        });

        /* ================================
        Offcanvas Link Click (Optional)
        ================================ */

        $(".offcanvas a").on("click", function () {
        $(".sidebar-sticky-item").fadeIn().addClass("active");
    });

    
      /* ================================
       Sticky Header Js
    ================================ */
      $windowOn.on("scroll", function () {
        if ($(this).scrollTop() > 20) {
          $("#header-sticky").addClass("sticky");
        } else {
          $("#header-sticky").removeClass("sticky");
        }
      });      
      
      /* ================================
       Video & Image Popup Js Start
    ================================ */

      if ($.fn.magnificPopup) $(".img-popup").magnificPopup({
        type: "image",
        gallery: {
          enabled: true,
        },
      });

      if ($.fn.magnificPopup) $(".video-popup").magnificPopup({
        type: "iframe",
        callbacks: {},
      });
  
      /* ================================
       Counterup Js Start
    ================================ */

      if ($.fn.counterUp) $(".count").counterUp({
        delay: 15,
        time: 4000,
      });
  
      /* ================================
       Wow Animation Js Start
    ================================ */

      // Scroll reveal for .wow elements (replaces WOW.js).
      // Plays every time an element scrolls into view, in both directions:
      //   scrolling down -> element rises up into place (fadeInUp)
      //   scrolling up   -> element drops down into place (fadeInDown)
      // A per-frame check is used instead of WOW.js / IntersectionObserver because
      // GSAP ScrollSmoother clips the page inside a fixed wrapper, which made those
      // fire everything at once or loop. Positions are measured with the fade's own
      // transform subtracted, so the animation can never re-trigger itself.
      (function () {
        var els = Array.prototype.slice.call(document.querySelectorAll(".wow"));
        if (!els.length) return;

        els.forEach(function (el) { el.style.visibility = "hidden"; });

        function layoutRect(el) {
          var r = el.getBoundingClientRect();
          var ty = 0, t = getComputedStyle(el).transform;
          if (t && t !== "none") {
            var m = t.match(/matrix(3d)?\(([^)]+)\)/);
            if (m) { var v = m[2].split(","); ty = parseFloat(m[1] ? v[13] : v[5]) || 0; }
          }
          return { top: r.top - ty, bottom: r.bottom - ty };
        }

        function play(el, fromTop) {
          var delay = el.getAttribute("data-wow-delay");
          var duration = el.getAttribute("data-wow-duration");
          el.style.animationDelay = delay || "";
          if (duration) el.style.animationDuration = duration;
          el.style.animationName = (fromTop && el.classList.contains("fadeInUp")) ? "fadeInDown" : "";
          void el.offsetWidth; // restart the CSS animation
          el.style.visibility = "visible";
          el.classList.add("animated");
        }

        function reset(el) {
          el.classList.remove("animated");
          el.style.visibility = "hidden";
        }

        function check() {
          var vh = window.innerHeight;
          for (var i = 0; i < els.length; i++) {
            var el = els[i], r = layoutRect(el), on = el.classList.contains("animated");
            if (!on && r.top < vh * 0.92 && r.bottom > vh * 0.08) {
              play(el, r.top < vh / 2);
            } else if (on && (r.bottom < 0 || r.top > vh)) {
              reset(el); // fully off-screen: ready to play again
            }
          }
        }

        // Start after the preloader hides so top-of-page reveals are visible.
        window.wowController = function () {
          if (typeof gsap !== "undefined" && gsap.ticker) {
            gsap.ticker.add(check); // runs in sync with ScrollSmoother
          } else {
            (function loop() { check(); requestAnimationFrame(loop); })();
          }
        };
      })();

      /* ================================
       Nice Select Js Start
    ================================ */

    if ($.fn.niceSelect && $('.single-select').length) {
        $('.single-select').niceSelect();
    }

    /* ================================
       Progress Bar Js Start
    ================================ */

    if ($.fn.waypoint) $('.progress-bar').waypoint(function() {
        $('.progress-bar').css({
            animation: "animate-positive 2.6s",
            opacity: "1"
        });
    }, { offset: '75%' });

     /* ================================
      Custom Accordion Js Start
    ================================ */

    if ($('.accordion-box').length) {
    $(".accordion-box").on('click', '.acc-btn', function () {
        var outerBox = $(this).closest('.accordion-box');
        var target = $(this).closest('.accordion');
        var accBtn = $(this);
        var accContent = accBtn.next('.acc-content');

        if (target.hasClass('active-block')) {
            // Close this one
            accBtn.removeClass('active');
            target.removeClass('active-block');
            accContent.slideUp(300);
        } else {
            // Close all others
            outerBox.find('.accordion').removeClass('active-block');
            outerBox.find('.acc-btn').removeClass('active');
            outerBox.find('.acc-content').slideUp(300);

            // Open clicked one
            accBtn.addClass('active');
            target.addClass('active-block');
            accContent.slideDown(300);
        }
    });
    }

     /* ================================
       Banner Active Js Start
    ================================ */

       if($('.banner-active').length > 0) {
            const bannerActive = new Swiper(".banner-active", {
                speed: 1500,
                loop: true,
                slidesPerView: 1,
                effect:'fade',
                autoplay: {
                    delay: 5000,         
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,  
                },
                navigation: {
                    nextEl: ".array-prev",
                    prevEl: ".array-next",
                },
            });
        }

       /* ================================
       Brand Slider Js Start
    ================================ */
     if($('.brand-slider').length > 0) {
        const brandSlider = new Swiper(".brand-slider", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
          
            breakpoints: {
                1199: {
                    slidesPerView: 6,
                },
                991: {
                    slidesPerView: 5,
                },
                767: {
                    slidesPerView: 4,
                },
                575: {
                    slidesPerView: 3,
                },
                400: {
                    slidesPerView: 2,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
      }
    
      /* ================================
       Testimonial Slider Js Start
    ================================ */
      if($('.testimonial-slider-1').length > 0) {
        const testimonialSlider1 = new Swiper(".testimonial-slider-1", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },

            pagination: {
                el: ".dot2",
                clickable: true,
            },
          
            breakpoints: {
                1199: {
                    slidesPerView: 3,
                },
                991: {
                    slidesPerView: 2,
                },
                767: {
                    slidesPerView: 2,
                },
                575: {
                    slidesPerView: 1,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
      }

       if($('.testimonial-slider-2').length > 0) {
        const testimonialSlider2 = new Swiper(".testimonial-slider-2", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".dot2",
                clickable: true,
            },
             navigation: {
                prevEl: ".array-prev",
                nextEl: ".array-next",
            },
        });
      }

      if($('.testimonial-slider-3').length > 0) {
        const testimonialSlider3 = new Swiper(".testimonial-slider-3", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
             navigation: {
                prevEl: ".array-prev",
                nextEl: ".array-next",
            },
            pagination: {
                el: ".dot",
                clickable: true,
            },
          
            breakpoints: {
                1199: {
                    slidesPerView: 3,
                },
                991: {
                    slidesPerView: 2,
                },
                767: {
                    slidesPerView: 2,
                },
                575: {
                    slidesPerView: 1,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
      }

      if($('.testimonial-slider-5').length > 0) {
        const testimonialSlider5 = new Swiper(".testimonial-slider-5", {
            spaceBetween: 30,
            speed: 1500,
            loop: true,
            autoplay: {
                delay: 1500,
                disableOnInteraction: false,
            },
            navigation: {
                prevEl: ".array-prev",
                nextEl: ".array-next",
            },
        
        });
      }

       if($('.testimonial-slider-10').length > 0) {
        const testimonialSlider10 = new Swiper(".testimonial-slider-10", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },

           navigation: {
                prevEl: ".array-prev",
                nextEl: ".array-next",
            },
          
            breakpoints: {
                1199: {
                    slidesPerView: 2,
                },
                991: {
                    slidesPerView: 2,
                },
                767: {
                    slidesPerView: 2,
                },
                575: {
                    slidesPerView: 1,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
      }

      /* ================================
       Service Slider Js Start
    ================================ */

    if($('.service-slider-5').length > 0) {
        const serviceSlider5 = new Swiper(".service-slider-5", {
            spaceBetween: 30,
            speed: 1500,
            loop: true,
            autoplay: {
                delay: 1500,
                disableOnInteraction: false,
            },

            pagination: {
                el: ".dot2",
                clickable: true,
            },
          
            breakpoints: {
                1199: {
                    slidesPerView: 4,
                },
                991: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 1.6,
                },
                575: {
                    slidesPerView: 1.5,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
      }
    
    /* ================================
       Project Slider Js Start
    ================================ */
    if ($('.project-slider').length > 0) {

        const projectSlider = new Swiper(".project-slider", {
            slidesPerView: 4,
            spaceBetween: 0,
            speed: 1000,
            loop: false,

            breakpoints: {
                1599: {
                    slidesPerView: 4,
                },
                1399: {
                    slidesPerView: 3.5,
                },
                1199: {
                    slidesPerView: 3,
                },
                991: {
                    slidesPerView: 2,
                },
                767: {
                    slidesPerView: 2,
                },
                575: {
                    slidesPerView: 1.4,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
    }

     if($('.project-slider-5').length > 0) {
        const projectSlider5 = new Swiper(".project-slider-5", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },

            pagination: {
                el: ".dot2",
                clickable: true,
            },
          
            breakpoints: {
                1199: {
                    slidesPerView: 4,
                },
                991: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 2,
                },
                575: {
                    slidesPerView: 1.5,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
      }

      if($('.project-slider-10').length > 0) {
        const projectSlider10 = new Swiper(".project-slider-10", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },

            pagination: {
                el: ".dot2",
                clickable: true,
            },
          
            breakpoints: {
                1599: {
                    slidesPerView: 4,
                },
                1399: {
                    slidesPerView: 3.7,
                },
                1199: {
                    slidesPerView: 3.1,
                },
                991: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 2,
                },
                575: {
                    slidesPerView: 1,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
    }

    if($('.project-slider-11').length > 0) {
        const projectSlider11 = new Swiper(".project-slider-11", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },

            pagination: {
                el: ".dot2",
                clickable: true,
            },
          
            breakpoints: {
                1199: {
                    slidesPerView: 3,
                },
                991: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 2,
                },
                575: {
                    slidesPerView: 1.5,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
    }

    /* ================================
     Service Box Js Start
    ================================ */

    if (document.querySelectorAll(".service-box-4").length) {
    const serviceBox4 = document.querySelectorAll(".service-box-4");

    serviceBox4.forEach((box) => {
        const hoverImg = box.querySelector(".hover-image");
        if (!hoverImg) return;

        box.addEventListener("mousemove", (event) => {
        const rect = box.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        hoverImg.style.opacity = "1";
        hoverImg.style.visibility = "visible";
        hoverImg.style.transform = `translate(${x}px, ${y}px) rotate(10deg)`;
        });

        box.addEventListener("mouseleave", () => {
        hoverImg.style.opacity = "0";
        hoverImg.style.visibility = "hidden";
        hoverImg.style.transform = `translateY(-50%) rotate(10deg)`;
        });
    });
    }

    /* ================================
           Project Slider Hover Tab
    ================================ */

    $documentOn.on("mouseenter click", ".project-slider .swiper-slide", function () {

        var tab_id = $(this).data("tab");

        $(".project-slider .swiper-slide").removeClass("active");
        $(this).addClass("active");

        $(".project-hover-image .tab-img").removeClass("active");
        $("#" + tab_id).addClass("active");

    });

     /* ================================
           Circle Progressbar Js Start
        ================================ */

        function animateCircle(el) {

            if (!el || el.classList.contains("animated")) return;

            var percent = parseInt(el.getAttribute("data-percent"), 10);

            if (isNaN(percent) || percent < 0) percent = 0;
            if (percent > 100) percent = 100;

            var circle = el.querySelector(".progress");
            var value  = el.querySelector(".value");

            if (!circle || !value) return;

            var radius = circle.r && circle.r.baseVal
                ? circle.r.baseVal.value
                : circle.getAttribute("r");

            if (!radius) return;

            var circumference = 2 * Math.PI * radius;

            circle.style.strokeDasharray  = circumference;
            circle.style.strokeDashoffset = circumference;

            // Trigger reflow
            circle.getBoundingClientRect();

            var offset = circumference * (1 - percent / 100);

            circle.style.transition      = "stroke-dashoffset 1.2s ease";
            circle.style.strokeDashoffset = offset;

            var count     = 0;
            var duration  = 1200;
            var stepTime  = percent > 0 ? Math.floor(duration / percent) : duration;

            var counter = setInterval(function () {

                if (count >= percent) {
                    clearInterval(counter);
                    el.classList.add("animated");
                } else {
                    count++;
                    value.textContent = count + "%";
                }

            }, stepTime);
        }

        if ("IntersectionObserver" in window) {

            var observer = new IntersectionObserver(function (entries, obs) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {
                        animateCircle(entry.target);
                        obs.unobserve(entry.target);
                    }

                });

            }, {
                threshold: 0.5
            });

            $(".circle-progress").each(function () {
                observer.observe(this);
            });

        } else {

            // Fallback for older browsers
            $(".circle-progress").each(function () {
                animateCircle(this);
            });

        }

    /* ================================
        Mouse Cursor Animation Js Start
    ================================ */

    if ($(".mouseCursor").length > 0) {
        function itCursor() {
            var myCursor = jQuery(".mouseCursor");
            if (myCursor.length) {
                if ($("body")) {
                    const e = document.querySelector(".cursor-inner"),
                        t = document.querySelector(".cursor-outer");
                    let n, i = 0, o = !1;
                    window.onmousemove = function(s) {
                        if (!o) {
                            t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)";
                        }
                        e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)";
                        n = s.clientY;
                        i = s.clientX;
                    };
                    $("body").on("mouseenter", "button, a, .cursor-pointer", function() {
                        e.classList.add("cursor-hover");
                        t.classList.add("cursor-hover");
                    });
                    $("body").on("mouseleave", "button, a, .cursor-pointer", function() {
                        if (!($(this).is("a", "button") && $(this).closest(".cursor-pointer").length)) {
                            e.classList.remove("cursor-hover");
                            t.classList.remove("cursor-hover");
                        }
                    });
                    e.style.visibility = "visible";
                    t.style.visibility = "visible";
                }
            }
        }
        itCursor();
    }

    /* ================================
        Back To Top Button Js Start
    ================================ */
    $windowOn.on('scroll', function() {
        var windowScrollTop = $(this).scrollTop();
        var windowHeight = $(window).height();
        var documentHeight = $(document).height();

        if (windowScrollTop + windowHeight >= documentHeight - 10) {
            $("#back-top").addClass("show");
        } else {
            $("#back-top").removeClass("show");
        }
    });

    $documentOn.on('click', '#back-top', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

    /* ================================
       Search Popup Toggle Js Start
    ================================ */

    if ($(".search-toggler").length) {
        $(".search-toggler").on("click", function(e) {
            e.preventDefault();
            $(".search-popup").toggleClass("active");
            $("body").toggleClass("locked");
        });
    }
      

      /* ================================
       Smooth Scroller And Title Animation Js Start
    ================================ */
    if ($('#smooth-wrapper').length && $('#smooth-content').length) {
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

        gsap.config({
            nullTargetWarn: false,
        });

        let smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 2,
            effects: true,
            smoothTouch: 0.1,
            normalizeScroll: false,
            ignoreMobileResize: true,
        });
        window.smoother = smoother;

        // Helper to get clean path without leading slash or .html
        function cleanPath(p) {
            if (!p) return "";
            return p.replace(/^\//, "").replace(/\.html$/, "").replace(/\/$/, "");
        }

        // Smooth scroll to anchor on click
        $(document).on("click", 'a[href*="#"]', function (e) {
            var href = $(this).attr("href");
            if (!href || href === "#" || href.startsWith("javascript:")) return;
            if ($(this).hasClass("mean-expand")) return;

            var hashIndex = href.indexOf("#");
            if (hashIndex === -1) return;
            var path = href.substring(0, hashIndex);
            var hash = href.substring(hashIndex);

            if (hash.length <= 1) return;

            var currentPath = cleanPath(window.location.pathname);
            var targetPath = cleanPath(path);

            var isCurrentHome = (currentPath === "" || currentPath === "index");
            var isTargetHome = (targetPath === "" || targetPath === "index");

            // Same page if path empty & target exists, or paths match, or both are home
            var isSamePage = (path === "" && $(hash).length) ||
                             (targetPath === currentPath) ||
                             (isCurrentHome && isTargetHome);

            var $target = $(hash);

            if (isSamePage && $target.length) {
                e.preventDefault();

                // Close offcanvas mobile drawer if open
                $(".offcanvas__info").removeClass("info-open");
                $(".offcanvas__overlay").removeClass("overlay-open");
                $("body").removeClass("locked");

                if (window.smoother && typeof window.smoother.offset === "function") {
                    var targetOffset = window.smoother.offset($target[0]);
                    var scrollY = Math.max(0, targetOffset - 80);
                    window.smoother.scrollTo(scrollY, true);
                } else {
                    var elemTop = $target.offset().top - 80;
                    $("html, body").stop().animate({
                        scrollTop: Math.max(0, elemTop)
                    }, 800);
                }

                if (window.history && window.history.pushState) {
                    window.history.pushState(null, null, hash);
                }
            } else if (path === "" && !$target.length) {
                // If on a subpage and clicked an anchor that only exists on home, redirect to home with hash
                e.preventDefault();
                window.location.href = "/" + hash;
            }
        });

        // Close mobile drawer when clicking regular links inside mean-nav
        $(document).on("click", ".mean-nav a:not(.mean-expand)", function () {
            $(".offcanvas__info").removeClass("info-open");
            $(".offcanvas__overlay").removeClass("overlay-open");
            $("body").removeClass("locked");
        });

        // Smooth scroll to anchor on initial page load if hash exists
        function scrollToHashTarget() {
            var hash = window.location.hash;
            if (hash && hash.length > 1) {
                var $target = $(hash);
                if ($target.length) {
                    setTimeout(function () {
                        if (typeof ScrollTrigger !== "undefined") {
                            ScrollTrigger.refresh();
                        }
                        if (window.smoother && typeof window.smoother.offset === "function") {
                            var targetOffset = window.smoother.offset($target[0]);
                            var scrollY = Math.max(0, targetOffset - 80);
                            window.smoother.scrollTo(scrollY, true);
                        } else {
                            var elemTop = $target.offset().top - 80;
                            $("html, body").stop().animate({
                                scrollTop: Math.max(0, elemTop)
                            }, 600);
                        }
                    }, 400);
                }
            }
        }

        scrollToHashTarget();
        $(window).on("load", scrollToHashTarget);
        $(window).on("hashchange", scrollToHashTarget);
    }

    // Also support back-top with smoother
    $documentOn.on('click', '#back-top', function() {
        if (window.smoother && typeof window.smoother.scrollTo === "function") {
            window.smoother.scrollTo(0, true);
        } else {
            $('html, body').animate({ scrollTop: 0 }, 800);
        }
        return false;
    });

    /* ================================
       Text Anim Js Start
    ================================ */

      if (
    typeof SplitText !== "undefined" &&
        document.querySelectorAll(".split-title").length > 0
        ) {
    document.querySelectorAll(".split-title").forEach((title) => {

        // split by words + chars (IMPORTANT)
        const split = new SplitText(title, {
        type: "words,chars"
        });

        // add class to chars
        split.chars.forEach((char) => {
        char.classList.add("char");
        });

        // GSAP animation
        gsap.to(split.chars, {
        scrollTrigger: {
            trigger: title,
            start: "top 90%",
            toggleActions: "play reset play reset"
        },
        duration: 0.8,
        clipPath: "inset(0% 0% -15% 0%)",
        x: 0,
        opacity: 1,
        ease: "power4.out",
        stagger: 0.03
        });

    });
    }

     if (typeof gsap !== "undefined") {
          gsap.registerPlugin(ScrollTrigger, SplitText);

          let mm = gsap.matchMedia();

          mm.add("(min-width: 1200px)", () => {

              let splits = [];

              // ===== tz-sub-tilte =====
              $('.tz-sub-tilte').each(function (index, el) {

              let split = new SplitText(el, {
                  type: "lines,words,chars",
                  linesClass: "split-line"
              });

              splits.push(split);

              gsap.set(split.chars, {
                  opacity: 0,
                  x: 7
              });

              gsap.to(split.chars, {
                  scrollTrigger: {
                  trigger: el,
                  start: "top 90%",
                  end: "top 60%",
                  scrub: 1
                  },
                  x: 0,
                  opacity: 1,
                  duration: 0.7,
                  stagger: 0.2
              });
              });

              // ===== tz-itm-title =====
              $('.tz-itm-title').each(function (index, el) {

              let split = new SplitText(el, {
                  type: "lines,words,chars",
                  linesClass: "split-line"
              });

              splits.push(split);

              gsap.set(split.chars, {
                  opacity: 0.3,
                  x: -7
              });

              gsap.to(split.chars, {
                  scrollTrigger: {
                  trigger: el,
                  start: "top 92%",
                  end: "top 60%",
                  scrub: 1
                  },
                  x: 0,
                  opacity: 1,
                  duration: 0.7,
                  stagger: 0.2
              });
              });

              // ðŸ”¥ MOST IMPORTANT PART
              ScrollTrigger.refresh();

              // ðŸ”¥ cleanup on breakpoint change
              return () => {
              splits.forEach(split => split.revert());
              ScrollTrigger.getAll().forEach(st => st.kill());
              };

          });
    }

    /* ================================
       Sticky Js Start
    ================================ */

    let pr = gsap.matchMedia();
	pr.add("(min-width: 1199px)", () => {
		let tl = gsap.timeline();
		let panels = document.querySelectorAll('.tp-panel-pin')
		panels.forEach((section, index) => {
			tl.to(section, {
				scrollTrigger: {
					trigger: section,
					pin: section,
					scrub: 1,
					start: 'top 14%',
					end: "bottom 65%",
					endTrigger: '.tp-panel-pin-area',
					pinSpacing: false,
					markers: false,
				},
			})
		})
	});

     let pr2 = gsap.matchMedia();
    pr2.add("(min-width: 1199px)", () => {
        let tl = gsap.timeline();
        let panels = document.querySelectorAll('.tp-panel-pin2');
        panels.forEach((section, index) => {
            tl.to(section, {
                scrollTrigger: {
                    trigger: section,
                    pin: section,
                    scrub: 1,
                    start: 'top 15%',
                    end: 'bottom 95%',
                    endTrigger: '.tp-panel-pin-area2',
                    pinSpacing: false,
                    markers: false,
                },
            });
        });
    });

     /* ================================
       Approach Anim Js Start
    ================================ */

    if (document.querySelectorAll(".approach-area").length > 0) {

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1199px)", () => {

        const boxes = document.querySelectorAll(".approach-area .approach-box");

        gsap.from(boxes, {
            x: "100%",
            duration: 1,
            stagger: 0.3,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".approach-wrapper-box",
                start: "top 100%",
                end: "bottom 40%",
                scrub: 2,
                toggleActions: "play none none reverse",
            },
        });

    });
    }

     /* ================================
       Des Portfolio Anim Js Start
    ================================ */
    
    if (document.querySelector(".des-portfolio-wrap")) {
        const pr = ScrollTrigger.matchMedia();

        pr.add("(min-width: 1199px)", () => {

            const sections = document.querySelectorAll(".des-portfolio-panel");
            const wrap = document.querySelector(".des-portfolio-wrap");

            if (!sections.length || !wrap) return;

            // Initial state
            gsap.set(sections, { scale: 1 });

            // Animate each section except the last one
            sections.forEach((section, index) => {
                const isLast = index === sections.length - 1;

                gsap.to(section, {
                    scale: isLast ? 1 : 0.8,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 14%",
                        end: "bottom 80%",
                        scrub: true,
                        pin: true,
                        pinSpacing: false,
                        endTrigger: wrap,
                        markers: false,
                    },
                });
            });

            // Cleanup on condition change
            return () => {
                ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            };
        });
    }

    

    }); // End Document Ready Function


    /* ==========================================================================
       Geniebag Solutions - TWO DEDICATED LOADERS:
       Loader 1: Initial Website Visit Preloader (Dual Rings & Live Percent Counter)
       Loader 2: Menu / Page Navigation Loader (Branded Logo Pulse & Progress Track)
       ========================================================================== */

    function initAnimations() {
        if (typeof wowController === "function") {
            wowController();
        }
        if (typeof gsapController === "function") {
            gsapController();
        }
    }

    const $progress = $("#genie-top-progress");
    const $initialPreloader = $("#genie-initial-preloader");
    const $menuLoader = $("#genie-menu-loader");
    const $percentEl = $("#genie-loader-percent");

    // Check if this page load is caused by internal menu navigation
    let isMenuChange = false;
    try {
        if (document.documentElement.classList.contains("genie-is-menu-transition") ||
            sessionStorage.getItem("genie_is_menu_change") === "1") {
            isMenuChange = true;
            document.documentElement.classList.add("genie-is-menu-transition");
            sessionStorage.removeItem("genie_is_menu_change");
        }
    } catch (e) {
        isMenuChange = false;
    }

    let currentPercent = 0;
    let percentTimer = null;
    let isRevealed = false;

    if (isMenuChange) {
        // --- CASE B: MENU PAGE CHANGE ---
        // Completely destroy Loader 1 from the DOM so it CAN NEVER SHOW
        if ($initialPreloader.length) {
            $initialPreloader.remove();
        }

        // Show Loader 2 (Menu Loader) with animated top bar
        if ($menuLoader.length) {
            $menuLoader.addClass("is-active").show();
        }
        if ($progress.length) {
            $progress.css({ width: "70%", opacity: "1" });
        }
    } else {
        // --- CASE A: FIRST TIME VISIT / RELOAD ---
        // Ensure Loader 2 is completely hidden
        if ($menuLoader.length) {
            $menuLoader.removeClass("is-active").hide();
        }

        // Run Loader 1 Percentage Counter
        currentPercent = 0;
        if ($percentEl.length) {
            $percentEl.text("0");
            clearInterval(percentTimer);
            percentTimer = setInterval(function () {
                if (isRevealed) {
                    clearInterval(percentTimer);
                    return;
                }
                if (currentPercent < 88) {
                    currentPercent += Math.floor(Math.random() * 5) + 3;
                    if (currentPercent > 88) currentPercent = 88;
                    $percentEl.text(currentPercent);
                }
            }, 35);
        }
    }

    function finishPercentCounter(callback) {
        clearInterval(percentTimer);
        if (!$percentEl.length) {
            if (callback) callback();
            return;
        }

        const finishInterval = setInterval(function () {
            if (currentPercent < 100) {
                currentPercent += 4;
                if (currentPercent > 100) currentPercent = 100;
                $percentEl.text(currentPercent);
            } else {
                clearInterval(finishInterval);
                if (callback) callback();
            }
        }, 12);
    }

    function revealPage() {
        if (isRevealed) return;
        isRevealed = true;

        if ($progress.length) {
            $progress.css({ width: "100%", opacity: "1" });
            setTimeout(function () {
                $progress.css({ opacity: "0" });
                setTimeout(function () {
                    $progress.css({ width: "0%" });
                }, 300);
            }, 250);
        }

        if (isMenuChange) {
            // Dismiss Loader 2 (Menu Loader)
            setTimeout(function () {
                if ($menuLoader.length) {
                    $menuLoader.fadeOut(200, function () {
                        $(this).removeClass("is-active");
                    });
                }
                $("body").removeClass("is-page-loading");
                document.documentElement.classList.remove("genie-is-menu-transition");
                initAnimations();
            }, 140);
        } else {
            // Dismiss Loader 1 (Initial Preloader with Dual Rings)
            if ($initialPreloader.length && $initialPreloader.hasClass("is-loading")) {
                finishPercentCounter(function () {
                    setTimeout(function () {
                        $initialPreloader.removeClass("is-loading").addClass("is-loaded");
                        setTimeout(function () {
                            $initialPreloader.fadeOut(350);
                            initAnimations();
                        }, 200);
                    }, 150);
                });
            } else {
                initAnimations();
            }
        }
    }

    // Trigger reveal when window finishes loading
    $windowOn.on("load", function () {
        revealPage();
    });

    // Fallback safety timeout in case window load already fired
    $(document).ready(function () {
        setTimeout(function () {
            if (!isRevealed) {
                revealPage();
            }
        }, isMenuChange ? 450 : 1200);
    });

    // Intercept menu and internal navigation clicks to trigger LOADER 2
    $(document).on("click", "a[href]", function (e) {
        const href = $(this).attr("href");
        const target = $(this).attr("target");

        // Ignore empty, anchor-only, javascript, mailto, tel, or new tab links
        if (!href || href === "#" || href.startsWith("#") || href.startsWith("javascript:") ||
            href.startsWith("mailto:") || href.startsWith("tel:") || target === "_blank") {
            return;
        }

        // Check if internal navigation
        const isInternal = (
            href.startsWith("/") ||
            href.startsWith("./") ||
            href.startsWith("about") ||
            href.startsWith("service") ||
            href.startsWith("faq") ||
            href.startsWith("contact") ||
            href.startsWith("index") ||
            (!href.includes("://") && !href.startsWith("//"))
        );

        if (!isInternal) return;

        // Check if clicking current page anchor
        const currentPath = window.location.pathname.replace(/^\/|\/$/g, "");
        const targetClean = href.split("?")[0].split("#")[0].replace(/^\/|\/$/g, "");
        if (currentPath === targetClean || (currentPath === "" && (targetClean === "" || targetClean === "index.html"))) {
            if (href.includes("#")) {
                return; // Let anchor smooth-scroll naturally
            }
        }

        // Do not intercept if user holds modifier keys (Ctrl/Cmd for new tab)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.which === 2) {
            return;
        }

        e.preventDefault();

        // 1. Mark session flag so next page knows this is a MENU CHANGE
        try {
            sessionStorage.setItem("genie_is_menu_change", "1");
        } catch (err) {}

        // 2. Animate top glowing progress bar
        if ($progress.length) {
            $progress.css({ width: "0%", opacity: "1" });
            setTimeout(function () {
                $progress.css({ width: "70%" });
            }, 10);
        }

        // 3. Smoothly show Loader 2 (Menu Loader)
        document.documentElement.classList.add("genie-is-menu-transition");
        if ($menuLoader.length) {
            $menuLoader.addClass("is-active").show();
        }

        $("body").addClass("is-page-loading");

        // 4. Navigate smoothly to target page
        setTimeout(function () {
            window.location.href = href;
        }, 150);
    });

    // Handle browser Back/Forward (bfcache) restore
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            $("body").removeClass("is-page-loading");
            if ($menuLoader.length) {
                $menuLoader.removeClass("is-active").hide();
            }
            revealPage();
        }
    });

        /* ==========================================================================
       What We Do Section - Senior Micro-Interactions (Tilt, Spotlight, Count-Up, Scroll Reveal)
       ========================================================================== */

    (function initWwdInteractions() {
        const wwdSection = document.getElementById('services');
        if (!wwdSection) return;

        // 1. Scroll-Reveal via IntersectionObserver (or instant fallback)
        if ('IntersectionObserver' in window) {
            const wwdRevealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        wwdSection.classList.add('is-revealed');
                        triggerCountUps();
                        wwdRevealObserver.unobserve(wwdSection);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

            wwdRevealObserver.observe(wwdSection);

            // Safety timeout: ensure cards are never stuck invisible under any circumstances
            setTimeout(() => {
                if (!wwdSection.classList.contains('is-revealed')) {
                    wwdSection.classList.add('is-revealed');
                    triggerCountUps();
                }
            }, 2000);
        } else {
            wwdSection.classList.add('is-revealed');
            triggerCountUps();
        }

        // 2. Count-Up Animation for Stat Tiles (cubic ease-out, respects reduced motion)
        let countUpTriggered = false;
        function triggerCountUps() {
            if (countUpTriggered) return;
            countUpTriggered = true;

            const statNumbers = wwdSection.querySelectorAll('.gb-stat-num');
            const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            statNumbers.forEach(numEl => {
                const target = parseInt(numEl.getAttribute('data-target'), 10);
                if (isNaN(target)) return;

                if (isReducedMotion || target === 0) {
                    numEl.textContent = target;
                    return;
                }

                numEl.textContent = '0';
                const duration = 1600; // ms
                const startTime = performance.now();

                function step(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Cubic ease out curve
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const currentVal = Math.floor(easeOut * target);

                    numEl.textContent = currentVal;

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        numEl.textContent = target;
                    }
                }

                requestAnimationFrame(step);
            });
        }

        // 3. Desktop 3D Tilt & Cursor Spotlight (Fine pointer + hover devices only)
        if (window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
            const cards = wwdSection.querySelectorAll('.gb-wwd__card');

            cards.forEach(card => {
                let rafId = null;

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const cx = rect.width / 2;
                    const cy = rect.height / 2;

                    // Subtle 3D tilt: max 4.5 degrees
                    const rx = (((y - cy) / cy) * -4.5).toFixed(2);
                    const ry = (((x - cx) / cx) * 4.5).toFixed(2);

                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = requestAnimationFrame(() => {
                        card.style.setProperty('--mx', `${x.toFixed(1)}px`);
                        card.style.setProperty('--my', `${y.toFixed(1)}px`);
                        card.style.setProperty('--rx', `${rx}deg`);
                        card.style.setProperty('--ry', `${ry}deg`);
                    });
                });

                card.addEventListener('mouseleave', () => {
                    if (rafId) cancelAnimationFrame(rafId);
                    // Smooth reset handled by CSS transition
                    card.style.setProperty('--rx', '0deg');
                    card.style.setProperty('--ry', '0deg');
                    card.style.removeProperty('--mx');
                    card.style.removeProperty('--my');
                });
            });
        }
    })();


    /* ==========================================================================
       Our Method Section - Connected Journey & Stage Progress Interactions
       ========================================================================== */
    (function initMethodJourney() {
        const methodSection = document.getElementById('methodology');
        if (!methodSection) return;

        const grid = methodSection.querySelector('.gb-method__grid');
        const nodes = methodSection.querySelectorAll('.gb-method__node');
        const svgEl = methodSection.querySelector('.gb-method__journey-svg');
        const pathBg = methodSection.querySelector('.gb-method__path-bg');
        const pathActive = methodSection.querySelector('.gb-method__path-active');

        // Dynamically align SVG connector path through corridor and nodes
        function alignTrackPath() {
            if (window.innerWidth < 992 || !grid || nodes.length < 6 || !svgEl || !pathBg || !pathActive) return;

            const gRect = grid.getBoundingClientRect();
            if (gRect.width === 0 || gRect.height === 0) return;

            const pts = Array.from(nodes).map(n => {
                const nRect = n.getBoundingClientRect();
                return {
                    x: Math.round(nRect.left + nRect.width / 2 - gRect.left),
                    y: Math.round(nRect.top + nRect.height / 2 - gRect.top)
                };
            });

            const gw = Math.round(gRect.width);
            const gh = Math.round(gRect.height);
            svgEl.setAttribute('viewBox', `0 0 ${gw} ${gh}`);

            const r1y = pts[2].y;
            const r2y = pts[3].y;
            // Corridor between rows
            const midY = Math.round((r1y + r2y) / 2);
            const rightEdge = Math.round(gw - 8);
            const leftEdge = 8;

            // Snaking journey: Row 1 (01 -> 02 -> 03) -> loop down into corridor -> loop into Row 2 (04 -> 05 -> 06)
            const d = `M ${pts[0].x},${pts[0].y} ` +
                      `L ${pts[1].x},${pts[1].y} ` +
                      `L ${pts[2].x},${pts[2].y} ` +
                      `L ${rightEdge - 15},${r1y} ` +
                      `C ${rightEdge + 10},${r1y} ${rightEdge + 10},${midY} ${rightEdge - 15},${midY} ` +
                      `L ${leftEdge + 15},${midY} ` +
                      `C ${leftEdge - 10},${midY} ${leftEdge - 10},${r2y} ${leftEdge + 15},${r2y} ` +
                      `L ${pts[3].x},${pts[3].y} ` +
                      `L ${pts[4].x},${pts[4].y} ` +
                      `L ${pts[5].x},${pts[5].y}`;

            pathBg.setAttribute('d', d);
            pathActive.setAttribute('d', d);

            try {
                const totalLen = Math.round(pathActive.getTotalLength());
                pathActive.style.strokeDasharray = `${totalLen}`;
                if (!methodSection.classList.contains('is-revealed')) {
                    pathActive.style.strokeDashoffset = `${totalLen}`;
                } else {
                    pathActive.style.strokeDashoffset = '0';
                }
            } catch (err) {}
        }

        // Initialize path dimensions on load and resize
        alignTrackPath();
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(alignTrackPath, 150);
        });

        // Trigger reveal, progressive drawing, and node lighting
        let methodRevealed = false;
        function triggerReveal() {
            if (methodRevealed) return;
            methodRevealed = true;
            methodSection.classList.add('is-revealed');
            alignTrackPath();

            if (pathActive) {
                pathActive.style.strokeDashoffset = '0';
            }

            const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (isReducedMotion) {
                nodes.forEach(node => node.classList.add('is-active'));
                return;
            }

            // Light up stage nodes progressively along the journey path
            nodes.forEach((node, idx) => {
                setTimeout(() => {
                    node.classList.add('is-active');
                }, 180 + idx * 160);
            });
        }

        // Scroll observer for reveal
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        triggerReveal();
                        observer.unobserve(methodSection);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

            observer.observe(methodSection);

            // Safety timeout to ensure section is never stuck invisible
            setTimeout(() => {
                if (!methodSection.classList.contains('is-revealed')) {
                    triggerReveal();
                }
            }, 2500);
        } else {
            triggerReveal();
        }

        // Desktop mouse tracking for spotlight
        if (window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
            const cards = methodSection.querySelectorAll('.gb-method__card');
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left).toFixed(1);
                    const y = (e.clientY - rect.top).toFixed(1);
                    card.style.setProperty('--mx', `${x}px`);
                    card.style.setProperty('--my', `${y}px`);
                });
            });
        }
    })();


})(jQuery); // End jQuery







