function draw_bubble_chart(render_data, div, title, hAxis_title, vAxis_title) {
	var data = google.visualization.arrayToDataTable(render_data);


	var options = {
		'title': title,
		'hAxis' : {
			'title' : hAxis_title,
			'gridlines' : {
				color : 'transparent'
			}
		},
		'vAxis' : {
			'title' : vAxis_title,
			'gridlines' : {
				color : 'transparent'
			}
		},
		'legend' : {
			'position' : 'top'
		},
		'bubble' : {
			'textStyle' : {
				'color' : 'transparent'
			}
		},
		'chartArea' : {
			'width' : '80%',
			'height' : '80%'

		},
		backgroundColor: '#F5F5F5'
	};

	var chart = new google.visualization.BubbleChart(document
			.getElementById(div));

	chart.draw(data, options);
}

function draw_pie_chart(render_data, div, title) {
	var data = google.visualization.arrayToDataTable(render_data);

	var options = {
		title:title,
		is3D : true,
		legend:{
			position:'bottom'
		},
		backgroundColor: '#F5F5F5'
	};

	var chart = new google.visualization.PieChart(document.getElementById(div));
	chart.draw(data, options);
}

function draw_line_chart(render_data, div, title, vAxes_title_left, vAxes_title_right) {
	var data = google.visualization.arrayToDataTable(render_data);

	var options = {
		width:'100%',
		title: title,
		legend : {
			position : 'bottom'
		},
		hAxes:{
			gridlines:{
				color:'transparent'
			}
		},
		vAxes:[
		       {
		    	   title: vAxes_title_left, 
		    	   maxValue: 10,
		    	   gridlines:{
		    		   color:'transparent'
		    	   }
		       }, // Left axis
		       {
		    	   title: vAxes_title_right,
		    	   maxValue: 20,
		    	   gridlines:{
		    		   color:'transparent'
		    	   }
		    	} // Right axis
		],
		series:[
		        {
		        	targetAxisIndex:0
		        },
		        {
		        	targetAxisIndex:1
		        }
		],
		'chartArea': {
            'width':'80%',
            'height':'80%'
          },
		focusTarget: 'category',
		backgroundColor: '#F5F5F5'
	};

	var chart = new google.visualization.LineChart(document.getElementById(div));
	chart.draw(data, options);
}

function draw_album_line_chart(render_data, div, title, vAxes_title_left, vAxes_title_right) {
	var data = google.visualization.arrayToDataTable(render_data);

	var options = {
		width:'100%',
		title: title,
		legend : {
			position : 'bottom'
		},
		hAxes:{
			gridlines:{
				color:'transparent'
			}
		},
		vAxes:[
		       {
		    	   title: vAxes_title_left, 
		    	   maxValue: 10,
		    	   gridlines:{
		    		   color:'transparent'
		    	   }
		       }, // Left axis
		       {
		    	   title: vAxes_title_right,
		    	   maxValue: 20,
		    	   gridlines:{
		    		   color:'transparent'
		    	   }
		    	} // Right axis
		],
		series:[
		        {
		        	targetAxisIndex:0
		        },
		        {
		        	targetAxisIndex:0
		        },
		        {
		        	targetAxisIndex:1
		        }
		],
		'chartArea': {
            'width':'80%',
            'height':'60%'
          },
		focusTarget: 'category',
		backgroundColor: '#F5F5F5'
	};

	var chart = new google.visualization.ColumnChart(document.getElementById(div));
	chart.draw(data, options);
}

function draw_album_table(render_data, div){
	var data = google.visualization.arrayToDataTable(render_data);
	var table = new google.visualization.Table(document.getElementById(div));
	table.draw(data, {showRowNumber: true});

}


function draw_treemap_chart(render_data, div){
	var data = google.visualization.arrayToDataTable(render_data);
	var tree = new google.visualization.TreeMap(document.getElementById(div));
	var options = {
			minColor : '#E0FFFF',
			midColor : '#87CEEB',
			maxColor : '#5190ED',
			headerHeight : 20,
			fontColor : 'black',
			showScale: true,
			generateTooltip: showStaticTooltip
		}
	tree.draw(data, options);

	 function showStaticTooltip(row, size, value) { 
		 return '<div style="background:#fd9; padding:4px; border-style:1 px solid">' +
		 		data.getValue(row, 0) + '<br>' + data.getColumnLabel(2) + ': ' + size + ' </div>'; 
	}
	 
}


function draw_map(render_data,div){
	var data = google.visualization.arrayToDataTable(render_data);
	  var options = { 
			  showTip: true,
			  enableScrollWheel: true,
			  mapType: 'normal'
			  };
	
	  var map = new google.visualization.Map(document.getElementById(div));
	
	  map.draw(data, options);
}

function draw_column_chart(render_data, div){
	var data = google.visualization.arrayToDataTable(render_data);

    var options = {
      title:'Total Unread Posts in Groups',
      hAxis: {
    	  	title: 'Groups'
      	},
      	vAxis:{
      		title: 'Unread Posts',
      		gridlines:{
	    		   color:'transparent'
	    	   }
      	},
      	legend:{
      		position:'top'
      	},
      	chartArea: {
            'width':'80%',
            'height':'60%'
          },
    };

    var chart = new google.visualization.ColumnChart(document.getElementById(div));

    chart.draw(data, options);

}