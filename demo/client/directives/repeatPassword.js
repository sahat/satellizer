angular.module('MyApp')
  .directive('repeatPassword', function() {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl) {
        var otherInput = elem.inheritedData("$formController")[attrs.repeatPassword];

        ctrl.$parsers.push(function(value) {
          if (value === otherInput.$viewValue) {
            ctrl.$setValidity('repeat', true);
            return value;
          }
          ctrl.$setValidity('repeat', false);
        });

        otherInput.$parsers.push(function(value) {
          ctrl.$setValidity('repeat', value === ctrl.$viewValue);
          return value;
        });
      }
    };
  });