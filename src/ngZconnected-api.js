angular.module('ngZconnected.api', ['ngResource', 'ngCookies', 'ngFileUpload', 'ngZconnected'])
    .config(['$httpProvider', 'httpRequestInterceptorProvider', function($httpProvider, httpRequestInterceptorProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');
        httpRequestInterceptorProvider.error(function() {

            $logoutElement = angular.element('#logoutLink');
            if ($logoutElement.length > 0) {
                window.location.href = $logoutElement.attr('href');
            } else {
                window.location.href = '/logout';
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
                getTimelineHtml: function(argument) {
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
    .factory('userService', ['$resource', 'ngZconnected', function($resource, ngZconnected) {
        var apiRoot = ngZconnected.apiUrl;
        return {
            getCurrentUser: function() {
                return $resource(apiRoot + '/user/current').get().$promise;
            },
            getCurrentUserFriends: function() {
                return $resource(apiRoot + '/user/current/friends').get().$promise;
            },
            getCurrentUserSuggestedUsers: function(limit, page) {
                return $resource(apiRoot + '/user/current/suggestedUsers?limit=:limit&page=:page', {}, {
                    query: {
                        method: 'GET',
                        isArray: false
                    }
                }).query({ limit: limit, page: page }).$promise;
            }
        };
    }])
    .provider('httpRequestInterceptor', [function() {
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
                            successCallbacks.forEach(function(success, index) {
                                if (Object.prototype.toString.call(success) === "[object Function]" || Object.prototype.toString.call(success) === "[object Array]") {
                                    $injector.invoke(success);
                                }
                            });

                        } else {
                            errorCallbacks.forEach(function(error, index) {
                                if (Object.prototype.toString.call(error) === "[object Function]" || Object.prototype.toString.call(error) === "[object Array]") {
                                    $injector.invoke(error);
                                }
                            });

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
