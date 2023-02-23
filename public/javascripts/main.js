
jQuery(document).ready(function($) {

	var site = {
		clickType: Modernizr.touchevents ? 'tap' : 'click',
		base: $('#site-base').val(),
		stageWidth: 0,
		stageHeight: 0,
		scriptsToLoad: [],
		scriptsLoaded: 0,
		subTimer: -1,
		menuItem: 0,
	};

	site.resize = function() {
		site.stageWidth = $(window).width();
		site.stageHeight = $(window).height();

		if (site.base === 'home') {
			var h = site.stageHeight - $('.brand-logos').outerHeight();
			if (h < 620) h = 620;
			$('.homepage-header').height(h);
			$('body.home').css({paddingTop: h});

			$('.features-col li').height('auto');
			if (site.stageWidth >= 768) {
				$('.features-col.left-col li').each(function() {
					if ($(this).height() > $('.features-col.right-col li').eq($(this).index()).height()) {
						$('.features-col.right-col li').eq($(this).index()).height($(this).height());
					} else {
						$(this).height($('.features-col.right-col li').eq($(this).index()).height());
					}
				});
			}
		}
		site.resizeSubNav();
	};

	site.resizeSubNav = function() {
		if (site.menuItem !== 0) {
			var x = site.menuItem.offset().left + (site.menuItem.outerWidth() * 0.5);
			$('.sub-nav .arrow').css({left: x});

			$('.sub-nav .col').outerHeight('auto');
			var hh = 0;
			$('.sub-nav .col').each(function() {
				if ($(this).outerHeight() > hh) hh = $(this).outerHeight();
			});
			$('.sub-nav .col').outerHeight(hh);

			if ($(window).width() < 768) {
				$('.sub-nav').hide();
			}
		}
	};

	// async script loading
	site.loadScriptsAsync = function() {
		site.scriptsToLoad.push('https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js');	
		if (site.clickType === 'tap') {
			site.scriptsToLoad.push('/javascripts/vendor/jquery.mobile.custom.min.js');
		}
		
		if (site.base === 'home') {
			site.scriptsToLoad.push('https://npmcdn.com/flickity@1.2/dist/flickity.pkgd.min.js');
			if (site.clickType !== 'tap') {
				site.scriptsToLoad.push("/javascripts/device-animation.js");
			}
		}

		for (var i=0; i<site.scriptsToLoad.length; i++) {
			$.ajax({
				url: site.scriptsToLoad[i],
				dataType: 'script',
				cache: true,
				async: true,
				success: site.fileLoaded
			});
		}
	};

	site.fileLoaded = function() {
		site.scriptsLoaded++;
		if (site.scriptsLoaded === site.scriptsToLoad.length)
			site.loadComplete();
	};

	site.loadComplete = function() {
		if (site.base === 'home') site.initHome();
		if (site.base === 'gallery') site.initGallery();
		if (site.base === 'faq') site.initFAQs();
		if (site.base === 'tutorials') site.initTutorials();

		site.initNav();
		site.initMobileNav();
	};

	// Stagger Animations
	site.staggerAnimations = function() {
		if (site.clickType !== 'tap') {
			$('*[data-animation]').each(function() {
				var speed = parseFloat($(this).attr('data-speed')),
				delay = parseFloat($(this).attr('data-delay'));
				TweenMax.to($(this), speed, {x: 0, y: 0, alpha: 1, ease: Quart.easeOut, delay: delay});
			});
		} else {
			$('*[data-animation]').each(function() {
				TweenMax.set($(this), {x: 0, y: 0, alpha: 1});
			});
		}
	};

	// Nav
	site.initNav = function() {
		site.subTimer = -1;
		if (site.clickType !== 'tap') {
			$('.main-nav .has-children').mouseover(function() {
				site.menuItem = $(this);
				var sub = $(this).parent().parent().parent().find('.sub-nav');
				clearTimeout(site.subTimer);
				TweenMax.killTweensOf(sub);
				sub.css({top: $(this).outerHeight()}).show(0);
				site.resizeSubNav();
				TweenMax.to(sub, 0.4, {y: 0, alpha: 1, ease: Quart.easeOut});
			}).mouseout(function() {
				clearTimeout(site.subTimer);
				site.subTimer = setTimeout(site.hideSubNav, 200);
			});
			$('.sub-nav').mouseenter(function() {
				clearTimeout(site.subTimer);
				TweenMax.killTweensOf($(this));
				TweenMax.to($(this), 0.4, {y: 0, alpha: 1, ease: Quart.easeOut});
			}).mouseleave(function() {
				clearTimeout(site.subTimer);
				site.subTimer = setTimeout(site.hideSubNav, 200);
			});

		} else {

			$('.main-nav .has-children').on(site.clickType, function() {
				var sub = $(this).parent().parent().parent().find('.sub-nav');
				site.menuItem = $(this);
				if (sub.is(':visible')) {
					site.hideSubNav();
					$('body').unbind(site.clickType);
				} else {
					TweenMax.killTweensOf(sub);
					sub.css({top: $(this).outerHeight()}).show(0);
					site.resizeSubNav();
					TweenMax.to(sub, 0.4, {y: 0, alpha: 1, ease: Quart.easeOut});

					$('body').on(site.clickType, function(e) {
						if (e.pageY < sub.offset().top || e.pageY > sub.offset().top + sub.height()) {
							e.preventDefault();
							e.stopPropagation();
							site.hideSubNav();
							$('body').unbind(site.clickType);
							return false;
						}
					});
				}
			});

		}
	};

	site.hideSubNav = function() {
		clearTimeout(site.subTimer);
		TweenMax.killTweensOf($(this));
		TweenMax.to($('.sub-nav'), 0.4, {y: 20, alpha: 0, ease: Quart.easeOut, onComplete: function() {
			$('.sub-nav').hide(0);
		}});
	};
	
	// Homepage
	site.menuItem = 0;
	site.initHome = function() {
		site.resize();

		// Setup reveal animations
		TweenMax.set($('.features .col'), {x: screen.width, alpha: 1});

		var featuresTextShown = false, featuresDevicesShown = false, featuredListShown = false, galleryShown = false, supportShown = false, getStartedShown = false;

		// Scrolling Common

		var frame = document.getElementById('iframe-animation'), animationPaused = false;

		$(document).scroll(function() {
			// Fixed Nav
			if ($('.brand-logos').offset().top - $(window).scrollTop() <= 80) {
				site.hideSubNav();
				$('.main-header').addClass('shown');
				$('.mobile-header').addClass('shown');
			} else {
				$('.main-header').removeClass('shown');
				$('.mobile-header').removeClass('shown');
			}

			// Turn off canvas
			if ($('.brand-logos').offset().top - $(window).scrollTop() < 0) {
				if (!animationPaused) {
					frame.contentWindow.postMessage('pause', '*');
					$('iframe.animation').hide(0);
					animationPaused = true;
				}

			} else {
				if (animationPaused) {
					frame.contentWindow.postMessage('resume', '*');
					$('iframe.animation').show(0);
					animationPaused = false;
				}
			}
		});

		if (site.clickType !== 'tap') {
			// header animation is heavy, don't load on mobile
			$('iframe.animation').attr('src', '/header-dh');
			window.deviceAnimations('.device canvas');
			
			// Scrolling Desktop

			$(document).scroll(function() {
				// Header parallax
				if (site.clickType !== 'tap') {
					if ($('.main-article').scrollTop() < $('.homepage-header').height()) {
						var pct = $(this).scrollTop() / $('.homepage-header').height() * 100;
						$('.homepage-header').css({transform: 'translate3d(0px, -' + (2 * pct) + 'px, 0)'});
					}
				}

				// Sections in
				if (!featuresTextShown) {
					if ($('.features').offset().top - 50 - $(window).scrollTop() <= ($(window).height() * 0.65)) {
						featuresTextShown = true;
						TweenMax.staggerTo('.features .col', 1, {x: 0, ease: Quart.easeOut}, 0.15);
					}
				}
				if (!featuresDevicesShown) {
					if ($('.features').offset().top + 250 - $(window).scrollTop() <= ($(window).height() * 0.65)) {
						featuresDevicesShown = true;
						$('.features .device').each(function() {
							TweenMax.to($(this), 0.4, {y: 0, ease: Quart.easeOut, delay: $(this).attr('data-delay')});
						});
						TweenMax.to($('.features .button'), 0.4, {y: 0, ease: Quart.easeOut, delay: $('.features .button').attr('data-delay')});
					}
				}
				if (!featuredListShown) {
					if ($('.features-list').offset().top + 50 - $(window).scrollTop() <= ($(window).height() * 0.65)) {
						featuredListShown = true;
						$('.features-list li').each(function() {
							TweenMax.to($(this).find('.text'), 1, {x: 0, alpha: 1, ease: Quart.easeOut, delay: $(this).attr('data-delay')});
							TweenMax.to($(this).find('img'), 1, {x: 0, alpha: 1, ease: Quart.easeOut, delay: $(this).attr('data-delay')});
						});

						$('.features-list *[data-animation]').each(function() {
							var speed = parseFloat($(this).attr('data-speed')),
							delay = parseFloat($(this).attr('data-delay'));
							TweenMax.to($(this), speed, {x: 0, y: 0, alpha: 1, ease: Quart.easeOut, delay: delay});
						});
					}
				}
				if (!galleryShown) {
					if ($('.projects').offset().top - $(window).scrollTop() <= ($(window).height() * 0.65)) {
						galleryShown = true;
						$('.projects *[data-animation]').each(function() {
							var speed = parseFloat($(this).attr('data-speed')),
							delay = parseFloat($(this).attr('data-delay'));
							TweenMax.to($(this), speed, {x: 0, y: 0, alpha: 1, ease: Quart.easeOut, delay: delay});
						});
					}
				}
				if (!supportShown) {
					if ($('.support').offset().top - $(window).scrollTop() <= ($(window).height() * 0.65)) {
						supportShown = true;
						$('.support *[data-animation]').each(function() {
							var speed = parseFloat($(this).attr('data-speed')),
							delay = parseFloat($(this).attr('data-delay'));
							TweenMax.to($(this), speed, {x: 0, y: 0, alpha: 1, ease: Quart.easeOut, delay: delay});
						});
					}
				}
				if (!getStartedShown) {
					if ($('.get-started').offset().top - $(window).scrollTop() <= ($(window).height() * 0.65)) {
						getStartedShown = true;
						$('.get-started *[data-animation]').each(function() {
							var speed = parseFloat($(this).attr('data-speed')),
							delay = parseFloat($(this).attr('data-delay'));
							TweenMax.to($(this), speed, {x: 0, y: 0, alpha: 1, ease: Quart.easeOut, delay: delay});
						});
					}
				}
			});
		} else {

			// Show everything
			TweenMax.set($('*[data-animation]'), {x: 0, y: 0, alpha: 1});
			TweenMax.set($('.features .col'), {x: 0});
			TweenMax.set($('.features .device'), {y: 0});
			TweenMax.set($('.features .button'), {y: 0});
			TweenMax.set($('.features-list li .text, .features-list li img'), {x: 0, alpha: 1});
		}
		$(document).scroll();

		// Logos animation
		$('.brand-logos .mask').flickity({
			cellAlign: 'left',
			wrapAround: true,
			groupCells: 2,
			autoPlay: 3000,
			pauseAutoPlayOnHover: false,
			prevNextButtons: false,
			pageDots: false
		});

		// 3D hover on thumbanils
		site.galleryThumbInteraction();

		// Support Floaters
		$(window).mousemove(function(e) {
			var x = e.pageX - $('.support').offset().left,
			y = e.pageY - $('.support').offset().top;

			var px = x/$('.support').width(), py = y/$('.support').height();
			var bg1x = (100 - (200*px)) + 'px',
			bg1y = (-60 + (120*py)) + 'px',
			bg2x = (-60 + (120*px)) + 'px',
			bg2y = (-60 + (120*py)) + 'px';

			TweenMax.to($('.support .bg-1'), 5, {x: bg1x, y: bg1y, ease: Quad.easeOut});
			TweenMax.to($('.support .bg-2'), 4, {x: bg2x, y: bg2y, ease: Quad.easeOut});
		});
	};

	// Gallery
	site.initGallery = function() {
		site.staggerAnimations();
		site.galleryThumbInteraction();
	};

	site.galleryThumbInteraction = function() {
		if (site.clickType !== 'tap') {
			TweenMax.set($('.project-list .project'), {rotationY: 0, rotationX: 0, rotationZ: 0, transformPerspective: 1000});
			$('.project-list .project').mouseover(function() {
				$('.project-list .project').mousemove(function(e) {
					var x = e.pageX - $(this).offset().left,
					y = e.pageY - $(this).offset().top;

					var px = x/$(this).width(), py = y/$(this).height();
					var xx = -10 + (20*px), yy = 10 - (20*py);
					
					TweenMax.to($(this), 0.5, {rotationY: xx, rotationX: yy, rotationZ: 0, transformPerspective: 1000, ease: Quad.easeOut});
				});
			}).mouseout(function() {
				$(this).unbind('mousemove');
				TweenMax.to($(this), 0.5, {rotationY: 0, rotationX: 0, rotationZ: 0, transformPerspective: 1000, ease: Quad.easeOut});
			});
		}
	};

	// FAQs

	site.initFAQs = function() {
		site.staggerAnimations();

		$('.faq-list li').click(function() {
			$(this).toggleClass('open');
			$(this).find('.big-text').slideToggle(250);
		});

		setTimeout(function() {
			$('.faq-list li').eq(0).click();
		}, 500);
	};

	// Tutorials
	site.initTutorials = function() {
		site.staggerAnimations();
	};

	// Mobile Nav
	site.initMobileNav = function() {
		$('.mobile-header .bar').click(function() {
			if ($('.mobile-header').hasClass('open')) site.closeMobileNav();
			else site.openMobileNav();
		});
	};

	site.openMobileNav = function() {
		$('.mobile-header nav').show(0);
		$('.mobile-header').addClass('open');
		
		TweenMax.to('#line1', 0.2, {y: 0, ease: Linear.easeNone});
		TweenMax.to('#line2', 0, {alpha: 0, ease: Linear.easeNone, delay: 0.2});
		TweenMax.to('#line3', 0.2, {y: 0, ease: Linear.easeNone});

		TweenMax.to('#line1', 0.2, {rotation: 45, ease: Quart.easeOut, delay: 0.2});
		TweenMax.to('#line3', 0.2, {rotation: -45, ease: Quart.easeOut, delay: 0.2});
	};

	site.closeMobileNav = function() {
		$('.mobile-header').removeClass('open');

		TweenMax.to('#line1', 0.2, {rotation: 0, ease: Linear.easeNone, delay: 0});
		TweenMax.to('#line3', 0.2, {rotation: 0, ease: Linear.easeNone, delay: 0});
		
		TweenMax.to('#line2', 0, {alpha: 1, ease: Quart.easeOut, delay: 0.2});
		TweenMax.to('#line1', 0.2, {y: -8, ease: Quart.easeOut, delay: 0.2});
		TweenMax.to('#line3', 0.2, {y: 8, ease: Quart.easeOut, delay: 0.2, onComplete: function() {
			$('.mobile-header nav').hide(0);
		}});
	};

	site.init = function() {
		if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) site.clickType = 'click';
		$(window).resize(site.resize);
		
		site.loadScriptsAsync();

		// Setup buttons
		$('.button').each(function() {
			var text = $(this).html(), borders = $(this).hasClass('transparent') ? '' : '<div class="rect"><i class="r1"></i><i class="r2"></i><i class="r3"></i><i class="r4"></i></div>';

			$(this).html('<span>'+text+'</span><svg class="next" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 23 14" xml:space="preserve"><line x1="22" y1="7" x2="16" y2="1" /><line x1="22" y1="7" x2="16" y2="13" /><line x1="0" y1="7" x2="23" y2="7" /></svg>'+borders);
		});

		if (site.clickType !== 'tap') {
			$('.button').mouseover(function() {
				$(this).addClass('hover');
			}).mouseout(function() {
				$(this).removeClass('hover');
			});
		}
	};

	site.init();

	$(document).ready(function(){
        if(document.location.href=="http://127.0.0.1:3010/"){
            $("#home").addClass("current");
            $("#home_m").addClass("current");
        }
        else if(document.location.href.includes("brainstorm")){
            $("#brainstorm").addClass("current");
            $("#brainstorm_m").addClass("current");
        }
        else if(document.location.href.includes("pinode")){
            $("#pinode").addClass("current");
            $("#pinode_m").addClass("current");
        }
        else if(document.location.href.includes("down")){
            $("#down").addClass("current");
            $("#down_m").addClass("current");
        }
        else if(document.location.href.includes("faq")){
            $("#faq").addClass("current");
            $("#faq_m").addClass("current");
        }
        else if(document.location.href.includes("support")){
            $("#support").addClass("current");
            $("#support_m").addClass("current");
        }
        
        //window.alert(document.location.href);
	});
});