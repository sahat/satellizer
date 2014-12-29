angular.module('MyApp')
  .directive('passwordMatch', function() {
    return {
      require: 'ngModel',
      scope: {
        otherModelValue: '=passwordMatch'
      },
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
          console.log(modelValue, scope.otherModelValue);
          return modelValue === scope.otherModelValue;
        };
        scope.$watch('otherModelValue', function() {
          ngModel.$validate();
        });
      }
    };
  });

