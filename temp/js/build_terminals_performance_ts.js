
function build_terminals_performance_ts(site, trans_date) {

	d3.csv("data/terminal-trend-plot-dat.csv", function(data) {
		$('#site_selected').text(site);
		$('#trans_date').text(trans_date);
		
		//var trans_date_month = trans_date.substring(0, 8).concat('01');
		var filtered_dat = data.filter(function(x) { return x.site === site && x.trans_date === trans_date; });
		var grouped_dat = d3.nest().key(function(d) { return d.terminal; }).map(filtered_dat);

		var xs_in = {};
		var terminals = Object.keys(grouped_dat);
		var columns_in = [];
		var axis_in = {};
		for (x in terminals) {
			xs_in[terminals[x]] = 'date_' + terminals[x];
			columns_in.push([terminals[x]].concat(grouped_dat[terminals[x]].map(function(x) { return Number(x.nsptd); })));
			columns_in.push(['date_' + terminals[x]].concat(grouped_dat[terminals[x]].map(function(x) { return x.date; })));
			axis_in[('date_' + terminals[x])] = {type: 'category'};
		}

		var chart = c3.generate({
		    bindto: '#terminals_performance_ts',
		    size: {
	        height: 360
    		},
		    data: {
		      xs: xs_in,
		      columns: columns_in
		    }, 
		    axis: {
		    	x: {
		    		type: 'timeseries',
		    		tick: {
		    			format: '%b-%Y'
		    		}
		    	}, 
		    	y: {
		    		label: {text: 'NSPTD', position: 'outer-middle'}
		    	}
		    },
		    grid: {
		    	x: {
		    		lines: [
                {value: trans_date, text: 'Activity Occurence'}
            ]
		    	},
		    	y: {
		    		show: true
		    	}
		    }
		});
		
		$('#terminals_performance_ts')
								.append('<center><button id="c3_select_lines" class="btn btn-primary btn-xs" style="margin-right:20px;">Select All Lines</button>' + 
												'<button id="c3_unselect_lines" class="btn btn-primary btn-xs">Unselect All Lines</button></center>');

		$('#c3_select_lines').click(function() {
			chart.show();
		});
		$('#c3_unselect_lines').click(function() {
			chart.hide();
		});

	});

}

