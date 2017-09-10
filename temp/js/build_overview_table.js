
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

d3.csv("data/overview.csv", function(data) {
  
  var dat_casino = data[0];
  var dat_gec = data[1];
  var dat_reg = data[2];

  $('.casino_success').text(d3.round(dat_casino.success*100, 1) + '%');
  if (dat_casino.success >= .5) {
    $('.casino_success').css("color", "#98FB98");
  } else {
    $('.casino_success').css("color", "#ff7f7f");
  }
  $('.casino_incns').text('$' + numberWithCommas(d3.round(dat_casino.ns)));
  if (dat_casino.ns >= 0) {
    $('.casino_incns').css("color", "#98FB98");
  } else {
    $('.casino_incns').css("color", "#ff7f7f");
  }

  $('.gec_success').text(d3.round(dat_gec.success*100) + '%');
  if (dat_gec.success >= .5) {
    $('.gec_success').css("color", "#98FB98");
  } else {
    $('.gec_success').css("color", "#ff7f7f");
  }
  $('.gec_incns').text('$' + numberWithCommas(d3.round(dat_gec.ns)));
  if (dat_gec.ns >= 0) {
    $('.gec_incns').css("color", "#98FB98");
  } else {
    $('.gec_incns').css("color", "#ff7f7f");
  }

  $('.reg_success').text(d3.round(dat_reg.success*100) + '%');
  if (dat_reg.success >= .5) {
    $('.reg_success').css("color", "#98FB98");
  } else {
    $('.reg_success').css("color", "#ff7f7f");
  }
  $('.reg_incns').text('$' + numberWithCommas(d3.round(dat_reg.ns)));
  if (dat_reg.ns >= 0) {
    $('.reg_incns').css("color", "#98FB98");
  } else {
    $('.reg_incns').css("color", "#ff7f7f");
  }
 
});


