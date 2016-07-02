var Zconnected = (function ($) {
    var _DEBUG = true;
    //The following configuration is only for sublime debugging.
    var debuggerSettings = {
        ide: 1, //0 = Sublime, 1= Eclipse
        //debug configuration for sublime
        XDEBUG_SESSION_START: "XDEBUG_SESSION_START",
        //debug configuration for eclipse
        XDEBUG_SESSION_STOP_NO_EXEC: "XDEBUG_SESSION_STOP_NO_EXEC",
        XDEBUG_SESSION_KEY: "KEY"

    };
    var _baseUrl = $('base').attr('href') + 'index.php';
    //Global variables
    //Utility module
    var helpers = {
        createUrl: createUrl,
        attachParamterToUrl: attachParamterToUrl,
        isFunction: isFunction,
        showValidationError: showValidationError,
        hideValidationError: hideValidationError,
        clearAllValidationError: clearAllValidationError,
        showLoader: showLoader,
        hideLoader: hideLoader,
        animateTextChange: animateTextChange,
        hideHeader: hideHeader,
        setCustomBackground: setCustomBackground,
        removeCustomBackground: removeCustomBackground,
        toggleSidebarVisibility: toggleSidebarVisibility,
        showSystemMessage: showSystemMessage,
        ucfirst: ucfirst

    };
    return {
        init: init,
        helpers: helpers,
        apiUrl: "/api/v1",
        _DEBUG: _DEBUG,
        websiteName: "Jobsglobal"
    };

    function init() {
        if (_DEBUG) {

        }
        var $customFooter = $('.custom-footer');
        if($customFooter.length){
            var $domainName = $customFooter.find('.domain-name');
            if($domainName.length){
                if(Zconnected.websiteName == 'jobsglobal'){
                    $domainName.text(Zconnected.helpers.ucfirst('Zconnected.com'));
                }else{
                    $domainName.text(Zconnected.helpers.ucfirst('Jobsglobal.com'));

                }
            }
        }
        var $submenu = $(".sub-menu");
        if ($submenu.length == 0) {
            var $section = $("section:not([class])");
            if ($section.length)
                $section.addClass('section-without-submenu');


        }
        var $logoutMenu = $('#menu677');
        if ($logoutMenu.length) {

            $logoutMenu.on('click', function (e) {
                e.preventDefault();
                window.location.href = $('#logoutLink').attr('href');
            });
        }

        var $menuProfile = $('.zconjobs-menu-profile');
        if ($menuProfile.length) {
            $menuProfile.hide();
            $('body').on('click', 'a', function (event) {
                var $a = $(this);
                var url = $a.attr('href');
                if (url && url.charAt(0) != '#') {
                    url = attachDebuggerSettingsToUrl(url);
                    $a.attr('href', url);
                }
                /* Act on the event */
            });
        }

        var $systemMessage = $('#system-message');
        if ($systemMessage.length) {
            $('#system-message').on("DOMNodeInserted", function () {
                hideSystemMessage();
            });
            if ($('#system-message').html().length > 0) {
                hideSystemMessage();
            }

        }

        var $generalNotification = $('.hidden_modules .joms-notifications .joms-js--notiflabel-general');
        if ($generalNotification.length && $generalNotification.html() != 0) {
            var $generalNotificationMenu = $('#menu639');
            if ($generalNotificationMenu.length) {
                $generalNotificationMenu.append('<span class="badge">' + $generalNotification.html() + '</span>');
            }
        }
        var $friendNotification = $('.hidden_modules .joms-notifications .joms-js--notiflabel-frequest');
        if ($friendNotification.length && $friendNotification.html() != 0) {
            var $friendNotificationMenu = $('#menu637');
            if ($friendNotificationMenu.length) {
                $friendNotificationMenu.append('<span class="badge">' + $friendNotification.html() + '</span>');
            }
        }
        var $pmNotification = $('.hidden_modules .joms-notifications .joms-js--notiflabel-inbox');
        if ($pmNotification.length && $pmNotification.html() != 0) {
            var $pmNotificationMenu = $('#menu638');
            if ($pmNotificationMenu.length) {
                $pmNotificationMenu.append('<span class="badge">' + $pmNotification.html() + '</span>');
            }
        }

    }

    function hideSystemMessage() {
        var $this = $('#system-message');
        window.setTimeout(function () {
            $this.slideUp(1000, function () {
                $this.html('');
                $this.show();
            });
        }, 2000);
    }

    function showSystemMessage(message, type) {
        var $systemMessage = $('#system-message');
        var template = '<div class="alert alert-' + type + '"><a class="close" data-dismiss="alert" href="#">×</a>' +
            '<div>' +
            '<p class="message">' + message + '</p>' +
            '</div>' +
            '</div>';
        $systemMessage.html(template);
    }

    //Utility methods
    function setCustomBackground() {
        $('body').addClass('register_bg');
        $('.jomsocial').css({
            backgroundColor: 'transparent'
        });
    }

    function removeCustomBackground() {
        $('body').removeClass('register_bg');
        $('.jomsocial').css({
            backgroundColor: '#ecf0f1'
        });
    }

    function toggleSidebarVisibility(isVisible) {
        if (isVisible == null) {
            $("#sidebar-2").toggle('show');
        } else {
            if (isVisible) {
                $("#sidebar-2").show();
            } else {
                $("#sidebar-2").hide();
            }
        }

    }

    //
    function hideHeader() {
        //$('#main').prepend('<style type="text/css">header{display:none;}#footer{display:none;}section{padding-top:20px;}</style>');

    }

    /**
     * Function to show a loader above a given element.
     *
     * @param   {String}  selector  Selector of the element.
     *
     */
    function showLoader(selector) {
        if (!selector) {
            if (_DEBUG) {
                console.error("Please specify selector of the element to put the loader.");
            }
            return false;
        }
        //get the element
        var $element = $(selector);
        if ($element.length == 0) {
            if (_DEBUG) {
                console.error("Please specify a valid selector.");
            }
            return false;
        }
        var $existingLoader = $(selector).siblings('.spinner-wrapper');
        if ($existingLoader.length === 0) { //create the loader element
            var $loader = $('<div class="spinner-wrapper">' +
                '<div class="spinner">' +
                '<div class="bounce1"></div>' +
                '<div class="bounce2"></div>' +
                '<div class="bounce3"></div>' +
                '</div>' +
                '</div>');
            //insert the loader above the element
            $loader.insertBefore($element);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Function to hide a loader near a given element.
     * if an element selector is not provided all loader will be remove
     *
     * @param   {String}  selector  Selector of the element.
     */
    function hideLoader(selector) {
        if (selector) {
            var $loader = $(selector).siblings('.spinner-wrapper');
            $loader.fadeOut('400', function () {
                $(this).remove();
            });
        } else {
            var $loaders = $('.spinner-wrapper');
            $loaders.fadeOut('400', function () {
                $(this).remove();
            });
        }
    }

    function animateTextChange(elementSelector, text) {
        var $elementSelector = $(elementSelector);
        $elementSelector.animate({opacity: '0'}, "fast");
        $elementSelector.queue(function () {
            $elementSelector.html(text);
            $elementSelector.dequeue(); // This is necessary to continue the animation
        });
        $elementSelector.animate({opacity: '1'}, "fast");
    }

    /**
     * Function to show a validation error below an element
     *
     * @param   {String}  elementSelector  id or class of the element
     * @param   {String}  message          The message to show.
     * @param   {Boolean}  animate         If showing the message will be animated.
     *
     * @return  {Boolean}                  If showing of validation error succeeded.
     */
    function showValidationError(elementSelector, message, animate, before, autohide) {
        if (!elementSelector) {
            if (_DEBUG) {
                console.error("Selector must not be null.");
            }
            return false;
        }
        if (!message) {
            if (_DEBUG) {
                console.error("Please provide a message to show.");
            }
            return false;
        }
        //get the element
        var $element = $(elementSelector);
        if (!$element.length) {
            if (_DEBUG) {
                console.error("Please provide a valid selector.");
            }
            return false;
        }
        //detect if element already has validation error message shown
        var $error = $element.siblings(".zconnected-error[data-error-for='" + elementSelector + "']");
        if ($error.length <= 0) {
            //create an error element
            $error = $('<p class="zconnected-error text-left has-error"></p>');
            //append the error next to the element
            if (before) {
                $error.insertBefore($element);
            } else {
                $error.insertAfter($element);
            }
            //set the data-error-for attribute of element to the elementSelector for future reference
            $error.attr('data-error-for', elementSelector);
        }
        ;
        if (animate) {
            Zconnected.helpers.animateTextChange($(".zconnected-error[data-error-for='" + elementSelector + "']"), message);
        } else {
            //set the error message to the error element
            $error.text(message);
        }
        return true;
    }

    /**
     * Function to hide a specific error message
     *
     * @param   {String}  elementSelector  The id or class of the element
     * @param   {Boolean}  animate         If showing the message will be animated.
     *
     * @return  {Boolean}                   If hiding the error message succeeded.
     */
    function hideValidationError(elementSelector, animate) {
        if (!elementSelector) {
            if (_DEBUG) {
                console.err("Selector must not be null.");
                return false;
            }
        }
        //get the element
        var $error = $(".zconnected-error[data-error-for='" + elementSelector + "']");
        //check if animated
        if (animate) {
            //hide the element
            $error.fadeOut('400', function () {
                $error.remove();
            });
        } else {
            $error.remove();
        }
    }

    function clearAllValidationError(animate) {
        //get all the validation errors
        var $validationErrors = $('.zconnected-error');
        $validationErrors.each(function (index, element) {
            hideValidationError($(element).attr('data-error-for'), animate);
        });
    }

    /**
     * Helper method to create a valid joomla url.
     * TODO: Add attachment of authentication token to url.
     *
     * @param   {String}  url  The joomla url i.e. ?option=com_profile&task=profile.testMethod
     *
     * @return  {[type]}       [description]
     */
    function createUrl(url) {
        if (url) {
            url = _baseUrl + url;
            if (_DEBUG) {
                url = attachDebuggerSettingsToUrl(url);
                console.log('Created url is :', url);
                return url;
            }
        } else {
            console.error("Please specify a valid url.");
            return;
        }
    }

    /**
     * Function to detect if a given variable is a function
     *
     * @param   {any}   functionToCheck  the variable to check
     *
     * @return  {Boolean}                true if the given variable is a function, otherwise false.
     */
    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    function attachDebuggerSettingsToUrl(url) {
        var xdebugSessionStart = getUrlParameter(debuggerSettings.XDEBUG_SESSION_START);
        if (xdebugSessionStart) {
            url = attachParamterToUrl(url, debuggerSettings.XDEBUG_SESSION_START, xdebugSessionStart);
        }
        var xdebugSessionStopNoExec = getUrlParameter(debuggerSettings.XDEBUG_SESSION_STOP_NO_EXEC);
        if (xdebugSessionStopNoExec) {
            url = attachParamterToUrl(url, debuggerSettings.XDEBUG_SESSION_STOP_NO_EXEC, xdebugSessionStopNoExec);
        }
        var xdebugSessionKey = getUrlParameter(debuggerSettings.XDEBUG_SESSION_KEY);
        if (xdebugSessionKey) {
            url = attachParamterToUrl(url, debuggerSettings.XDEBUG_SESSION_KEY, xdebugSessionKey);
        }
        return url;
    }

    /**
     * Helper method to attach a parameter to url.
     *
     * @param   {String}  key    The name of the parameter
     * @param   {Any}     value  The value of the parameter
     *
     * @return  {String}         The proccessed url
     */
    function attachParamterToUrl(search, key, val) {
        var newParam = key + '=' + val,
            params = '?' + newParam;
        // If the "search" string exists, then build params from it
        if (search) {
            // Try to replace an existance instance
            params = search.replace(new RegExp('[\?&]' + key + '[^&]*'), '$1' + newParam);
            // If nothing was replaced, then add the new param to the end
            if (params === search) {
                params += '&' + newParam;
            }
        }
        return params;
    }

    function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }
    function ucfirst (str) {
        return typeof str !="undefined"  ? (str += '', str[0].toUpperCase() + str.substr(1)) : '' ;
    }
})(jQuery);
jQuery(Zconnected.init);

jQuery.fn.extend({
    getPath: function () {
        var path, node = this;
        while (node.length) {
            var realNode = node[0],
                name = realNode.localName;
            if (!name) break;
            name = name.toLowerCase();

            var parent = node.parent();

            var sameTagSiblings = parent.children(name);
            if (sameTagSiblings.length > 1) {
                allSiblings = parent.children();
                var index = allSiblings.index(realNode) + 1;
                if (index > 1) {
                    name += ':nth-child(' + index + ')';
                }
            }

            path = name + (path ? '>' + path : '');
            node = parent;
        }

        return path;
    }
});
