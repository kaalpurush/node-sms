var config = {
	mongo:{
		db:'sms',
		host:"192.168.0.26:27017",
        connection:"mongodb://192.168.0.26:27017/sms"
	},
	synergy:{
		api_key:'',
		api_secret:''
	},
	airtel:{
        api_key:'',
        api_secret:''
	}
};

module.exports = config;
