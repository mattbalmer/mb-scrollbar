var app = angular.module('scrollbar', ['ng-scrollbar']);

var BaseController = function($scope) {
    $scope.items = [];

    for(var i = 0; i < 15; i++) {
        $scope.items.push({
            id: i,
            name: 'Item '+i,
            desc: 'lorem ipsum dolor inquit sit amet.'
        });
    }

    var config = {};
    $scope.scrollbar = function(direction, autoResize) {
        config.direction = direction;
        config.autoResize = autoResize;
        return config;
    }
}

app.controller('Automatic', function($scope) {
    new BaseController($scope);

    $scope.removeOne = function() {
        $scope.items.pop();
    };

    $scope.addOne = function() {
        var i = $scope.items.length;
        $scope.items.push({
            id: i,
            name: 'Item '+i,
            desc: 'lorem ipsum dolor inquit sit amet.'
        });
    };
});

app.controller('Manual', function($scope, ngScrollbar) {
    new BaseController($scope);

    $scope.removeOne = function() {
        $scope.items.pop();
        $scope.$broadcast('recalculateScrollbars');
    };

    $scope.addOne = function() {
        var i = $scope.items.length;
        $scope.items.push({
            id: i,
            name: 'Item '+i,
            desc: 'lorem ipsum dolor inquit sit amet.'
        });
        $scope.$broadcast('recalculateScrollbars');
    };

    ngScrollbar.recalculate($scope);
});