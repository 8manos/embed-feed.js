(function() {
	var

	EMBED_FEED_JQUERY_SRC = window.EMBED_FEED_JQUERY_SRC || '//code.jquery.com/jquery.min.js',
	EMBED_FEED_JQUERY_FEEDS_SRC = window.EMBED_FEED_JQUERY_FEEDS_SRC || '//raw.github.com/camagu/jquery-feeds/master/jquery.feeds.min.js',

	Loader = {
		callback: null,
		none: function(value) {
			return value === null || typeof value === 'undefined';
		},
		loadScript: function(src, callback) {
			var
			head = document.getElementsByTagName('head')[0],
			script = document.createElement('script');

			script.type = 'text/javascript';
			if (!this.none(callback)) {
				script.onreadystate = function() {
					if (this.readyState === 'complete') {
						callback();
					}
				};
				script.onload = callback;
			}
			script.src = src;
			head.appendChild(script);
		},
		load: function(callback) {
			if (Loader.none(Loader.callback)) {
				Loader.callback = callback;
			}

			if (typeof jQuery === 'undefined') {
				Loader.loadScript(EMBED_FEED_JQUERY_SRC, function() {
					jQuery.noConflict();
					Loader.load();
				});
			} else if (typeof jQuery.fn.feeds === 'undefined') {
				Loader.loadScript(EMBED_FEED_JQUERY_FEEDS_SRC, Loader.load);
			} else {
				Loader.callback();
				Loader.callback = null;
			}
		}
	},

	EmbedFeed = {
		init: function() {
			var self = this;

			jQuery('*[data-embed-feed]').each(function() {
				var
				max = jQuery(this).data('max') || 3,
				source = jQuery(this).data('embed-feed'),
				title = jQuery(this).data('title'),
				titleLink = jQuery(this).data('link');

				jQuery(this).html(self.containerTamplate({
					title: title,
					titleLink: titleLink
				}));

				jQuery(this).find('.entries').feeds({
					feeds: {
						source: source
					},
					max: max,
					entryTemplate: self.entryTemplate,
					loadingTemplate: self.loadingTemplate
				});

				jQuery(this).addClass('embed-feed').addClass('embeded');
			});
		}
	};

	EmbedFeed.containerTamplate = function(vars) {
		return	'<h1 class="title"><a href="' + vars.titleLink + '">' + vars.title + '</a></h1>' +
				'<div class="entries"> </div>';
	};
	EmbedFeed.entryTemplate =
	'<div class="entry">' +
		'<h2 class="title"><a href="<!=link!>"><!=title!></a></h2>' +
		'<p class="publishedDate"><!=publishedDate!></p>' +
		'<div class="content"><!=content!></div>' +
	'</div>';

	EmbedFeed.loadingTemplate =
	'<div class="loader">Cargando...</div>';

	Loader.load(function() {
		jQuery(document).ready(function() {
			EmbedFeed.init();
		});
	});
}());
