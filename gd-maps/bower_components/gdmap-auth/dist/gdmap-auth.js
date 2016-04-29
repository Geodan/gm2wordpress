/*
  Plugin Name: Geodanmaps
  Plugin URI:  www.geodanmaps.nl
  Description: Geodanmaps plugin to embed multiple maps from different public configurations.
  Version: 0.1
  Author: Gabriel Guita
  Author http://www.geodanmaps.nl
  License: MIT
*/
define('NamespaceAuth',[
		'gdmap-core'
	],
	function(
		G
	)
{
	'use strict';

	/**
	 * @property {object} G.auth - Creates the auth namespace within the G namespace
	 */
	G.auth = {};

	/**
	 * @property {string} G.auth.version - Stores the version number of this module. Will be overridden during the build process
	 */
	G.auth.version = '0.0.4-9';

	return G;
});
define('AuthUser',[
		'NamespaceAuth'
	],
	function(
		G
	)
{
	'use strict';
	
	G.auth.AuthUser = G.core.Class.extend({
		_id: null,
		_displayName: null,
		_organisationName: null,
		_organisationCode: null,
		_json: null,

		initialize: function(jsonObject)
		{
			this._json = jsonObject;
			if(jsonObject !== null)
			{
				this._id = jsonObject.id || null;
				this._displayName = jsonObject.displayName || '';
				if(jsonObject.groups.length > 0)
				{
					this._organisationName = jsonObject.groups[0].name;
					this._organisationCode = jsonObject.groups[0].value;
				}
				else
				{
					this._organisationName = '';
					this._organisationCode = '';
				}
			}

			Object.defineProperty(this, 'id', {
				get: function () {
					return this._id;
				}
			});

			Object.defineProperty(this, 'displayName', {
				get: function () {
					return this._displayName;
				}
			});

			Object.defineProperty(this, 'organisationName', {
				get: function () {
					return this._organisationName;
				}
			});

			Object.defineProperty(this, 'organisationCode', {
				get: function () {
					return this._organisationCode;
				}
			});

			Object.defineProperty(this, 'json', {
				get: function () {
					return this._json;
				}
			});
		}
	});
});
define('AuthManager',[
		'NamespaceAuth',
		'AuthUser'
	],
	function (G) {
		'use strict';

		G.auth.AuthManager = G.core.Class.extend({
			statics: {
				DEFAULT_WHOAMI_SERVICE: 'https://services.geodan.nl/accounts/details',
				DEFAULT_LOGOUT_SERVICE: 'https://services.geodan.nl/cas/logout',
				DEFAULT_FORWARD_URL: 'http://www.geodan.nl'
			},

			_currentUser: null,

			initialize: function (whoAmIServiceUrl, logoutServiceUrl, autoRefresh) {
				this._currentUser = null;
				this._whoAmIUrl = whoAmIServiceUrl ? whoAmIServiceUrl : ClassName.DEFAULT_WHOAMI_SERVICE;
				this._logoutUrl = logoutServiceUrl ? logoutServiceUrl : ClassName.DEFAULT_LOGOUT_SERVICE;
				this._autoRefresh = (autoRefresh === undefined || autoRefresh === null) ? true : autoRefresh; //Enable auto refresh automatically when not specified

				Object.defineProperty(this, 'currentUser', {
					get: function () {
						return this._currentUser;
					}
				});
			},

			identifyUser: function (options) {
				this._currentUser = null;
				var requestManager = new G.core.RequestManager();
				var request = requestManager.get(this._whoAmIUrl, options);
				var self = this;
				request.then(
					function (data, textStatus, jqXHR) {
						if (jqXHR.getResponseHeader('content-type').indexOf('application/json') !== -1) {
							self._currentUser = new G.auth.AuthUser(data);
						}
						else if (self._autoRefresh) {
							if (jqXHR.getResponseHeader('content-type').indexOf('text/html') !== -1) {
								//Request is redirected to login page. Refresh the window to let the client redirect to login page also.
								window.location.reload();
							}
						}
					},
					function (jqXHR, textStatus, errorThrown) {
						self._currentUser = null;
					}
				);
				return request;
			},

			logout: function (forwardUrl) {
				this._currentUser = null;
				var url = this._logoutUrl + '?forwardUrl=' + (forwardUrl ? forwardUrl : ClassName.DEFAULT_FORWARD_URL);
				window.open(url, '_self');
			}
		});

		var ClassName = G.auth.AuthManager;

		return G;
	});
define('gdmap-auth',[
		'gdmap-core',
		'AuthManager'
	],
	function(
		G
	)
{
	'use strict';
	
	return G;
});

//# sourceMappingURL=gdmap-auth.js.map