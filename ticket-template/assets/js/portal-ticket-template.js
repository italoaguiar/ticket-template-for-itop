(function () {
	'use strict';

	var endpoint = (function () {
		if (window.ticketTemplateEndpoint) {
			return window.ticketTemplateEndpoint;
		}

		var origin = window.location.origin || '';
		var path = window.location.pathname || '';
		var execPath = '';

		if (path.indexOf('/pages/exec.php/') !== -1) {
			execPath = path;
		} else if (path.indexOf('/pages/exec.php') !== -1) {
			execPath = path;
		} else {
			var appRoot = path;
			var portalIndex = appRoot.indexOf('/portal');
			if (portalIndex !== -1) {
				appRoot = appRoot.substring(0, portalIndex + 1);
			}
			if (appRoot.charAt(appRoot.length - 1) !== '/') {
				appRoot += '/';
			}
			execPath = appRoot + 'pages/exec.php' + path;
		}

		return origin + execPath + '?exec_module=ticket-template&exec_page=ajax/ticket-template.php';
	})();

	function getSubcategoryId(container) {
		if (!container) {
			return '';
		}

		var field = container.querySelector('select[name="servicesubcategory_id"]');
		return field ? field.value : '';
	}

	function fetchTemplate(subcategoryId) {
		if (!subcategoryId) {
			return Promise.resolve('');
		}

		var separator = endpoint.indexOf('?') === -1 ? '?' : '&';
		var url = endpoint + separator + 'service_subcategory_id=' + encodeURIComponent(subcategoryId);
		return fetch(url, { credentials: 'same-origin' })
			.then(function (response) { return response.json(); })
			.then(function (data) { return data.template || ''; })
			.catch(function () { return ''; });
	}

	function applyTemplateToEditors(container, template) {
		var $root = window.jQuery ? window.jQuery(container) : null;
		if (!$root) {
			return;
		}

		$root.find('textarea.htmlEditor').each(function () {
			var selector = '#' + window.jQuery(this).attr('id');
			if (!selector || selector === '#') {
				return;
			}

			CombodoCKEditorHandler.GetInstance(selector).then(function (editor) {
				if (editor.getData().trim() !== '') {
					return;
				}

				var fallbackTemplate = window.ticketTemplate || '';
				editor.setData(template || fallbackTemplate);
			}).catch(function () {
				// Ignore editor errors.
			});
		});
	}

	function onModalShown(event) {
		var modal = event.target || document;
		var subcategoryId = getSubcategoryId(modal);
		fetchTemplate(subcategoryId).then(function (template) {
			applyTemplateToEditors(modal, template);
		});
	}

	if (window.jQuery) {
		window.jQuery(document).on('shown.bs.modal', onModalShown);
	}
})();
