angular.module('ngZconnected', ['ngZconnected.api', 'ngZconnected.templates', 'ngZconnected.directives'])
    .config(['$httpProvider', 'authenticationInterceptorProvider', function($httpProvider, authenticationInterceptorProvider) {
        $httpProvider.interceptors.push('authenticationInterceptor');
        authenticationInterceptorProvider.error(function() {

            $logoutElement = angular.element('#logoutLink');
            if ($logoutElement.length > 0) {
                window.location.href = $logoutElement.attr('href');
            }
        });

    }])
    .provider('ngZconnected', [function() {
        var self = this;
        this.setApiUrl = function(url) {
            Zconnected.apiUrl = url;
        };
        this.$get = [function() {
            return Zconnected;
        }];
        return self;
    }])
    .filter('html', ['$sce', function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
