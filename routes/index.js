
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


exports.kaal = function(req, res){
	var data={title:'kaal',name:'arif',country:'bd'};
	res.render('kaal', data);
};