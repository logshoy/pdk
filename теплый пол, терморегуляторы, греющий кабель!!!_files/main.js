function clickActive(button, block){
	$(document).on('click', button, function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(block).removeClass('active');
		} else {
			$(this).addClass('active');
			$(block).addClass('active');
		}
  });
}

function addSpaces(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ' ' + '$2');
	}
	return x1 + x2;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    url = url.toLowerCase(); // This is just to avoid case sensitiveness
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function refreshPage(url){
	$('.preloader').fadeIn('fast');
	$.get(url, function(data){
		$('.preloader').fadeOut();
		document.title = $(data).filter('title').text();
		$('.wrapper').html($(data).filter('.wrapper').html());
		loadPage();
	});
	history.pushState('data', '', url);
}


function loadPage(){
	if(typeof init == 'undefined') return false;

	//setTimeout(function(){
		$.each(init, function(i, initFunc){
			initFunc();
		});
	//}, 300);
	$(window).resize();
	return true;
}
$(document).ready(function(){
		loadPage();
});

/*************


FUNCTIONS ON PAGE LOAD


***************/

var init = [
	function(){
		clickActive('.toggle-nav', '.header nav');

		if($('[data-range]').length > 0){
			$('[data-range]').each(function(){
				$(this).ionRangeSlider({
					type: 'double',
					postfix: $(this).data('postfix') ? $(this).data('postfix') : ' руб.',
					max_postfix: '+',
					input_values_separator: ',',
					min: 0,
					force_edges: true,
					onFinish: function(data){
						var rangeInput = $(data.input).data('rangeInput');
						console.log(data);
						if(data.from + ',' + data.to == data.min + ',' + data.max){
							$('[data-filter='+rangeInput+']').val('');
							$('[data-filter='+rangeInput+']').trigger('change');
						} else {
							$('[data-filter='+rangeInput+']').val(data.from + ',' + data.to);
							$('[data-filter='+rangeInput+']').trigger('change');
						}
					}
				});
			});
		}

		/*
		* Mail Form
		*/
		$('[data-mail-form]').submit(function(){
			form = $(this);
			form.data('defaultText', form.text());
			form.find('.button').attr('disabled', 'disabled');
			form.find('.button').text('Отправка...');

			$.post($(this).attr('action'), $(this).serialize(), function(result){
				if(result == '1'){
					form.find('.form-notice_error').hide();
					form.find('.form-notice_success').show();
					form.find('.button').hide();
					form.find('input').attr('disabled', 'disabled');
				} else {
					form.find('.form-notice_error').html(result);
					form.find('.form-notice_error').show();
					form.find('.button').removeAttr('disabled');
				}
				form.find('.button').text(form.data('defaultText'));
			});

			return false;
		});


		/* Reviews */

		$('[data-starrable] i').mouseenter(function(){
			$('[data-starrable] i').removeClass('icon_rating-star_active');
			$(this).prevAll().addClass('icon_rating-star_active');
			$(this).addClass('icon_rating-star_active');
		});
		$('[data-starrable]').mouseleave(function(){
			$('[data-starrable] i').removeClass('icon_rating-star_active');

			$('[data-starrable] i.icon_rating-star_selected').addClass('icon_rating-star_active');
			$('[data-starrable] i.icon_rating-star_selected').prevAll().addClass('icon_rating-star_active');
		});

		$('[data-starrable] i').click(function(){
			var starrable = $(this).closest('[data-starrable]').data('starrable');

			$('[data-starrable] i').removeClass('icon_rating-star_active');
			$('[data-starrable] i').removeClass('icon_rating-star_selected');

			$(this).prevAll().addClass('icon_rating-star_active');
			$(this).addClass('icon_rating-star_active');
			$(this).addClass('icon_rating-star_selected');

			$('[data-stars-input="' + starrable + '"]').val(
				$(this).data('star')
			);
		});

		/* / Reviews */

		$('.main-slider').not('.slick-initialized').slick({
			speed: 500,
			fade: true,
			slide: 'a',
			autoplay: true,
			autoplaySpeed: 3500,
			dots: true,
			arrows: true,
			infinite: false,
			nextArrow: '<div class="arrows__next"><i class="icon icon_chevron-right"></i></div>',
			prevArrow: '<div class="arrows__prev"><i class="icon icon_chevron-left"></i></div>'
		});
		$('.brand-slider').not('.slick-initialized').slick({
			speed: 500,
			slidesToShow: 5,
			slidesToScroll: 3,
			slide: 'a',
			arrows: true,
			nextArrow: '<div class="arrows__next"><i class="icon icon_chevron-right"></i></div>',
			prevArrow: '<div class="arrows__prev"><i class="icon icon_chevron-left"></i></div>',
		});
		$('.video-slider').not('.slick-initialized').slick({
			slidesToShow: 4,
			slidesToScroll: 4,
			slide: 'a',
			arrows: false
		});

		/*
		$('.category__item').each(function(){
			console.warn('Item');
			maxCategoryHeight = 0;
			$(this).find('.category__column').each(function(){
				console.log('column');
				if($(this).outerHeight() > maxCategoryHeight) $(this).closest('.category__sub').css('height', $(this).outerHeight());
				maxCategoryHeight = $(this).outerHeight();
				console.error($(this).outerHeight());
			});
		});
		*/

		/*$('.category__sub').each(function(){
			$(this).jScrollPane();
		});*/
		$('.category__main .category__item').hover(function(){
			$(this).find('.category__sub').jScrollPane();
		});
		$('.category__main .category__item').mousewheel(function(event) {
    	event.preventDefault();
		});

		// Cart
		/*
		if($('[data-cart-field]').length > 0){
			$('[data-cart-step]').attr('disabled', 'disabled');
			cartEmpty = false;
			$('[data-cart-field]').each(function(){
				if($(this).val().length == 0) cartEmpty = true;
			});
			if(!cartEmpty) $('[data-cart-step]').removeAttr('disabled');
		}
		*/

		ymaps.ready(mapInit);
	}
];


/************
MAP
************/
var YandexMap, YandexMapObjects;
var yandexMapInit = [];

function mapInit(){
	if($('#map').length <= 0) return false;

	YandexMap = new ymaps.Map('map', {
	    center: [55.7494733, 37.3523199],
	    zoom: 18
	    });
	YandexMapObjects = new ymaps.GeoObjectCollection({}, {
		  preset: "islands#redCircleIcon",
		  strokeWidth: 4,
		  geodesic: true
		});

	YandexMap.geoObjects.add(YandexMapObjects);
	/* MAP */
	if($('.shop_active').length > 0){
		$('.shop_active').trigger('click');
	}

	if(typeof yandexMapInit == 'undefined') return false;
	$.each(yandexMapInit, function(i, initFunc){
		initFunc();
	});
}

$(document).ready(function (){

	$.ajaxSetup({
		headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});

	/**** SEARCH INPUT ****/
	$(window).resize(function(){
		$('.search__result').css('width', $('.search__input').width());
	});
	$(window).resize();

	$('[data-sync-height]').each(function(){
		$(this).on("mousemove", function(){
		  var syncHeight = $(this).data('syncHeight');
			var highestBox = 0;

			$('[data-sync-height="' + syncHeight + '"]').css('height', 'auto');

			$('[data-sync-height="' + syncHeight + '"]:visible').each(function(){
				if($(this)[0].scrollHeight > highestBox) {
          highestBox = $(this)[0].scrollHeight;
        }
			});

			$('[data-sync-height="' + syncHeight + '"]').height(highestBox);
		});
		$(this).on("mouseleave", function(){
			var syncHeight = $(this).data('syncHeight');
			$('[data-sync-height="' + syncHeight + '"]').css('height', 'auto');
		});

		$(this).find('.category__link, .category__sub-link').on('mouseover', function(event){
			console.log(this);
		});
		$(this).find('.category__link, .category__sub-link').on('mouseout', function(){
			console.log('leave');
		});
	});

	$(document).on('keyup', '.search__input input', function(){
		if($(this).val().length == 0){
			$('.search__result').removeClass('search__result_show');
			$('.search__result-items').html('');
		} else if($(this).val().length % 3 == 0){
			$.post('/search/context', {
				query: $(this).val()
			}, function(data){
				$('.search__result').removeClass('search__result_show');
				if(data.length > 0){
					$('.search__result-items').html('');
					$.each(data, function(i, product){
						$('.search__result-items').append('<a href="' + product.route + '" class="search__result-item">' + product.name + '</a>');
					});
					$('.search__result').addClass('search__result_show');
				}
			});
		}
	});

	/*** CATALOG ***/
	$(document).on('click', '.header__cat-button', function(){
		if($('.header__cat-button').hasClass('header__cat-button_active')){
			$('.header__cat-button').removeClass('header__cat-button_active');
			$('.header__cat-dropdown').removeClass('header__cat-dropdown_active');
		} else {
			$('.header__cat-button').addClass('header__cat-button_active');
			$('.header__cat-dropdown').addClass('header__cat-dropdown_active');
		}
	});
	$(document).click(function(e) {
		 if(!$(e.target).hasClass('header__cat-dropdown') && !$(e.target).hasClass('header__cat-button')){
			 $('.header__cat').find('.header__cat-button').removeClass('header__cat-button_active');
			 $('.header__cat').find('.header__cat-dropdown').removeClass('header__cat-dropdown_active');
			 $('.body__overlay').fadeOut(300);
		 }
	});

	/*** GEO ***/
	$(document).on('click', '[data-city-select]', function(){
		var id = $(this).data('citySelect');
		$.getJSON('/geo/set/' + id, function(data){
			if(data.length == 0) return false;
			$('.header__geo-city span').text(data.name);
			$('.header__geo-phone').text(data.phone);
			refreshPage(window.location);
		});
		$('#geo__block').arcticmodal('close');
	});

	$(document).on('keyup', '#geo__block input', function(){
		geoSearchQuery = $(this).val().toUpperCase();
		$('.city-list [data-city-name]').removeClass('city-muted');

		if(geoSearchQuery.length > 0){
			$('.city-list [data-city-name]').each(function(){
				if($(this).data('cityName').toUpperCase().indexOf(geoSearchQuery) == -1){
					$(this).addClass('city-muted');
				}
			});
		}
	});

	/*****

	*****  ORDER BUTTON

	*****/
	$(document).on('click', '[data-cart-order]', function(){
		var productId = $(this).data('cartOrder');
		$('#product-order__block').remove();

		var orderTemplate = '<div style="display: none;">' +
			'<div class="box-modal" id="product-order__block">' +
			'	<div class="box-modal__close arcticmodal-close">закрыть</div>' +
			'		<form action="/cart/orderProduct" method="POST" data-order-form>' +
			'			{product_card}' +
			'			<div class="form-item">' +
			'				<label for="quantity">Количество</label>' +
			'				<input type="number" name="quantity" class="input" id="quantity" placeholder="1" value="1" required>' +
			'			</div>' +
		  '    	<div class="form-item">' +
			'				<label for="name">Имя</label>' +
			'				<input type="text" name="client[name]" class="input" id="name" placeholder="Имя">' +
			'			</div>' +
		  '    	<div class="form-item">' +
			'				<label for="phone">Телефон</label>' +
			'				<input type="text" name="client[phone]" class="input" id="phone" placeholder="Телефон" required>' +
			'			</div>' +
			'			<div class="form-item">' +
			'				<button type="submit" class="button button_orange wide">Заказать</button>' +
			'			</div>' +
			'			<input type="hidden" name="_token" value="' + $('meta[name="csrf-token"]').attr('content') + '">' +
			'		</form>' +
			'	</div>' +
			'</div>';

		$.get('/product/render/' + productId, function(product_card){
			$('body').append(orderTemplate.replace(/{product_card}/g, product_card));
			$('#product-order__block').arcticmodal();
		});
	});

	$(document).on('submit', '[data-order-form]', function(){
		$(this).find('.button').attr('disabled', 'disabled');
		$.post($(this).attr('action'), $(this).serialize(), function(){
			$('#product-order__block').find('form').remove();
			$('#product-order__block').append('<div class="notice notice_success">Спасибо за заказ, наш менеджер свяжется с вами в ближайшее время</div>');
		});
		return false;
	});

	/**** SHOPPING CART ****/
	$(document).on('click', '[data-cart-add]', function(){
		var id = $(this).data('cartAdd');
		var comment = $(this).data('cartComment');
		var stock = $(this).data('cartStock');
		if($(this).hasClass('button_added')){
			$.post('/cart/remove/' + id, {ajax: 1}, function(data){
				$('.header-basket__title-total').text(data.quantity);
				//$('.header-basket__title-total').text(data.total);
			});
			$(this).removeClass('button_added');
			$(this).val('Купить');
		} else {
			$.post('/cart/store/' + id, {ajax: 1, comment: comment, stock: stock}, function(data){
				$('.header-basket__title-total').text(data.quantity);
				//$('.header-basket__title-total').text(addSpaces(data.total));
			});
			$(this).addClass('button_added');
			$(this).val('В корзине');

			$('#cart-added__block').remove();
			var orderTemplate = '<div style="display: none;">' +
				'<div class="box-modal" id="cart-added__block">' +
				'	<div class="box-modal__close arcticmodal-close">закрыть</div>' +
				'	<div class="box-modal__title">Товар добавлен в корзину</div>' +
				'		<div class="box-modal__product">{product_card}</div>' +
				'		<div class="box-modal__buttons clr">' +
				'			<a class="button button_default button_modal-continue arcticmodal-close">Продолжить покупки</a>' +
				'			<a class="button button_buy button_modal-order" href="/cart">Оформить заказ</a>' +
				'		</div>' +
				'	</div>' +
				'</div>';

			setTimeout(function(){
				$.get('/product/render/' + id, function(product_card){
					$('body').append(orderTemplate.replace(/{product_card}/g, product_card));
					$('#cart-added__block').arcticmodal();
				});
			}, 500);

		}
	});

	$(document).on('click', '[data-cart-minus]', function(){
		var id = $(this).data('cartMinus');
		var quantity = parseInt($(this).parent().find('input').val()) - 1;
		var promocode = $('input[name=promocode]').val();
		if(quantity <= 0) return false;

		$.post('/cart/update/' + id, {
			quantity: quantity,
			promocode: promocode
		}, function(data){
			$('.checkout-subtotal__price strong').text(addSpaces(data.total));
			$('.checkout-subtotal__sale strong').text(addSpaces(data.sale));

			$('.checkout-subtotal__price').trigger('priceChanged');

			$('.header-basket__title-quantity').text(data.quantity);
			$('.header-basket__title-total').text(addSpaces(data.total));


			$.each(data.cart, function(index, item){
				$('[data-cart-price="' + item.id + '"]').find('.basket__item-price-current span').text(addSpaces(item.price * item.quantity));
				$('[data-cart-price="' + item.id + '"]').find('.basket__item-price-new span').text(addSpaces(item.price * item.quantity));
				$('[data-cart-price="' + item.id + '"]').find('.basket__item-price-old span').text(addSpaces(item.attributes.old_price * item.quantity));
			});
		});
		$(this).parent().find('input').val(quantity);
	});

	$(document).on('click', '[data-cart-plus]', function(){
		var id = $(this).data('cartPlus');
		var quantity = parseInt($(this).parent().find('input').val()) + 1;
		var promocode = $('input[name=promocode]').val();
		if(quantity <= 0) return false;

		$.post('/cart/update/' + id, {
			quantity: quantity,
			promocode: promocode
		}, function(data){
			$('.checkout-subtotal__price strong').text(addSpaces(data.total));
			$('.checkout-subtotal__sale strong').text(addSpaces(data.sale));

			$('.checkout-subtotal__price').trigger('priceChanged');

			$('.header-basket__title-quantity').text(data.quantity);
			$('.header-basket__title-total').text(addSpaces(data.total));

			$.each(data.cart, function(index, item){
				$('[data-cart-price="' + item.id + '"]').find('.basket__item-price-current span').text(addSpaces(item.price * item.quantity));
				$('[data-cart-price="' + item.id + '"]').find('.basket__item-price-new span').text(addSpaces(item.price * item.quantity));
				$('[data-cart-price="' + item.id + '"]').find('.basket__item-price-old span').text(addSpaces(item.attributes.old_price * item.quantity));
			});
		});
		$(this).parent().find('input').val(quantity);
	});

	$(document).on('click', '[data-cart-delete]', function(){
		var id = $(this).data('cartDelete');
		var promocode = $('input[name=promocode]').val();

		$.post('/cart/remove/' + id, {
			promocode: promocode
		}, function(data){
			if(typeof data.cart != 'undefined' && data.cart.length <= 0){
				refreshPage(window.location.href);
			} else {
				$('.checkout-subtotal__price strong').text(addSpaces(data.total));
				$('.checkout-subtotal__sale strong').text(addSpaces(data.sale));
				$('.checkout-subtotal__price').trigger('priceChanged');
			}

			$('.header-basket__title-quantity').text(data.quantity);
			$('.header-basket__title-total').text(addSpaces(data.total));
		});
		$(this).closest('.basket__item').remove();
	});

	$(document).on('keyup', '[data-cart-field]', function(){
		/*
		$('[data-cart-step]').attr('disabled', 'disabled');
		cartEmpty = false;
		$('[data-cart-field]').each(function(){
			if($(this).val().length == 0) cartEmpty = true;
		});
		if(!cartEmpty) $('[data-cart-step]').removeAttr('disabled');
		*/
	});

	$(document).on('submit', '[data-cart-form]', function(){
		$('.form-item').removeClass('form-item_error');
		cartEmpty = false;

		$('[data-cart-field]').each(function(){
			if($(this).val().length == 0){
				$(this).closest('.form-item').addClass('form-item_error');
				cartEmpty = true;
			}
		});

		if(!cartEmpty) $(this).submit();

		return false;
	});

	$(document).on('click', '[data-cart-finish]', function(){
		if($('[data-cart-field="phone"]').val().length == 0){
			$('[data-cart-field="phone"]').closest('.form-item').addClass('form-item_error');
			return false;
		}

		var form = $(this).closest('form');
    form.attr('action', '/cart/order');
    form.submit();
	});

	$(document).on('change', '[data-delivery-price]', function(){
		var deliveryPrice = $(this).data('deliveryPrice');
		if(!$.isNumeric(deliveryPrice)){
			$('#checkoutDelivery').parent().hide();
			var oldPrice = $('#checkoutPrice').data('price');
			$('#checkoutPrice span').text(oldPrice);
		} else {
			$('#checkoutDelivery').parent().show();
			$('#checkoutDelivery span').text(deliveryPrice);
			var oldPrice = $('#checkoutPrice').data('price');
			var newPrice = parseFloat(oldPrice) + parseFloat(deliveryPrice);
			$('#checkoutPrice span').text(newPrice);
		}
	});

	/**** FILTER ****/
	$(document).on('change', '[data-filter]', function(){
		var url = [location.protocol, '//', location.host, location.pathname].join('');
		query = [];
		if(getParameterByName('category') != null && getParameterByName('category').length > 0){
			query.push('category=' + getParameterByName('category'));
		}
		if(getParameterByName('q') != null && getParameterByName('q').length > 0){
			query.push('q=' + getParameterByName('q'));
		}


		if(getParameterByName('sort') != null && getParameterByName('sort').length > 0){
			query.push('sort=' + getParameterByName('category'));
		}
		if(getParameterByName('order') != null && getParameterByName('order').length > 0){
			query.push('order=' + getParameterByName('order'));
		}
		if(getParameterByName('sale') != null && getParameterByName('sale').length > 0){
			query.push('sale=' + getParameterByName('sale'));
		}

		filterQuery = {};

		$('input[data-filter]:checked, input[data-filter]:text, input[data-filter]:hidden').each(function(){
			var name = $(this).data('filter');
			var value = $(this).val();
			if(value.length > 0){
				if(typeof filterQuery[name] == 'undefined') filterQuery[name] = [];
				filterQuery[name].push(encodeURIComponent(value));
			}
		});

		$.each(filterQuery, function(name, values){
			if(decodeURIComponent(values.join('')).indexOf(';') > -1){
				$.each(values, function(index, value){
					query.push(name + '[]=' + value);
				});
			} else {
				query.push(name + '=' + values.join(';'));
			}
		});

		if(query.length == 0){
			refreshPage(url);
			return true;
		}
		refreshPage(url + '?' + query.join('&'));
	});

	/*** OPTIONS ***/
	$(document).on('mouseenter', '[data-action="options"]', function(){
			$(this).next().removeClass('product-card__desc-content_none');
			$(this).next().addClass('product-card__desc-content_show');
	});
	$(document).on('mouseleave', '[data-action="options"]', function(){
			$(this).next().addClass('product-card__desc-content_none');
			$(this).next().removeClass('product-card__desc-content_show');
	});

	/**** PROMOCODE ****/
	$(document).on('click', '[data-action="promo"]', function(){
		$.post('/cart/promocode', {
			code: $('#promocode').val()
		}, function(data){
			if(typeof data.success != 'undefined'){
				/*$('.checkout-subtotal__price strong').text(data.total);
				$('.checkout-subtotal__sale strong').text(data.sale);

				$('.header-basket__title-quantity').text(data.quantity);
				$('.header-basket__title-total').text(data.total);

				$('input[name=promocode]').val(data.promocode);
				$('.checkout-promo__text').text(data.success);*/
				refreshPage(window.location.href);
			} else if(typeof data.error != 'undefined') {
				$('.checkout-promo__text').text(data.error);
				$('input[name=promocode]').val('');
			} else {
				$('.checkout-promo__text').text('Пожалуйста, укажите промокод');
				$('input[name=promocode]').val('');
			}
		});
	});
	$(document).on('click', '[data-action="promo-cancel"]', function(){
		$.post('/cart/promocode/cancel', function(data){
				refreshPage(window.location.href);
		});
	});

	/**** COMPARE ****/
	$(document).on('click', '[data-compare]', function(){
		id = $(this).data('compare');
		if($(this).hasClass('product-card__compare_active')){
			$(this).removeClass('product-card__compare_active');
			$.get('/comparsion/remove/' + id, function(data){
				$('.panel-compare__count').text(data.count);
				if(data.count == 0) $('.panel-right').removeClass('panel-right_active');
			});
		} else {
			$(this).addClass('product-card__compare_active');
			$.get('/comparsion/store/' + id, function(data){
				$('.panel-compare__count').text(data.count);
				$('.panel-right').addClass('panel-right_active');
			});
		}
	});

	$(document).on('click', '[data-comparsion-remove]', function(){
		id = $(this).data('comparsionRemove');
		$.get('/comparsion/remove/' + id, function(data){
			$('.panel-compare__count').text(data.count);
			if(data.count == 0) $('.panel-right').removeClass('panel-right_active');
			refreshPage(window.location);
		});
	});

	$(document).on('change', '[data-comparsion-differences]', function(){
		if($(this).is(':checked')){
			$('.compare__items').each(function(){
				$(this).hide();

				compareItems = [];
				$(this).find('td:not(:first)').each(function(){
					compareItems.push($(this).text());
				});
				for(var i = 1; i < compareItems.length; i++){
	        if(compareItems[i] !== compareItems[0]){
						$(this).show();
					}
		    }
			});
		} else {
			$('.compare__items').show();
		}
	});

	/**** USER ****/
	$(document).on('click', '[data-action="user"]', function(){
		$('.user__menu').toggleClass('user__menu_active');
	});

	/**** STOCKS ****/

	$(document).on('click', '[data-stock-select]', function(){
		var location = $(this).data('stockSelect').split(',');
		$('.shop_active').removeClass('shop_active');
		$(this).addClass('shop_active');

		var placemark = new ymaps.Placemark(
				[location[0], location[1]]
				);

		YandexMapObjects.removeAll();
		YandexMapObjects.add(placemark);
		YandexMap.setCenter([location[0], location[1]]);
	});
});

$(document).ready(function(){
		$(window).resize(function(){
			$('[data-space]').each(function () {
					var $this = $(this),
							$space = $this.attr('data-space');
							$width = $this.find('slick-list').width();
							$margin = $this.data('margin') ? true : false;

					$this.find('.slick-slide').css({
							marginLeft: $space + 'px',
							marginRight: $space + 'px'
					});

					$this.find('.slick-list').css('max-width', $width);
					if($margin){
						$this.find('.slick-list').css({
							marginLeft: -$space + 'px',
							marginRight: -$space/2 + 'px'
						});
					}
			});
		});
		$(window).resize();

		$(document).on('click', '[data-modal]', function(){
	    $($(this).data('modal')).arcticmodal();
	  });
});

//jQuery(function($){
//   $("#checkout-phone").mask("+7 (999) 999-9999");
//});

(function( $ ){
  $.fn.tabs = function(options) {
    var settings = $.extend( {
      'active_class' : 'active',
      'buttons' : '.tabs__item',
      'tabs' : '.tabs__content-item',
			'callback' : false
    }, options);

    var s_this = $(this);
    buttons = s_this.find(settings.buttons);
    tabs = s_this.find(settings.tabs);
		callback = settings.callback;

    buttons.click(function(){
      tabs.removeClass(settings.active_class);
      buttons.removeClass(settings.active_class);
      var tab_id = $(this).data('open');
      s_this.find('[data-tab='+tab_id+']').addClass(settings.active_class);
      $(this).addClass(settings.active_class);
			if(callback){
				callback();
			}
    });

		$(document).on('click', '[data-open-tab]', function(){
			$('[data-open="' + $(this).data('openTab') + '"]').click();
			$('html, body').animate({
        scrollTop: $('[data-open="' + $(this).data('openTab') + '"]').offset().top - 100
    	}, 500);
		});

  };
})( jQuery );


$(document).ready(function() {
$(window).scroll(function() {
    if ($(this).scrollTop() > 0) {
        $('#arrowup').fadeIn(300);
    } else {
$('#arrowup').fadeOut(200);
    }
});
$('#arrowup').click(function() {
    $('body,html').animate({
        scrollTop: 0
    }, 200);
    return false;
});});
