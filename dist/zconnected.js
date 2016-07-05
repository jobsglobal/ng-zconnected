angular.module('ngJoms', [])
    .factory('ngJoms', [function () {

        //try { joms }
        //catch (error) {
        //    throw new Error('joms.js not loaded.');
        //}
        return joms;
    }]);
angular.module('ngZconnected.api', ['ngResource', 'ngCookies', 'ngFileUpload', 'ngZconnected'])
    .config(['$httpProvider', 'authenticationInterceptorProvider', function($httpProvider, authenticationInterceptorProvider) {
        $httpProvider.interceptors.push('authenticationInterceptor');
        authenticationInterceptorProvider.error(function() {

            $logoutElement = angular.element('#logoutLink');
            if ($logoutElement.length > 0) {
                window.location.href = $logoutElement.attr('href');
            }
        });

    }])
    .factory('resourceService', ['$resource', 'ngZconnected', '$q', '$http', function($resource, ngZconnected, $q, $http) {
        var apiRoot = ngZconnected.apiUrl;
        var api = {
            countryList: {
                api: $resource(apiRoot + '/country'),

                get: function() {
                    return this.api.query().$promise;
                }
            },
            stateList: {
                api: $resource(apiRoot + '/country/:countryid/state'),

                get: function(countryid) {
                    return this.api.query({ countryid: countryid }).$promise;
                }
            },
            cityList: {
                api: $resource(apiRoot + '/country/:countryid/state/:stateid/city'),

                get: function(countryid, stateid) {
                    return this.api.query({ countryid: countryid, stateid: stateid }).$promise;
                }
            },
            industryList: {
                api: $resource(apiRoot + '/industry'),

                get: function() {
                    return this.api.query().$promise;
                }
            },
            contactTypeList: {
                api: $resource(apiRoot + '/contactType'),

                get: function() {
                    return this.api.query().$promise;
                }
            },
            imTypeList: {
                api: $resource(apiRoot + '/imType'),

                get: function() {
                    return this.api.query().$promise;
                }
            },
            recommendationTemplateList: {
                api: $resource(apiRoot + '/testimonialRelationship'),

                get: function() {
                    return this.api.query().$promise;
                }
            },
            languageProficiencyList: {
                api: $resource(apiRoot + '/language/proficiency'),

                get: function() {
                    return this.api.query().$promise;
                }
            },
            languageList: {
                api: $resource(apiRoot + '/language'),

                get: function() {
                    return this.api.query().$promise;
                }
            },
            currencyList: {
                api: $resource(apiRoot + '/currency'),
                get: function() {
                    return this.api.query().$promise;
                }
            },
            uniqId: {
                api: $resource(apiRoot + '/uniqid'),

                get: function() {
                    return this.api.get().$promise;
                }
            },
            companyTypeList: {
                get: function() {
                    var deferred = $q.defer();
                    $http.get(Zconnected.apiUrl + '/company/type').success(function(resp) {
                        deferred.resolve(resp);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                }

            },
            companyStatusList: {
                get: function() {
                    var deferred = $q.defer();
                    $http.get(Zconnected.apiUrl + '/company/status').success(function(resp) {
                        deferred.resolve(resp);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                }
            },
            companySizeList: {
                get: function() {
                    var deferred = $q.defer();
                    $http.get(apiRoot + '/company/size').success(function(resp) {
                        deferred.resolve(resp);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                }
            },
            adList: function() {
                var deferred = $q.defer();
                $http.jsonp(apiRoot + '/ads?callback=JSON_CALLBACK').then(function(resp) {
                    deferred.resolve(resp.data);
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            modules: {
                getAll: getModules = function() {
                    var deferred = $q.defer();
                    $http.jsonp(apiRoot + '/module?callback=JSON_CALLBACK').then(function(resp) {
                        deferred.resolve(resp.data.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                getByName: function(moduleName) {
                    var deferred = $q.defer();
                    $http.get(apiRoot + '/module?name=' + moduleName, {
                        headers: {
                            "Content-Type": 'text/html'
                        }
                    }).then(function(resp) {
                        deferred.resolve((resp.data.data) ? resp.data.data : resp.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
            }
        };

        return api;
    }])
    .factory('companyService', ['$resource', '$http', '$q', 'Upload', 'ngZconnected', function($resource, $http, $q, Upload, ngZconnected) {
        'use strict';

        // Detect if an API backend is present. If so, return the API module, else
        // hand off the localStorage adapter
        'use strict';
        var apiRoot = ngZconnected.apiUrl;
        var store = {
            company: {
                api: $resource(apiRoot + '/employer/:id/company/:companyid', {}, {
                    update: {
                        method: 'PUT'
                    },
                    getBranch: {
                        method: 'GET',
                        url: apiRoot + '/employer/:id/company/:companyid/branch'
                    }
                }),

                get: function(id, companyid) {
                    return this.api.get({ id: id, companyid: companyid }).$promise;
                },
                query: function(id) {
                    return this.api.query({ id: id }).$promise;
                },
                save: function(id, company) {
                    return this.api.save({ id: id }, company).$promise;
                },
                update: function(id, company) {
                    return this.api.update({ id: id, companyid: company.id }, company).$promise;
                },
                remove: function(id, company) {
                    return this.api.remove({ id: id, companyid: company.id }).$promise;
                },
                activate: function(jwt) {
                    var deferred = $q.defer();
                    $http.post(apiRoot + '/company/activate', { jwt: jwt })
                        .success(function(resp) {
                            deferred.resolve(resp);
                        })
                        .error(function(error) {
                            deferred.reject(error);
                        });
                    return deferred.promise;
                },
                uploadPhoto: function(id, companyid, file, type) {
                    var data = {};
                    data[type] = file;
                    return Upload.upload({
                        url: apiRoot + '/employer/' + id + '/company/' + companyid + '/upload/' + type,
                        data: data,
                    });
                },
                getBranch: function() {

                },
                getTimelineHtml: function(userId, companyId) {
                    var deferred = $q.defer();
                    $http.jsonp(apiRoot + '/employer/' + userId + '/company/' + companyId + '/activities?callback=JSON_CALLBACK').then(function(resp) {
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                }
            },
            job: {

                getJobGeneralStats: function(userId, companyId) {
                    var deferred = $q.defer();
                    $http.jsonp(apiRoot + '/employer/' + userId + '/company/' + companyId + '/job/stats?callback=JSON_CALLBACK').then(function(resp) {
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                getApplicantGeneralStats: function(userId, companyId) {
                    var deferred = $q.defer();
                    $http.jsonp(apiRoot + '/employer/' + userId + '/company/' + companyId + '/applicant/stats?callback=JSON_CALLBACK').then(function(resp) {
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                }
            }

        };

        return store;
    }])
    .factory('profileService', ['$resource', '$q', '$http', 'ngZconnected', '$sce', function($resource, $q, $http, ngZconnected, $sce) {
        'use strict';

        // Detect if an API backend is present. If so, return the API module, else
        // hand off the localStorage adapter
        'use strict';
        var apiRoot = ngZconnected.apiUrl;
        var store = {
            cv: {
                profile: {
                    api: $resource(apiRoot + '/jobseeker/:userId/cv'),
                    get: function(userId) {
                        return this.api.get({ userId: userId }).$promise;
                    }
                },
                original: {
                    html: function(userId) {
                        return $http({
                            method: 'GET',
                            url: apiRoot + '/jobseeker/' + userId + '/cv/original.html'
                        });
                    },
                    pdf: function(userId) {
                        return $http({
                            method: 'GET',
                            url: apiRoot + '/jobseeker/' + userId + '/cv/original.pdf',
                            transformResponse: function(response) {
                                return response;
                            }
                        });

                    },
                    link: function(userId) {
                        return $http({
                            method: 'GET',
                            url: apiRoot + '/jobseeker/' + userId + '/cv/original.link',
                            transformResponse: function(response) {
                                var json = JSON.parse(response);
                                return $sce.trustAsResourceUrl(json.data);
                            }
                        });

                    }
                }
            },
            userInfo: {
                api: $resource(apiRoot + '/user/:id', { id: '@user_id' }, { update: { method: 'PUT' } }),

                get: function(id) {
                    return this.api.get({ id: id }).$promise;
                },

                update: function(userInfo) {
                    return this.api.update({ id: userInfo.user_id }, userInfo)
                        .$promise;
                },
                profileView: function(id) {
                    var deferred = $q.defer();
                    $http.post(apiRoot + '/user/' + id + '/profileView', {})
                        .success(function(resp) {
                            deferred.resolve(resp);
                        })
                        .error(function(error) {
                            deferred.reject(error);
                        });
                    return deferred.promise;
                }
            },
            profileViews: function(id, page) {
                return $resource(Zconnected.apiUrl + '/user/:id/profileView?limit=1&page=:page').get({
                    id: id,
                    page: page
                }).$promise;
            },
            jobseekerInfo: {
                api: $resource(apiRoot + '/jobseeker/:id', { id: '@id' }, {
                    update: {
                        method: 'PUT'
                    },
                    getJobseekerId: {
                        method: 'GET',
                        url: apiRoot + '/jobseeker/:id/jobseekerid'
                    }
                }),

                get: function(id) {
                    return this.api.get({ id: id }).$promise;
                },

                update: function(id, jobseekerInfo) {
                    return this.api.update({ id: id }, jobseekerInfo)
                        .$promise;
                },
                getJobseekerId: function(id) {
                    return this.api.getJobseekerId({ id: id }).$promise;
                }
            },
            userContactNumber: {
                api: $resource(apiRoot + '/user/:id/contact/:contactid', null, { update: { method: 'PUT' } }),

                get: function(id, contactid) {
                    return this.api.get({ id: id, contactid: contactid }).$promise;
                },
                query: function(id) {
                    return this.api.query({ id: id }).$promise;
                },
                update: function(id, userContactNumber) {
                    return this.api.update({ id: id, contactid: userContactNumber.id }, userContactNumber)
                        .$promise;
                },

                save: function(id, userContactNumber) {
                    return this.api.save({ id: id }, userContactNumber)
                        .$promise;
                },
                remove: function(id, contactNumberId) {
                    return this.api.remove({ id: id, contactid: contactNumberId }).$promise;
                }
            },
            userEmail: {
                api: $resource(apiRoot + '/user/:id/email/:emailid', null, { update: { method: 'PUT' } }),

                get: function(id, emailid) {
                    return this.api.get({ id: id, emailid: emailid }).$promise;
                },
                query: function(id) {
                    return this.api.query({ id: id }).$promise;
                },
                update: function(id, userEmail) {
                    return this.api.update({ id: id, emailid: userEmail.id }, userEmail)
                        .$promise;
                },

                save: function(id, userEmail) {
                    return this.api.save({ id: id }, userEmail)
                        .$promise;
                },
                remove: function(id, emailid) {
                    return this.api.remove({ id: id, emailid: emailid }).$promise;
                }
            },
            userAddress: {
                api: $resource(apiRoot + '/user/:id/address/:addressid', null, { update: { method: 'PUT' } }),

                get: function(id, addressid) {
                    return this.api.get({ id: id, addressid: addressid }).$promise;
                },
                query: function(id) {
                    return this.api.query({ id: id }).$promise;
                },
                update: function(id, userAddress) {
                    return this.api.update({ id: id, addressid: userAddress.id }, userAddress)
                        .$promise;
                },

                save: function(id, userAddress) {
                    return this.api.save({ id: id }, userAddress)
                        .$promise;
                }
            },
            jobseekerExperience: {
                api: $resource(apiRoot + '/jobseeker/:id/experience/:expid', null, { update: { method: 'PUT' } }),

                get: function(id, expid) {
                    return this.api.get({ id: id, expid: expid }).$promise;
                },
                query: function(id) {
                    return this.api.query({ id: id }).$promise;
                },
                update: function(id, jobseekerExperience) {
                    return this.api.update({ id: id, expid: jobseekerExperience.id }, jobseekerExperience)
                        .$promise;
                },
                save: function(id, jobseekerExperience) {
                    return this.api.save({ id: id }, jobseekerExperience)
                        .$promise;
                },
                remove: function(id, expid) {
                    return this.api.remove({ id: id, expid: expid }).$promise;
                }
            },
            jobseekerIm: {
                api: $resource(apiRoot + '/jobseeker/:id/im/:imid', null, { update: { method: 'PUT' } }),

                get: function(id, imid) {
                    return this.api.get({ id: id, imid: imid }).$promise;
                },
                query: function(id) {
                    return this.api.query({ id: id }).$promise;
                },
                update: function(id, jobseekerIm) {
                    return this.api.update({ id: id, imid: jobseekerIm.id }, jobseekerIm)
                        .$promise;
                },

                save: function(id, jobseekerIm) {
                    return this.api.save({ id: id }, jobseekerIm)
                        .$promise;
                },
                remove: function(id, imid) {
                    return this.api.remove({ id: id, imid: imid }).$promise;
                }
            },
            jobseekerSkill: {
                api: $resource(apiRoot + '/jobseeker/:id/skill/:skillid', null, { update: { method: 'PUT' } }),

                get: function(id, skillId) {
                    return this.api.get({ id: id, skillid: skillId }).$promise;
                },
                query: function(id) {
                    return this.api.query({ id: id }).$promise;
                },
                update: function(id, jobseekerSkill) {
                    return this.api.update({ id: id, skillid: jobseekerSkill.id }, jobseekerSkill)
                        .$promise;
                },
                save: function(id, jobseekerSkill) {
                    return this.api.save({ id: id }, jobseekerSkill)
                        .$promise;
                },
                remove: function(id, skillId) {
                    return this.api.remove({ id: id, skillid: skillId }).$promise;
                }
            },
            jobseekerSkillEndorsement: {
                api: $resource(apiRoot + '/jobseeker/:id/skill/:skillid/endorsement', null),

                query: function(id, skillid) {
                    return this.api.query({ id: id, skillid: skillid }).$promise;
                },
                toggle: function(id, skillId) {
                    return $resource(apiRoot + '/jobseeker/:id/skill/:skillid/endorsement/toggle').save({
                        id: id,
                        skillid: skillId
                    }, {}).$promise;
                }
            },
            jobseekerEducation: {
                api: $resource(apiRoot + '/jobseeker/:id/education/:educid', null, { update: { method: 'PUT' } }),

                get: function(id, educid) {
                    return this.api.get({ id: id, educid: educid }).$promise;
                },
                query: function(id) {
                    return this.api.query({ id: id }).$promise;
                },
                update: function(id, jobseekerEducation) {
                    return this.api.update({ id: id, educid: jobseekerEducation.id }, jobseekerEducation)
                        .$promise;
                },
                save: function(id, jobseekerEducation) {
                    return this.api.save({ id: id }, jobseekerEducation)
                        .$promise;
                },
                remove: function(id, educid) {
                    return this.api.remove({ id: id, educid: educid }).$promise;
                }
            },
            jobseekerRecommendation: {
                api: $resource(apiRoot + '/jobseeker/:id/testimonial/:testimonialid', null, { update: { method: 'PUT' } }),

                actions: $resource(apiRoot + '/jobseeker/:id/testimonial/:testimonialid/:action', null, { update: { method: 'PUT' } }),

                get: function(id, testimonialid) {
                    return this.api.get({ id: id, testimonialid: testimonialid }).$promise;
                },
                query: function(id) {
                    return this.api.query({ id: id }).$promise;
                },
                update: function(id, jobseekerRecommendation) {
                    return this.api.update({ id: id, testimonialid: jobseekerRecommendation.id }, jobseekerRecommendation)
                        .$promise;
                },
                save: function(id, jobseekerRecommendation) {
                    if (jobseekerRecommendation.id) {
                        return this.update(id, jobseekerRecommendation);
                    } else {
                        return this.api.save({ id: id }, jobseekerRecommendation)
                            .$promise;
                    }
                },
                remove: function(id, testimonialid) {
                    return this.api.remove({ id: id, testimonialid: testimonialid }).$promise;
                },
                action: function(id, testimonial, action) {
                    return this.actions.update({
                        id: id,
                        testimonialid: testimonial.id,
                        action: action
                    }, testimonial).$promise;
                }
            },
            jobseekerLanguage: {
                api: $resource(apiRoot + '/jobseeker/:id/language/:langid', null, { update: { method: 'PUT' } }),

                get: function(id, langid) {
                    return this.api.get({ id: id, langid: langid }).$promise;
                },
                query: function(id) {
                    return this.api.query({ id: id }).$promise;
                },
                update: function(id, language) {
                    return this.api.update({ id: id, langid: language.id }, language)
                        .$promise;
                },
                save: function(id, language) {
                    return this.api.save({ id: id }, language)
                        .$promise;
                },
                remove: function(id, langid) {
                    return this.api.remove({ id: id, langid: langid }).$promise;
                }
            },
            profileStrength: {
                api: $resource(apiRoot + "/user/:id/profileStrength"),
                get: function($id) {
                    return this.api.get({ id: $id }).$promise;
                }

            },
            followee: {
                company: {
                    api: $resource(apiRoot + "/jobseeker/:id/followee/company", {}, {
                        query: {
                            method: 'GET',
                            isArray: false
                        }
                    }),
                    get: function(id) {
                        return this.api.query({ id: id }).$promise;
                    }
                }
            }
        };

        return store;
    }])
    .factory('registrationService', ['$http', '$resource', function($http, $resource) {
        'use strict';
        var store = {};

        return store;
    }])
    .service('employerService', ['$resource', 'ngZconnected', '$http', '$q', function employerService($resource, ngZconnected, $http, $q) {
        var self = this;
        var apiRoot = ngZconnected.apiUrl;
        self.api = $resource(apiRoot + '/employer/:userId', null, { getByJobseekerId: { method: 'GET' } });
        self.getEmployerProfile = function(userId) {
            return self.api.get({ userId: userId }).$promise;
        };
        self.updateEmployerProfile = function(userId, employerProfile) {
            return self.api.update({ userId: userId }, employerProfile).$promise;
        };
        self.jobseekerScreening = {
            api: $resource(apiRoot + '/employer/:userId/company/:companyId/screenedJobseeker/:screenedJobseekerId', {
                screenedJobseekerId: '@id'
            }, {
                update: {
                    method: "PUT"
                },
                query: {
                    method: 'GET',
                    isArray: false
                },
                getByJobseekerId: {
                    method: 'GET',
                    url: apiRoot + '/employer/:userId/company/:companyId/screenedJobseeker/byJobseekerId/:jobseekerId'
                }
            }),
            get: function(userId, companyId, screenedJobseekerId) {
                return this.api.get({
                    userId: userId,
                    companyId: companyId,
                    screenedJobseekerId: screenedJobseekerId
                }).$promise;
            },
            query: function(userId, companyId) {
                return this.api.query({ userId: userId, companyId: companyId }).$promise;
            },
            save: function(userId, companyId, screenedJobseekerData) {
                if (screenedJobseekerData.hasOwnProperty('id')) {
                    return this.api.update({ userId: userId, companyId: companyId }, screenedJobseekerData).$promise;

                } else {
                    return this.api.save({ userId: userId, companyId: companyId }, screenedJobseekerData).$promise;
                }
            },
            remove: function(userId, companyId, screenedJobseekerData) {
                return this.api.remove({ userId: userId, companyId: companyId }, screenedJobseekerData).$promise;
            },
            getByJobseekerId: function(userId, companyId, jobseekerId) {
                //var resource = $resource(apiRoot + '/employer/:userId/company/:companyId/screenedJobseeker/byJobseekerId/:jobseekerId');
                return this.api.getByJobseekerId({
                    userId: userId,
                    companyId: companyId,
                    jobseekerId: jobseekerId
                }).$promise;
            }
        };
        self.shortlist = {
            api: $resource(apiRoot + '/employer/:userId/company/:companyId/shortlist/:shortlistId', { shortlistId: '@id' }, {
                update: {
                    method: 'PUT'
                },
                getChildren: {
                    method: 'GET',
                    url: apiRoot + '/employer/:userId/company/:companyId/shortlist/:shortlistId/child'
                },
                query: {
                    method: 'GET',
                    isArray: false
                },
                getUserFolder: {
                    method: 'GET',
                    url: apiRoot + '/employer/:userId/company/:companyId/shortlist/:shortlistId/userFolder'

                },
                getByJobseekerId: {
                    method: 'GET',
                    url: apiRoot + '/employer/:userId/company/:companyId/shortlistByJobseekerId/:jobseekerId'
                }
            }),
            get: function(userId, companyId, shortlistId) {
                return this.api.get({
                    userId: userId,
                    companyId: companyId,
                    shortlistId: shortlistId
                }).$promise;
            },
            query: function(userId, companyId) {
                return this.api.query({
                    userId: userId,
                    companyId: companyId
                }).$promise;
            },
            save: function(userId, companyId, shortlistNode) {
                if (shortlistNode.hasOwnProperty('id')) {
                    return this.api.update({
                        userId: userId,
                        companyId: companyId
                    }, shortlistNode).$promise;
                } else {
                    return this.api.save({
                        userId: userId,
                        companyId: companyId
                    }, shortlistNode).$promise;
                }
            },
            remove: function(userId, companyId, shortlistId) {
                return this.api.remove({
                    userId: userId,
                    companyId: companyId,
                    shortlistId: shortlistId
                }).$promise;
            },
            getChildren: function(userId, companyId, shortlistId) {
                return this.api.getChildren({
                    userId: userId,
                    companyId: companyId,
                    shortlistId: shortlistId
                }).$promise;
            },
            getUserFolder: function(userId, companyId, shortlistId) {
                return this.api.getUserFolder({
                    userId: userId,
                    companyId: companyId,
                    shortlistId: shortlistId
                }).$promise;
            },
            getByJobseekerId: function(userId, companyId, jobseekerId) {
                return this.api.getByJobseekerId({
                    userId: userId,
                    companyId: companyId,
                    jobseekerId: jobseekerId
                }).$promise;
            }
        };
        self.employee = {
            api: $resource(apiRoot + '/employer/:userId/company/:companyId/employee/:employeeId', { employeeId: '@id' }, {
                update: {
                    method: 'PUT'
                },
                query: {
                    method: 'GET',
                    isArray: false,
                    url: apiRoot + '/employer/:userId/company/:companyId/employee?qname=:qname&limit=:limit&page=:page'
                },
                sendInvite: {
                    method: 'POST',
                    url: apiRoot + '/employer/:userId/company/:companyId/employee/invite'
                }

            }),
            get: function(userId, companyId, employeeId) {
                return this.api.get({ userId: userId, companyId: companyId, employeeId: employeeId }).$promise;
            },
            query: function(userId, companyId, limit, page, qname) {
                limit = limit || 0;
                page = page || 0;
                return this.api.query({
                    userId: userId,
                    companyId: companyId,
                    page: page,
                    limit: limit,
                    qname: qname
                }).$promise;
            },
            save: function(userId, companyId, employee) {
                if (employee.hasOwnProperty('id')) {
                    return this.api.update({ userId: userId, companyId: companyId }, employee).$promise;
                } else {
                    return this.api.save({ userId: userId, companId: companyId }, employee).$promise;
                }
            },
            remove: function(userId, companyId, employeeId) {
                return this.api.remove({
                    userId: userId,
                    companyId: companyId,
                    employeeId: employeeId
                }).$promise;
            },
            sendInvite: function(userId, companyId, employeeId) {
                return this.api.sendInvite({ userId: userId, companyId: companyId }, { employee_id: employeeId }).$promise;
            }
        };
        self.emailCv = {
            api: $resource(apiRoot + "/employer/:userId/emailCv", null, {
                sendCv: {
                    method: "POST"
                }
            }),

            sendCv: function(userId, requestData) {
                return this.api.sendCv({ userId: userId }, requestData).$promise;
            }
        };
        self.jobGroup = {
            api: $resource(apiRoot + '/employer/:userId/company/:companyId/jobgroup/:jobgroupId', { jobgroupId: '@id' }, {
                update: {
                    method: 'PUT'
                }
            }),
            get: function(userId, companyId, jobgroupId) {
                return this.api.get({ userId: userId, companyId: companyId, jobgroupId: jobgroupId }).$promise;
            },
            save: function(userId, companyId, jobgroup) {
                if (jobgroup.hasOwnProperty('id')) {
                    return this.api.update({ userId: userId, companyId: companyId }, jobgroup).$promise;
                } else {
                    return this.api.save({ userId: userId, companyId: companyId }, jobgroup).$promise;
                }
            },
            remove: function(userId, companyId, jobgroupId) {
                return this.api.remove({ userId: userId, companyId: companyId, jobgroupId: jobgroupId }).$promise;
            }
        };
        self.cv = {
            baseUrl: apiRoot + '/employer/:userId/company/:companyId/cv/:cvId',
            api: $resource(this.baseUrl, { cvId: '@id' }, {}),
            search: function(userId, companyId, searchCriterias, limit, page) {
                var url = apiRoot + '/employer/' + userId + '/company/' + companyId + '/cv/search?limit=' + limit + '&page=' + page;

                var str = [];

                for (var p in searchCriterias) {
                    if (searchCriterias.hasOwnProperty(p)) {
                        if (searchCriterias[p])
                            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(searchCriterias[p]));
                    }
                }
                url += '&' + str.join("&");
                if (ngZconnected._DEBUG)
                    console.log(url);
                var deferred = $q.defer();
                $http({
                        method: 'GET',
                        url: url,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                    .then(function(resp) {
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            parseCv: function(fileToUpload) {
                var deferred = $q.defer();
                $http({
                        method: 'POST',
                        url: apiRoot + '/cv/parse',
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        data: {
                            fileToUpload: fileToUpload
                        },
                        transformRequest: function(data, headersGetter) {
                            var formData = new FormData();
                            angular.forEach(data, function(value, key) {
                                formData.append(key, value);
                            });

                            var headers = headersGetter();
                            delete headers['Content-Type'];

                            return formData;
                        }

                    })
                    .success(function(resp) {
                        deferred.resolve(resp.data);
                    })
                    .error(function(error) {
                        deferred.rejectd(error);
                    });
                return deferred.$promise;
            }
        };
    }])
    .service('smsService', ['$resource', 'ngZconnected', function($resource, ngZconnected) {
        var self = this;
        var apiRoot = ngZconnected.apiUrl;
        self.api = $resource(apiRoot + '/employer/:userId/sendsms', null, { send: { method: 'POST' } });
        self.sendSms = function(userId, data) {
            return self.api.send({ userId: userId }, data).$promise;
        }
    }])
    .factory('statsService', ['$http', '$q', 'ngZconnected', function statsService($http, $q, ngZconnected) {
        var apiRoot = ngZconnected.apiUrl;
        return {
            followers: {
                get: function(userId, companyId) {
                    var deferred = $q.defer();
                    $http.get(apiRoot + '/employer/' + userId + '/company/' + companyId + '/followers').then(function(resp) {
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                }
            },
            jobs: {
                count: function(userId, companyId) {
                    var deferred = $q.defer();

                    $http.get(apiRoot + '/employer/' + userId + '/company/' + companyId + '/job/count').then(function(resp) {
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;

                }
            },
            applicants: {
                count: function(userId, companyId) {
                    var deferred = $q.defer();

                    $http.get(apiRoot + '/employer/' + userId + '/company/' + companyId + '/applicant/count').then(function(resp) {
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                stats: function(userId, companyId) {
                    var deferred = $q.defer();

                    $http.get(apiRoot + '/employer/' + userId + '/company/' + companyId + '/applicant/stats').then(function(resp) {
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                }
            },
            members: {
                count: function(userId, companyId) {
                    var deferred = $q.defer();

                    $http.get(apiRoot + '/employer/' + userId + '/company/' + companyId + '/member/count').then(function(resp) {
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;

                }
            }
        };
    }])
    .factory('jobService', ['$resource', '$http', '$q', 'Upload', 'ngZconnected', function($resource, $http, $q, Upload, ngZconnected) {
        var apiRoot = ngZconnected.apiUrl;
        return {
            api: $resource(apiRoot + "/employer/:id/company/:companyid/job/:jobid"),
            save: function(id, companyid, job) {
                return $resource(apiRoot + "/employer/:id/company/:companyid/job?social=1").save({
                    id: id,
                    companyid: companyid
                }, job).$promise;
            },
            get: function(id, companyid, jobid) {
                return this.api.get({ id: id, companyid: companyid, jobid: jobid }).$promise;
            },
            uploadPhoto: function(id, companyid, jobid, file) {
                var data = {};
                data.photo = file;
                return Upload.upload({
                    url: apiRoot + '/employer/' + id + '/company/' + companyid + '/job/' + jobid + '/upload',
                    data: data
                });
            },
            getMostApplied: function(userId, companyId, $limit, $from, $to) {
                var deferred = $q.defer();
                var url = apiRoot + '/employer/' + userId + '/company/' + companyId + '/job/listWithApplicants?callback=JSON_CALLBACK';
                if ($limit)
                    url += '&limit=' + $limit;
                $http.jsonp(url).then(function(resp) {
                    deferred.resolve(resp.data);
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            applicants: {
                api: $resource(apiRoot + "/employer/:id/company/:companyid/job/:jobid/applicants?limit=:limit&page=:page", {}, {
                    query: {
                        method: 'GET',
                        isArray: false
                    }
                }),
                get: function(id, companyid, jobid, limit, page) {
                    return this.api.query({
                        id: id,
                        companyid: companyid,
                        jobid: jobid,
                        limit: limit,
                        page: page
                    }).$promise;
                },
                getStats: function(userId, companyId) {
                    var deferred = $q.defer();
                    $http.jsonp(apiRoot + '/employer/' + userId + '/company/' + companyId + '/applicant/stats?callback=JSON_CALLBACK').then(function(resp) {
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },

                getCount: function(userId, companyId) {
                    var deferred = $q.defer();
                    $http.jsonp(apiRoot + '/employer/' + userId + '/company/' + companyId + '/applicant/count?callback=JSON_CALLBACK').then(function(resp) {
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                }
            },
            user: {
                getApplied: function(userId, limit, page) {
                    limit = limit || 10;
                    page = page || 1;
                    var deferred = $q.defer();
                    var url = apiRoot + '/jobseeker/' + userId + '/job/applied?limit=' + limit + '&page=' + page;
                    $http.get(url)
                        .then(function(resp) {
                            deferred.resolve(resp.data);
                        }, function(error) {
                            deferred.reject(error.data);
                        })
                    return deferred.promise;
                }
            }
        };
    }])
    .factory('userService', ['$http', '$q', '$window', 'ngZconnected', function($http, $q, $window, ngZconnected) {
        var apiRoot = ngZconnected.apiUrl;
        return {
            getCurrentUser: function() {
                var deferred = $q.defer();
                // var currentUser = angular.fromJson($window.localStorage['currentUser']);
                // if (!currentUser) {
                $http.get(apiRoot + '/user/current', { cache: true })
                    .then(function(resp) {
                        // $window.localStorage['currentUser'] = angular.toJson(resp.data);
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error.data);
                    });
                // } else {
                //     deferred.resolve(currentUser);
                // }
                return deferred.promise;
            },
            getCurrentUserFriends: function() {
                var deferred = $q.defer();
                $http.get(apiRoot + '/user/current/friends')
                    .then(function(resp) {
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error.data);
                    });
                return deferred.promise;
            },
            getCurrentUserSuggestedUsers: function(limit, page) {
                var deferred = $q.defer();
                $http.get(apiRoot + '/user/current/suggestedUsers?limit=' + limit + 'page=' + page)
                    .then(function(resp) {
                        deferred.resolve(resp.data);
                    }, function(error) {
                        deferred.reject(error.data);
                    });
                return deferred.promise;
            }
        };
    }])
    .provider('authenticationInterceptor', [function() {
        var self = this;
        var errorCallbacks = [],
            successCallbacks = [];
        self.error = function(callback) {
            errorCallbacks.push(callback);
        };

        self.success = function(callback) {
            successCallbacks.push(callback);
        };
        self.$get = ['tokenService', '$injector', function(tokenService, $injector) {
            return {
                request: function(config) {
                    if (!config.excludeFromInterceptor) {
                        var token = tokenService.getToken();
                        if (token && tokenService.isAuthed()) {
                            config.headers['Authorization'] = "Bearer " + token;
                            for (var x = 0; x < successCallbacks.length; x++) {
                                var success = successCallbacks[x];
                                if (Object.prototype.toString.call(success) === "[object Function]" || Object.prototype.toString.call(success) === "[object Array]") {
                                    $injector.invoke(success);
                                }
                            }

                        } else {
                            for (var x = 0; x < errorCallbacks.length; x++) {
                                var error = errorCallbacks[x];

                                if (Object.prototype.toString.call(error) === "[object Function]" || Object.prototype.toString.call(error) === "[object Array]") {
                                    $injector.invoke(error);
                                }
                            }

                        }
                    }
                    return config;
                }
            };
        }];
        return self;
    }])
    .service('authenticationService', ['tokenService', 'ngZconnected', '$http', '$q', function(tokenService, ngZconnected, $http, $q) {
        var self = this;
        var apiRoot = ngZconnected.apiUrl;
        self.logout = function() {
            var deferred = $q.defer();
            $http({
                    method: 'GET',
                    url: apiRoot + '/logout'

                })
                .then(function(resp) {
                    tokenService.removeToken();
                    deferred.resolve(resp.data);
                }, function(error) {
                    deferred.reject(error.data);
                });
            return deferred.promise;
        };
        self.login = function(credentials) {
            var deferred = $q.defer();
            $http({
                    method: 'POST',
                    url: apiRoot + '/login',
                    data: credentials,
                    excludeFromInterceptor: true
                })
                .then(function(resp) {
                    if (resp.data && resp.data.data && resp.data.data.token) {
                        tokenService.setToken(resp.data.data.token);
                    }
                    deferred.resolve(resp.data);
                }, function(error) {
                    deferred.reject(error.data);
                });
            return deferred.promise;
        };
    }])
    .service('tokenService', ['$cookies', '$window', function($cookies, $window) {
        var self = this;
        self.parseJwt = function(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        };
        self.getToken = function() {
            return $cookies.get('token');
        };
        self.removeToken = function() {
            return $cookies.remove('token');
        };
        self.setToken = function(token) {
            $cookies.put('token', token);
        };
        self.isAuthed = function() {
            var token = self.getToken();
            if (token) {
                var params = self.parseJwt(token);
                return Math.round(new Date().getTime() / 1000) <= params.exp;
            } else {
                return false;
            }
        };
    }]);

angular.module('ngZconnected', ['ngZconnected.api', 'ngZconnected.templates'])
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
        }
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
    });

var Zconnected = (function($) {
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
        if ($customFooter.length) {
            var $domainName = $customFooter.find('.domain-name');
            if ($domainName.length) {
                if (Zconnected.websiteName == 'jobsglobal') {
                    $domainName.text(Zconnected.helpers.ucfirst('Zconnected.com'));
                } else {
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

            $logoutMenu.on('click', function(e) {
                e.preventDefault();
                window.location.href = $('#logoutLink').attr('href');
            });
        }

        var $menuProfile = $('.zconjobs-menu-profile');
        if ($menuProfile.length) {
            $menuProfile.hide();
            $('body').on('click', 'a', function(event) {
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
            $('#system-message').on("DOMNodeInserted", function() {
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
        window.setTimeout(function() {
            $this.slideUp(1000, function() {
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
    function setCustomBackground(customClass) {
        customClass = customClass || 'register_bg';
        $('body').addClass(customClass);
        $('.jomsocial').css({
            backgroundColor: 'transparent'
        });
    }

    function removeCustomBackground(customClass) {
        customClass = customClass || 'register_bg';
        $('body').removeClass(customClass);
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
            $loader.fadeOut('400', function() {
                $(this).remove();
            });
        } else {
            var $loaders = $('.spinner-wrapper');
            $loaders.fadeOut('400', function() {
                $(this).remove();
            });
        }
    }

    function animateTextChange(elementSelector, text) {
        var $elementSelector = $(elementSelector);
        $elementSelector.animate({ opacity: '0' }, "fast");
        $elementSelector.queue(function() {
            $elementSelector.html(text);
            $elementSelector.dequeue(); // This is necessary to continue the animation
        });
        $elementSelector.animate({ opacity: '1' }, "fast");
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
            $error.fadeOut('400', function() {
                $error.remove();
            });
        } else {
            $error.remove();
        }
    }

    function clearAllValidationError(animate) {
        //get all the validation errors
        var $validationErrors = $('.zconnected-error');
        $validationErrors.each(function(index, element) {
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

    function ucfirst(str) {
        return typeof str != "undefined" ? (str += '', str[0].toUpperCase() + str.substr(1)) : '';
    }
})(jQuery);
jQuery(Zconnected.init);

jQuery.fn.extend({
    getPath: function() {
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

angular.module("ngZconnected.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/templates/ngLoader.html","<div class=\"zloader\">\n    <div class=\"sk-circle\">\n        <div class=\"sk-circle1 sk-child\"></div>\n        <div class=\"sk-circle2 sk-child\"></div>\n        <div class=\"sk-circle3 sk-child\"></div>\n        <div class=\"sk-circle4 sk-child\"></div>\n        <div class=\"sk-circle5 sk-child\"></div>\n        <div class=\"sk-circle6 sk-child\"></div>\n        <div class=\"sk-circle7 sk-child\"></div>\n        <div class=\"sk-circle8 sk-child\"></div>\n        <div class=\"sk-circle9 sk-child\"></div>\n        <div class=\"sk-circle10 sk-child\"></div>\n        <div class=\"sk-circle11 sk-child\"></div>\n        <div class=\"sk-circle12 sk-child\"></div>\n    </div>\n</div>\n");
$templateCache.put("/templates/ngPagination.html","<ul class=\"pagination\">\n    <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-first\"><a href ng-click=\"selectPage(1, $event)\">{{::getText(\'first\')}}</a></li>\n    <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-prev\"><a href ng-click=\"selectPage(page - 1, $event)\">{{::getText(\'previous\')}}</a></li>\n    <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active,disabled: ngDisabled&&!page.active}\" class=\"pagination-page\"><a href ng-click=\"selectPage(page.number, $event)\">{{page.text}}</a></li>\n    <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-next\"><a href ng-click=\"selectPage(page + 1, $event)\">{{::getText(\'next\')}}</a></li>\n    <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-last\"><a href ng-click=\"selectPage(totalPages, $event)\">{{::getText(\'last\')}}</a></li>\n</ul>\n");}]);