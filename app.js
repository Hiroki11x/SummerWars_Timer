(function(){
	"use strict";

	var windowWidht = 960;
	var windowHeight = 500;


	var svg = d3.select("svg");

	var projection90 = d3.geo.orthographic()
		.scale(windowWidht/4)
		.rotate([0,0,0])
		.translate([windowWidht / 2, windowHeight / 2])
		.clipAngle(90);

	var projection180 = d3.geo.orthographic()
		.scale(windowWidht/4)
		.rotate([0,0,0])
		.translate([windowWidht / 2, windowHeight / 2])
		.clipAngle(180);


	var frontPath = d3.geo.path().projection(projection90);
	var backPath = d3.geo.path().projection(projection180);

		d3.json("https://gist.githubusercontent.com/shimizu/97c156f7f9137586f784/raw/4be1053346fa88d448c2290c49689634c8102b0a/Landmasses.geojson", function(geojson){


			/*************************************************************
			 * 地球儀表示
			 *************************************************************/
			var stage = svg.append("svg:g");

			//ステージを右23.4度傾ける
			stage.attr("transform", "rotate(23.4, "+windowWidht/2+",  "+windowHeight/2+")") ;

			//地形(裏)
			var backMap = stage.append("svg:path")
				.attr({
				"d":function(){ return backPath(geojson)},
					"fill-opacity":1,
					"fill":"#EDE9F1",
					"stroke":"none",
				});

			//地形(表)
			var frontMap = stage.append("svg:path")
				.attr({
				"d":function(){ return frontPath(geojson)},
					"fill-opacity":1,
					"fill":"#009688",
					"stroke":"none",
				});


			//地形を回転させる
			var update = function(){
				var i = 0;
				return function(){
					i = i+0.2;
					projection90.rotate([i,0,0]);
					projection180.rotate([i,0,0]);

					frontPath = d3.geo.path().projection(projection90);
					backPath = d3.geo.path().projection(projection180);

					backMap.attr("d", backPath(geojson));
					frontMap.attr("d", frontPath(geojson));

				}
			}
			setInterval(update(), 100);


			/*************************************************************
			 * 時計表示
			 *************************************************************/
			var marginLeft = windowWidht/8;
			var marginTop = windowHeight/3 + windowHeight/6;
			var textY = 10;


			var clockGroup = svg.append("g")
				.attr("transform", "translate("+[marginLeft, marginTop]+")") ;

			//テキスト背景描画
			var clockRect = clockGroup.append("rect")
				.attr({
					"width":"70%",
					"height":windowWidht/10,
					"fill":"EDE9F1",
					"fill-opacity": 0.2
				})

			//テキスト描画
			var clockText = clockGroup.append("text")
				.attr({
					"x":"10",
					"y":windowWidht/11,
					"font-size": 110,
					"font-weight":"bold",
					"font-family":"arial",
					"line-height": 1.5,
					"letter-spacing": 5,
					"word-spacing": 5
				});

      var count = 0.0

      clockText.text('00:00:00:00');

      function timeFormatter(){
        var time = String(count).split(".")
        var ms = time[1] || 0;
        var h = parseInt(Number(time[0])/60/60)
        var m = parseInt((Number(time[0]) - h*60*60)/60)
        var s = parseInt((Number(time[0]) - h*60*60 - m*60))
        return fixTime(h)+':'+fixTime(m)+':'+fixTime(s)+':'+fixTime(ms)
      }
      function fixTime(time) {
        if (String(time).length == 1){
          time = '0'+time
        }
        return time
      }
      var timer;
      function start(){
        timer = setInterval(function(){
          if(count <= 0){
            var helloworld = new SpeechSynthesisUtterance('Summer wars!');
            helloworld.lang = 'en-US';
            speechSynthesis.speak(helloworld);
            clearInterval(timer);
          }
  				clockText.text(timeFormatter());
          count-=0.01
          count = count.toFixed(2)
  			}, 10)
      }
      $('.setTime').click(function(event) {
        var c = $(this).data('time')
        count += parseFloat(c);
        clockText.text(timeFormatter());
      });
      $('#start').click(function(event) {
        start();
      });
      $('#clear').click(function(event) {
        clearInterval(timer);
        clockText.text('00:00:00:00');
        count = 0.0;
      });
	});

})();
