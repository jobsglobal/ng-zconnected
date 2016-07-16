angular.module('ngZconnected.directives', ['checklist-model'])

.directive('nonZero', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                nonZero: '='
            },
            link: function(scope, element, attribs, ctrl) {
                function validateNonZero(value) {
                    var valid = value > 0;
                    ctrl.$setValidity('nonZero', valid);
                    return valid ? value : undefined;
                }

                if (scope.nonZero) {
                    ctrl.$parsers.unshift(validateNonZero);
                    validateNonZero(ctrl.$modelValue);
                }

            }
        };
    })
    .directive('selectOnClick', function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                var focusedElement;
                element.on('focus', function() {
                    if (focusedElement != this) {
                        this.select();
                        focusedElement = this;
                    }
                });
                element.on('blur', function() {
                    focusedElement = null;
                });
            }
        };
    })
    .directive('form', function() {
        return {
            require: 'form',
            restrict: 'E',
            link: function(scope, elem, attrs, form) {
                form.$submit = function() {
                    form.$setSubmitted();
                    scope.$eval(attrs.ngSubmit);
                };
            }
        };
    })
    .directive('zloader', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/ngLoader.html'
        };
    })
    .directive('dateConverter', function() {
        return {
            priority: 1,
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attr, ngModel) {
                function toModel(value) {
                    return angular.element.formatDateTime('yy-mm-dd', value); // convert to string
                }

                function toView(value) {
                    return new Date(value); // convert to date
                }

                ngModel.$formatters.push(toView);
                ngModel.$parsers.push(toModel);
            }
        };
    })
    .directive('numberConverter', function() {
        return {
            priority: 1,
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attr, ngModel) {
                function toModel(value) {
                    return "" + value; // convert to string
                }

                function toView(value) {
                    return parseInt(value); // convert to number
                }

                ngModel.$formatters.push(toView);
                ngModel.$parsers.push(toModel);
            }
        };
    })
    .directive('showProfileAs', function() {
        return {
            priority: 1,
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.dropit({
                    action: 'mouseenter'
                });
            }
        }
    })
    .directive('dropIt', function() {
        return {
            priority: 1,
            restrict: 'EA',
            require: 'ngModel',
            scope: {
                dpChange: "&dpChange"
            },

            link: function(scope, element, attrs, ngModel) {

                var checkBox = '<i class="fa fa-check pull-right privacy-check-selected"></i>';
                element.dropit({
                    action: 'mouseenter'
                });
                var $lis = element.find('li>ul>li');
                $lis.on('click', function() {
                    var $li = angular.element(this);
                    var ngValue = $li.data('ng-value');
                    ngModel.$setViewValue(ngValue);
                    ngModel.$render();
                    if (angular.isFunction(scope.dpChange)) {
                        scope.dpChange();
                    }
                });
                ngModel.$render = function() {

                    element.dropit({
                        action: 'mouseenter'
                    });
                    element.find('.privacy-check-selected').remove();
                    var $selectedLi = element.find("li>ul>li[data-ng-value='" + ngModel.$modelValue + "']");
                    $selectedLi.find('a').append(checkBox);
                }
            }

        };
    })
    .directive('scrollToError', function() {
        return {
            restrict: 'A',
            link: function(scope, elem) {

                // set up event handler on the form element
                elem.on('submit', function() {

                    // find the first invalid element
                    var firstInvalid = elem[0].querySelector('.ng-invalid');

                    // if we find one, set focus
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                });
            }
        };
    })
    .directive('multiselectChecklist', function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/ngMultiselectChecklist.html',
            priority: 1001,
            scope: {
                itemsList: '=',
                displayProperty: '@',
                valueProperty: '@',
                selectedList: '=',
                containerHeight: '@',
            },
            controller: ['$scope', function($scope) {
                $scope.filterChecklist = function(filter) {
                    return function(item) {
                        return (item[$scope.valueProperty].toLowerCase().indexOf(filter) > -1) || (!filter) || (!filter.length);
                    }
                }
            }],
            link: function(scope, element, attrs) {}
        }
    });
