var app = angular.module('app', ['angularRangeSlider' , 'ngMaterial']);
app.controller('AppController',['$scope','$filter', function($scope,$filter) {

$scope.step = [0,0,1,0.1];
$scope.stepMem = [0,0];
$scope.type = true;
$scope.a1 = 'activeButton';
$scope.errorMessage = "";
$scope.items = [
	{
  	name  : 'First Item',
    value : 5000000
  },
	{
   	name  : 'Second Item',
    value : 4000000
	},	
	{
		name  : 'Third Item',
		value : 12
	},
	{
		name  : 'Fourth Item',
		value : 15
	}
];
$scope.items3 = $scope.items[3].value;

$scope.isnum = function(value){
  return !isNaN(parseFloat(value)) && isFinite(value);
};

$scope.onFocus = function(index) {
	if(index == 3)
	{	$scope.step[index] = 0.01;	}
	else
	{ $scope.step[index] = 1;}
};

$scope.onBlur = function(index) {
	if(index == 3)
	{
		$scope.step[index] = 0.1;
		$scope.items3 = $scope.items[3].value	
	}
	else
	{	$scope.step[index] = $scope.stepMem[index]; }
};

$scope.onChange = function(value) {
	if($scope.isnum(value) && value >= 0 && value.charAt(value.length - 1) != ".")
	{
		$scope.items[3].value	= value;
		$scope.mortCalc($scope.items,$scope.type);
	}
};

$scope.filterInput = function(limit,newValue,index) {
	if(newValue > limit)
	{ $scope.items[index].value = limit }
	else if(newValue == "")
	{ $scope.items[index].value = 0;}
};

$scope.changeStep = function(index,newValue, ){
	if( $scope.step[index] != 1){  
		if((newValue >= Math.pow(10,7)) && (newValue <= Math.pow(10,8) )){
			$scope.stepMem[index] = 2000000;
			$scope.step[index] = $scope.stepMem[index];
		}
		else if((newValue <= Math.pow(10,7)) && (newValue >= Math.pow(10,6))){
					$scope.stepMem[index] = 100000;
					$scope.step[index] = $scope.stepMem[index];
		}
		else if((newValue <= Math.pow(10,6)) && (newValue >= 200000)){
					$scope.stepMem[index] = 50000;
					$scope.step[index] = $scope.stepMem[index];
		}
		else if((newValue <= 200000) && (newValue >= 0)){
					$scope.stepMem[index] = 10000;
					$scope.step[index] = $scope.stepMem[index];
		}
	}

	$scope.filterInput(Math.pow(10,8),newValue,index);

};

$scope.mortCalc = function(items, type) {

	if((items[0].value - items[1].value) > 0)
	{
		$scope.errorMessage = "";

		if( type == true)
		{
			$scope.intRate = (items[3].value / 100) / 12;
			$scope.monPaym = (items[0].value - items[1].value) * ($scope.intRate) / (1 - Math.pow((1 + $scope.intRate),-(items[2].value * 12)));
			$scope.totalLoan = $scope.monPaym * items[2].value * 12;
			$scope.intRateSum = $scope.totalLoan - (items[0].value - items[1].value);
			$scope.monPaym = $filter('number')($scope.monPaym, 0);
		}
		else
		{
			$scope.body = (items[0].value - items[1].value)/(items[2].value * 12) ;
			$scope.intRateSum = 0;		
			$scope.container = items[0].value - items[1].value;					
	
			for(i = 0; i < 12 * items[2].value; i ++)
			{
				$scope.intRateSum = $scope.intRateSum + (($scope.container * items[3].value * 30) / 356) / 100;
				$scope.container = $scope.container - $scope.body;
			}

			$scope.firstInter = (((items[0].value - items[1].value) * items[3].value * 30) / 356) / 100;
			$scope.lastInter = ((($scope.body * items[3].value * 30) / 356) / 100);
			$scope.monPaymF = $filter('number')($scope.body + $scope.firstInter, 0);
			$scope.monPaymL = $filter('number')($scope.body + $scope.lastInter, 0);
			$scope.monPaym = $scope.monPaymF + " ... " + $scope.monPaymL;
			$scope.totalLoan = items[0].value - items[1].value + $scope.intRateSum;
		}
	}
	else
	{
		$scope.errorMessage = "Первоначальный взнос не может быть больше чем стоимость недвижимости";
		$scope.monPaym = 0;
		$scope.intRateSum = 0;
		$scope.totalLoan = 0;
	}
};

$scope.$watch('items[0].value', function(newValue) {
	$scope.changeStep(0,newValue);
	$scope.mortCalc($scope.items,$scope.type);
});

$scope.$watch('items[1].value', function(newValue) {
	$scope.changeStep(1,newValue);
	$scope.mortCalc($scope.items,$scope.type);
});

$scope.$watch('items[2].value', function(newValue) {
	$scope.filterInput(25,newValue,2);
	$scope.mortCalc($scope.items,$scope.type);
});

$scope.$watch('items[3].value', function(newValue) {
	$scope.items3 = newValue;
	$scope.filterInput(30,newValue,3);
	$scope.mortCalc($scope.items,$scope.type);
});

$scope.$watch('type', function(newValue) {
	$scope.mortCalc($scope.items,$scope.type);
});

}]);

