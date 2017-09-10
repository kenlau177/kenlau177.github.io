function parse_data_build_detailed_res_table(parsedCSV) {
  var idx_month = 11;
  var idx_site = 3;
  var idx_addonrmv_type = 1;
  var idx_addon_rmv = 2;
  var idx_city = 5;
  var idx_type = 6;
  var idx_urbanrural = 4;
  var idx_terms = 7;
  var idx_cannib = 9;

  var val_month = $('#filter_by_month').val()
  var val_cities = $('#filter_by_city').val();
  var val_types = $('#filter_by_type').val();
  var val_urbanrurals = $('#filter_by_urbanrural').val();
  var val_sites = $('#filter_by_sites').val();
  var val_addon_type = $('#filter_by_addon_type').val();
  var val_addon_rmv = $('#filter_by_addon_or_removal').val();
  var val_pat_bias = $('#filter_by_pat').val();

  if (val_month === null){ return []; }
  if (val_cities === null){ return []; }
  if (val_types === null){ return []; }
  if (val_urbanrurals === null){ return []; }
  if (val_sites === null){ return []; }
  if (val_addon_type === null){ return []; }
  if (val_addon_rmv === null){ return []; }
  if (val_pat_bias === null){ return []; }

  var bool_pat = true;
  var rows = parsedCSV.filter(function(elem, i) {
    var bool_cities = (val_cities.indexOf(elem[idx_city]) > -1);
    var bool_types = (val_types.indexOf(elem[idx_type]) > -1);
    var bool_urbanrurals = (val_urbanrurals.indexOf(elem[idx_urbanrural]) > -1);
    var bool_sites = (val_sites.indexOf(elem[idx_site]) > -1);
    
    var bool_month = (val_month.indexOf(elem[idx_month]) > -1);
    var bool_addon_type = (val_addon_type.indexOf(elem[idx_addonrmv_type]) > -1);

    var bool_addon_rmv = (val_addon_rmv.indexOf(elem[idx_addon_rmv]) > -1);

    if (val_pat_bias.indexOf("yes") > -1) { bool_pat = (elem[idx_cannib] <= 100 & elem[idx_cannib] >= 9); };

    var bool_all = bool_cities && bool_types && bool_urbanrurals && bool_sites && bool_month && bool_addon_type && bool_addon_rmv && bool_pat;
    
    return bool_all;
  });

  return rows;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function build_filtered_aggregate_table(parsedCSV) {
  var site_addon_terms = 0;
  var site_addon_sites = 0;
  var site_addon_ns = 0;
  var site_addon_nsptw = 0;

  var site_removal_terms = 0;
  var site_removal_sites = 0;
  var site_removal_ns = 0;
  var site_removal_nsptw = 0;

  var terminal_addon_terms = 0;
  var terminal_addon_sites = [];
  var terminal_addon_ns = 0;
  var terminal_addon_nsptw = 0;
  var terminal_addon_rows = 0;
  var terminal_addon_success = 0;

  var terminal_removal_terms = 0;
  var terminal_removal_sites = [];
  var terminal_removal_ns = 0;
  var terminal_removal_nsptw = 0;
  var terminal_removal_rows = 0;

  var idx_site = 3;
  var idx_addontype = 1
  var idx_addorrmv = 2
  var idx_term = 7;
  var idx_ns = 8;
  var idx_nsptw = 9;

  for (i = 0; i < parsedCSV.length; i++) { 
    if (parsedCSV[i][idx_addontype] === "site" && parsedCSV[i][idx_addorrmv] === "addon") {
      site_addon_terms += Number(parsedCSV[i][idx_term]);
      site_addon_sites += 1;
      site_addon_ns += Number(parsedCSV[i][idx_ns]);
      //site_addon_nsptw += Number(parsedCSV[i][idx_nsptw]);
    }
    if (parsedCSV[i][idx_addontype] === "site" && parsedCSV[i][idx_addorrmv] === "removal") {
      site_removal_terms += Number(parsedCSV[i][idx_term]);
      site_removal_sites += 1;
      site_removal_ns += Number(parsedCSV[i][idx_ns]);
      //site_removal_nsptw += Number(parsedCSV[i][idx_nsptw]);
    }
    if (parsedCSV[i][idx_addontype] === "terminal" && parsedCSV[i][idx_addorrmv] === "addon") {
      terminal_addon_terms += Number(parsedCSV[i][idx_term]);
      if (terminal_addon_sites.indexOf(parsedCSV[i][idx_site]) < 0) { terminal_addon_sites.push(parsedCSV[i][idx_site]); }
      terminal_addon_ns += Number(parsedCSV[i][idx_ns]);
      //terminal_addon_nsptw += Number(parsedCSV[i][idx_nsptw]);
      terminal_addon_rows++;
      if (Number(parsedCSV[i][idx_ns]) >= 0) { terminal_addon_success++; }
    }
    if (parsedCSV[i][idx_addontype] === "terminal" && parsedCSV[i][idx_addorrmv] === "removal") {
      terminal_removal_terms += Number(parsedCSV[i][idx_term]);
      if (terminal_removal_sites.indexOf(parsedCSV[i][idx_site]) < 0) { terminal_removal_sites.push(parsedCSV[i][idx_site]); }
      terminal_removal_ns += Number(parsedCSV[i][idx_ns]);
      //terminal_removal_nsptw += Number(parsedCSV[i][idx_nsptw]);
      terminal_removal_rows++;
    }
  }

  var week_diff = Number($('#filter_by_month').val());

  $('#site_addon_terms').text(site_addon_terms);
  $('#site_addon_sites').text(site_addon_sites);
  $('#site_addon_ns').text(numberWithCommas(site_addon_ns));
  if (site_addon_sites > 0) { 
    site_addon_nsptw = Math.round(site_addon_ns/site_addon_terms/week_diff);
  } else {
    site_addon_nsptw = 0;
  }
  $('#site_addon_nsptw').text(numberWithCommas(site_addon_nsptw));
  
  $('#site_removal_terms').text(site_removal_terms);
  $('#site_removal_sites').text(site_removal_sites);
  $('#site_removal_ns').text(numberWithCommas(site_removal_ns));
  if (site_removal_sites > 0) { 
    site_removal_nsptw = Math.round(site_removal_ns/Math.abs(site_removal_terms)/week_diff);    
  } else {
    site_removal_nsptw = 0;
  }
  $('#site_removal_nsptw').text(numberWithCommas(site_removal_nsptw));
  
  $('#terminal_addon_terms').text(terminal_addon_terms);
  $('#terminal_addon_sites').text(terminal_addon_sites.length);
  $('#terminal_addon_ns').text(numberWithCommas(terminal_addon_ns));
  if (terminal_addon_rows > 0) { 
    terminal_addon_nsptw = Math.round(terminal_addon_ns/terminal_addon_terms/week_diff);  
    $('#terminal_addon_success').text(Math.round((terminal_addon_success/terminal_addon_rows)*100) + '%');
  } else {
    terminal_addon_nsptw = 0;
    $('#terminal_addon_success').text(0);
  }
  $('#terminal_addon_nsptw').text(numberWithCommas(terminal_addon_nsptw));

  $('#terminal_removal_terms').text(terminal_removal_terms);
  $('#terminal_removal_sites').text(terminal_removal_sites.length);
  $('#terminal_removal_ns').text(numberWithCommas(terminal_removal_ns));
  if (terminal_removal_rows > 0) { 
    terminal_removal_nsptw = Math.round(terminal_removal_ns/Math.abs(terminal_removal_terms)/week_diff);
  } else {
    terminal_removal_nsptw = 0;
  }
  $('#terminal_removal_nsptw').text(numberWithCommas(terminal_removal_nsptw));

  $('#terminals_subtotal').text(site_addon_terms + site_removal_terms + terminal_addon_terms + terminal_removal_terms);
  $('#ns_inc_subtotal').text(numberWithCommas(site_addon_ns + site_removal_ns + terminal_addon_ns + terminal_removal_ns));
  $('#nsptw_inc_subtotal').text(numberWithCommas(site_addon_nsptw + site_removal_nsptw + terminal_addon_nsptw + terminal_removal_nsptw));

  $('#filtered_detailed_summary_header').text('Filtered Detailed Summary - In Dates and Configurations - ' + $('.input-daterange input:eq(0)').val() + ' to ' + $('.input-daterange input:eq(1)').val());  
}

function apply_agg_display_percent(tag, val) {
  $(tag).text(d3.round(val) + '%');
  if (val >= 50) {
    $(tag).css({"color":"#98FB98", "display":"inline-block"});
  } else {
    $(tag).css({"color":"#ff7f7f", "display":"inline-block"});
  }
}

function apply_agg_display_num(tag, val) {
  $(tag).text('$' + numberWithCommas(d3.round(val)));
  if (val >= 0) {
    $(tag).css({"color":"#98FB98", "display":"inline-block"});
  } else {
    $(tag).css({"color":"#ff7f7f", "display":"inline-block"});
  }
}

function build_overview_table(data) {

  var raw_overview_dat = $.grep(data, function(v) {
    return v.week_diff === "13" && v.change_type === "terminal" && v.addon_or_removal === "addon";
  });

  var raw_overview_dat_success = $.grep(data, function(v) {
    return v.week_diff === "13" && v.change_type === "terminal" && v.addon_or_removal === "addon" && v.ns >= 0;
  });

  var raw_overview_dat_unsuccess = $.grep(data, function(v) {
    return v.week_diff === "13" && v.change_type === "terminal" && v.addon_or_removal === "addon" && v.ns < 0;
  });

  var overview_dat = d3.nest()
                      .key(function(d) { return d.site_type; })
                      .rollup(function(v) {
                        return {
                          terms: Math.round(d3.sum(v, function(d) { return d.terms; })),
                          ns: Math.round(d3.sum(v, function(d) { return d.ns; })),
                          success: Math.round(10*100*(d3.sum(v, function(d) { return d.ns >= 0; })/d3.sum(v, function(d) { return 1; })))/10,
                          nspw: Math.round(d3.mean(v, function(d) { return d.ns; })/13),
                          ns_year: 52*Math.round(d3.sum(v, function(d) { return d.ns; }))/13 // The 13 corresponds to weeks bef/aft
                        }
                      }).map(raw_overview_dat);

  function fill_in_overview_dat(x) {
    var out = x
    if (!('Casino' in x)) {
      out['Casino'] = {'terms':0, 'ns':0, 'success':0, 'nspw':0, 'ns_year':0}
    }
    if (!('GEC' in x)) {
      out['GEC'] = {'terms':0, 'ns':0, 'success':0, 'nspw':0, 'ns_year':0}
    }
    if (!('Regular' in x)) {
      out['Regular'] = {'terms':0, 'ns':0, 'success':0, 'nspw':0, 'ns_year':0}
    }
    return out;
  }

  var overview_dat_success = d3.nest()
                              .key(function(d) { return d.site_type; })
                              .rollup(function(v) {
                                return { 
                                  terms: Math.round(d3.sum(v, function(d) { return d.terms; })),
                                  ns: Math.round(d3.sum(v, function(d) { return d.ns; })),
                                  nspw: Math.round(d3.sum(v, function(d) { return d.ns; })/13),
                                  success: Math.round(10*100*(d3.sum(v, function(d) { return d.ns >= 0; })/d3.sum(v, function(d) { return 1; })))/10,
                                  ns_year: 52*Math.round(d3.sum(v, function(d) { return d.ns; }))/13
                                }
                              }).map(raw_overview_dat_success);

  var overview_dat_unsuccess = d3.nest()
                              .key(function(d) { return d.site_type; })
                              .rollup(function(v) {
                                return { 
                                  terms: Math.round(d3.sum(v, function(d) { return d.terms; })),
                                  ns: Math.round(d3.sum(v, function(d) { return d.ns; })),
                                  nspw: Math.round(d3.sum(v, function(d) { return d.ns; })/13),
                                  success: Math.round(10*100*(d3.sum(v, function(d) { return d.ns >= 0; })/d3.sum(v, function(d) { return 1; })))/10,
                                  ns_year: 52*Math.round(d3.sum(v, function(d) { return d.ns; }))/13
                                }
                              }).map(raw_overview_dat_unsuccess);
                              
  overview_dat = fill_in_overview_dat(overview_dat);
  overview_dat_success = fill_in_overview_dat(overview_dat_success);
  overview_dat_unsuccess = fill_in_overview_dat(overview_dat_unsuccess);
  
  function compute_sites(x) {
    if (x.length > 0) {
      var overview_dat_sites = d3.nest()
                                .key(function(d) { return d.site_type; })
                                .map(x);
      if (!('Casino' in overview_dat_sites)) {
        var casino_sites = 0;
      } else {
        var casino_sites = overview_dat_sites.Casino.map(function(a) { return a.site; });
        casino_sites = Array.from(new Set(casino_sites)).length;
      }
      if (!('GEC' in overview_dat_sites)) {
        var gec_sites = 0;        
      } else {
        var gec_sites = overview_dat_sites.GEC.map(function(a) { return a.site; });
        gec_sites = Array.from(new Set(gec_sites)).length;
      }
      if (!('Regular' in overview_dat_sites)) {
        var reg_sites = 0;
      } else {
        var regular_sites = overview_dat_sites.Regular.map(function(a) { return a.site; });
        regular_sites = Array.from(new Set(regular_sites)).length;                
      }
    } else {
      var casino_sites = 0;
      var gec_sites = 0;
      var regular_sites = 0;
    }
    return {casino: casino_sites, gec: gec_sites, reg: regular_sites};
  }
  overview_dat_sites = compute_sites(raw_overview_dat);
  overview_dat_sites_success = compute_sites(raw_overview_dat_success);
  overview_dat_sites_unsuccess = compute_sites(raw_overview_dat_unsuccess);
  
  //** CASINO OVEVIEW **//
  apply_agg_display_percent('.casino_success', overview_dat.Casino.success);
  apply_agg_display_num('.casino_incns', overview_dat_success.Casino.terms !== 0 ? overview_dat_success.Casino.nspw/overview_dat_success.Casino.terms : 0);
  apply_agg_display_num('.casino_incns_year', d3.round(overview_dat_success.Casino.ns_year));
  $('.casino_sites').text(overview_dat_sites.casino);
  $('.casino_vlts').text(overview_dat.Casino.terms);
  
  apply_agg_display_percent('.gec_success', overview_dat.GEC.success);
  apply_agg_display_num('.gec_incns', overview_dat_success.GEC.terms !== 0 ? overview_dat_success.GEC.nspw/overview_dat_success.GEC.terms : 0);
  apply_agg_display_num('.gec_incns_year', d3.round(overview_dat_success.GEC.ns_year));
  $('.gec_sites').text(overview_dat_sites.gec);
  $('.gec_vlts').text(overview_dat.GEC.terms);
  
  apply_agg_display_percent('.reg_success', overview_dat.Regular.success);
  apply_agg_display_num('.reg_incns', overview_dat_success.Regular.terms !== 0 ? overview_dat_success.Regular.nspw/overview_dat_success.Regular.terms : 0);
  apply_agg_display_num('.reg_incns_year', d3.round(overview_dat_success.Regular.ns_year));
  $('.reg_sites').text(overview_dat_sites.reg);
  $('.reg_vlts').text(overview_dat.Regular.terms);
  
  //** APPLY THE DETAIL TABLES **//
  $('#casino_detail_sites').text(overview_dat_sites.casino);
  $('#casino_detail_terms').text(overview_dat.Casino.terms);
  $('#casino_detail_nsptw').text('$' + numberWithCommas(d3.round(overview_dat.Casino.terms !== 0 ? overview_dat.Casino.nspw/overview_dat.Casino.terms : 0)));
  $('#casino_detail_sites_success').text(overview_dat_sites.casino_sites);
  $('#casino_detail_terms_success').text(overview_dat_success.Casino.terms);
  $('#casino_detail_nsptw_success').text('$' + numberWithCommas(d3.round(overview_dat_success.Casino.terms !== 0 ? overview_dat_success.Casino.nspw/overview_dat_success.Casino.terms : 0)));
  $('#casino_detail_sites_unsuccess').text(overview_dat_sites.casino);
  $('#casino_detail_terms_unsuccess').text(overview_dat_unsuccess.Casino.terms);
  $('#casino_detail_nsptw_unsuccess').text('$' + numberWithCommas(d3.round(overview_dat_unsuccess.Casino.terms !== 0 ? overview_dat_unsuccess.Casino.nspw/overview_dat_unsuccess.Casino.terms : 0)));

  $('#gec_detail_sites').text(overview_dat_sites.gec);
  $('#gec_detail_terms').text(overview_dat.GEC.terms);
  $('#gec_detail_nsptw').text('$' + numberWithCommas(d3.round(overview_dat.GEC.terms !== 0 ? overview_dat.GEC.nspw/overview_dat.GEC.terms : 0)));
  $('#gec_detail_sites_success').text(overview_dat_sites_success.gec);
  $('#gec_detail_terms_success').text(overview_dat_success.GEC .terms);
  $('#gec_detail_nsptw_success').text('$' + numberWithCommas(d3.round(overview_dat_success.GEC.terms !== 0 ? overview_dat_success.GEC.nspw/overview_dat_success.GEC.terms : 0)));
  $('#gec_detail_sites_unsuccess').text(overview_dat_sites_unsuccess.gec);
  $('#gec_detail_terms_unsuccess').text(overview_dat_unsuccess.GEC.terms);
  $('#gec_detail_nsptw_unsuccess').text('$' + numberWithCommas(d3.round(overview_dat_unsuccess.GEC.terms !== 0 ? overview_dat_unsuccess.GEC.nspw/overview_dat_unsuccess.GEC.terms : 0)));

  $('#reg_detail_sites').text(overview_dat_sites.reg);
  $('#reg_detail_terms').text(overview_dat.Regular.terms);
  $('#reg_detail_nsptw').text('$' + numberWithCommas(d3.round(overview_dat.Regular.terms !== 0 ? overview_dat.Regular.nspw/overview_dat.Regular.terms : 0)));
  $('#reg_detail_sites_success').text(overview_dat_sites_success.reg);
  $('#reg_detail_terms_success').text(overview_dat_success.Regular.terms);
  $('#reg_detail_nsptw_success').text('$' + numberWithCommas(d3.round(overview_dat_success.Regular.terms !== 0 ? overview_dat_success.Regular.nspw/overview_dat_success.Regular.terms : 0)));
  $('#reg_detail_sites_unsuccess').text(overview_dat_sites_unsuccess.reg);
  $('#reg_detail_terms_unsuccess').text(overview_dat_unsuccess.Regular.terms);
  $('#reg_detail_nsptw_unsuccess').text('$' + numberWithCommas(d3.round(overview_dat_unsuccess.Regular.terms !== 0 ? overview_dat_unsuccess.Regular.nspw/overview_dat_unsuccess.Regular.terms : 0)));  
}

function build_detailed_res_table() {
  d3.select("#detailed_res")
    .append("table")
    .style("margin","0px")
    .style("width","100%")
    .attr("id", "detailed_res_table")
    .attr("class", "tablesorter")
    .append("thead")
    .append("tr")
    .selectAll("th")
    .data(["Salesweek", "Site/Terminal", "Activity", "Site", "UrbRu", "City", "Type", "New VLTs", "Inc NS", "Inc NSPTW", "Sites @1km | @5km | @10km", "Weeks Bef/Aft"])
    .enter()
    .append("th").text(function(d) { return d; })

  if ($('#filter_by_adjust').val() === 'yes') {
    var file_in = 'data/batch_adjusted.csv';
  } else {
    var file_in = 'data/batch.csv';
  }

  d3.csv(file_in, function(data) {
    var header = Object.keys(data[0]);

    var start_date = $('.input-daterange input:eq(0)').datepicker('getDate');
    var end_date = $('.input-daterange input:eq(1)').datepicker('getDate');
    var data = data.filter(function(elem,i) {
      return (new Date(elem.trans_date)).getTime() >= start_date.getTime() && (new Date(elem.trans_date)).getTime() <= end_date.getTime();
    });

    //if (data.length === 0) {
    //  return;
    //}

    var parsedCSV = [];
    for (i in data) {
      var values = [];
      for (j in data[i]) {
        values.push(data[i][j]);  
      }
      parsedCSV.push(values);
    }

    parsedCSV = parse_data_build_detailed_res_table(parsedCSV);

    build_filtered_aggregate_table(parsedCSV);

    build_overview_table(data);

    var container = d3.select("#detailed_res_table").append("tbody")
      .selectAll("tr")
      .data(parsedCSV).enter()
      .append("tr")
      .selectAll("td")
      .data(function(d) { return d; }).enter()
      .append("td")
      .style("cursor", "pointer")
      .text(function(d) { return d; });
    
    $(function() {
      $("#detailed_res_table")
        .on('click', 'tbody tr', function() {
          var trans_date = $(this).closest('tr').children().eq(0).text();
          var site = $(this).closest('tr').children().eq(3).text();
          $('#detailed_res_table tr td').removeClass('selected');
          $(this).find('td').addClass('selected');
          build_terminals_performance_ts(site, trans_date);
        })
        .tablesorter({
        theme: 'default',
        widgets: ['zebra','scroller'],
        widgetOptions: {
          scroller_height: 450
        },
        sortList: [[0,0]],
        sortAppend: [[1,1]]
      });            
    });

/*
    var parsedCSV = d3.csv.parseRows(data);
    
    parsedCSV.shift();
    
    var header = parsedCSV[0];
    
    parsedCSV = parse_data_build_detailed_res_table(parsedCSV)
    

    var container = d3.select("#detailed_res_table").append("tbody")
      .selectAll("tr")
      .data(parsedCSV).enter()
      .append("tr")
      .selectAll("td")
      .data(function(d) { return d; }).enter()
      .append("td")
      .style("cursor", "pointer")
      .text(function(d) { return d; });
      
    $(function() {
      $("#detailed_res_table")
        .on('click', 'tbody tr', function() {
          var trans_date = $(this).closest('tr').children().eq(0).text();
          var site = $(this).closest('tr').children().eq(3).text();
          $('#detailed_res_table tr td').removeClass('selected');
          $(this).find('td').addClass('selected');
          build_terminals_performance_ts(site, trans_date);
        })
        .tablesorter({
        theme: 'default',
        widgets: ['zebra','scroller'],
        widgetOptions: {
          scroller_height: 450
        },
        sortList: [[0,0]],
        sortAppend: [[1,1]]
      });            
    });
*/
    
  }); 

};




