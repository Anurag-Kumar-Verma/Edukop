"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DownloadByCategoryComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("src/environments/environment");
var DownloadByCategoryComponent = /** @class */ (function () {
    function DownloadByCategoryComponent(router, route, classService, dashboardService, spinner) {
        this.router = router;
        this.route = route;
        this.classService = classService;
        this.dashboardService = dashboardService;
        this.spinner = spinner;
        this.itemId = "";
        this.itemType = "";
        this.itemName = "";
        this.action = "";
        this.imageApi = environment_1.environment.thumbApi;
        this.childDataList = [];
        this.standardList = [];
        this.examList = [];
        this.List = [];
        this.abbreviation = '';
        this.pageNumber = 0;
        this.coursePageNo = 1;
        this.pageLimit = 30;
        this.throttle = 300;
        this.scrollDistance = 2;
        this.scrollUpDistance = 3;
        this.noMoreCourse = true;
    }
    DownloadByCategoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.itemId = this.route.snapshot.paramMap.get("id");
        this.route.queryParams.subscribe(function (params) {
            if (params) {
                _this.itemType = JSON.parse(params === null || params === void 0 ? void 0 : params["type"]);
                _this.action = JSON.parse(params === null || params === void 0 ? void 0 : params["modalAction"]);
                _this.itemName = JSON.parse(params === null || params === void 0 ? void 0 : params["name"]);
                _this.abbreviation = JSON.parse(params === null || params === void 0 ? void 0 : params["abbreviation"]);
            }
        });
        if (this.itemType.toLowerCase() !== "university" &&
            this.itemType.toLowerCase() !== "competition") {
            this.getStandards();
        }
        else if (this.itemType.toLowerCase() === "university") {
            this.getCourses(true);
        }
        else if (this.itemType.toLowerCase() === "competition") {
            this.getExam(this.itemId);
        }
        else {
            return;
        }
    };
    DownloadByCategoryComponent.prototype.getStandards = function () {
        var _this = this;
        this.spinner.show();
        this.classService.getStandards().subscribe(function (res) {
            _this.List = res.DATA.docs;
            _this.standardList = _this.List.sort(function (a, b) {
                return Number(a.abbreviation) > Number(b.abbreviation) ? 1 : -1;
            });
            _this.spinner.hide();
            _this.ChildData = {
                type: _this.itemType,
                list: _this.List
            };
        });
    };
    DownloadByCategoryComponent.prototype.getCourses = function (isFirstLoad) {
        var _this = this;
        var paginate = {
            pageIndex: this.coursePageNo,
            pageSize: this.pageLimit
        };
        if (isFirstLoad == true) {
            this.List = [];
            this.coursePageNo = 1;
        }
        this.spinner.hide();
        this.classService.getCourses(paginate).subscribe(function (res) {
            if (res.DATA.docs.length < 1) {
                _this.noMoreCourse = true;
                return;
            }
            else if (res.DATA.docs.length == 30) {
                _this.noMoreCourse = false;
            }
            for (var i = 0; i < res.DATA.docs.length; i++) {
                _this.List.push(res.DATA.docs[i]);
            }
            _this.spinner.hide();
        }, function (error) {
            _this.spinner.hide();
        });
        this.ChildData = {
            type: this.itemType.toLowerCase(),
            list: this.List
        };
    };
    DownloadByCategoryComponent.prototype.getExam = function (id) {
        var _this = this;
        this.spinner.show();
        this.classService.getExam(id).subscribe(function (response) {
            _this.examList = response.DATA.docs;
            _this.examData = {
                type: _this.itemType,
                exam: _this.examList
            };
            _this.spinner.hide();
        }, function (error) {
            _this.spinner.hide();
        });
    };
    DownloadByCategoryComponent.prototype.productPage = function (category) {
        var data = {
            abbreviation: this.abbreviation,
            name: this.itemName,
            uuid: this.itemId,
            sub_uuid: category.uuid,
            type: this.itemType,
            className: category.name
        };
        localStorage.setItem("listItemsType", this.itemType);
        this.router.navigateByUrl("/product-list/" + Math.random(), {
            state: { data: data }
        });
    };
    DownloadByCategoryComponent.prototype.getStandardList = function (uuid, name, abbreviation) {
        var _this = this;
        this.spinner.show();
        setTimeout(function () {
            _this.spinner.hide();
        }, 200);
        this.abbreviation = "";
        this.itemId = uuid;
        this.itemName = name;
        this.abbreviation = abbreviation;
        this.itemType = this.itemType.toLowerCase();
        this.getStandards();
    };
    DownloadByCategoryComponent.prototype.scrollPage = function () {
        this.pageNumber++;
        this.coursePageNo++;
        if (this.itemType.toLowerCase() === "university") {
            this.getCourses(false);
        }
    };
    DownloadByCategoryComponent.prototype.downloadAll = function () {
        var navigationExtras = {
            queryParams: {
                type: JSON.stringify(this.itemType),
                name: JSON.stringify(this.itemName),
                modalAction: JSON.stringify(''),
                abbreviation: JSON.stringify(this.abbreviation || null)
            }
        };
        this.router
            .navigate(["/side/child-categories/" + this.itemId], navigationExtras)["catch"]();
    };
    DownloadByCategoryComponent.prototype.back = function () {
        history.back();
    };
    DownloadByCategoryComponent = __decorate([
        core_1.Component({
            selector: 'app-download-by-category',
            templateUrl: './download-by-category.component.html',
            styleUrls: ['./download-by-category.component.scss']
        })
    ], DownloadByCategoryComponent);
    return DownloadByCategoryComponent;
}());
exports.DownloadByCategoryComponent = DownloadByCategoryComponent;
