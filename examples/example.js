var app = angular.module('scrollbar', ['mb-scrollbar']);

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
    $scope.scrollbar = function(direction, autoResize, show) {
        config.direction = direction;
        config.autoResize = autoResize;
        config.scrollbar = {
            show: !!show
        };
        return config;
    }
};

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

app.controller('Manual', function($scope, mbScrollbar) {
    new BaseController($scope);

    $scope.removeOne = function() {
        $scope.items.pop();
        $scope.$broadcast('recalculateMBScrollbars');
    };

    $scope.addOne = function() {
        var i = $scope.items.length;
        $scope.items.push({
            id: i,
            name: 'Item '+i,
            desc: 'lorem ipsum dolor inquit sit amet.'
        });
        $scope.$broadcast('recalculateMBScrollbars');
    };

    mbScrollbar.recalculate($scope);
});