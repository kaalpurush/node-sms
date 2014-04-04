var config = {
	Mongo:{
		db:'sms',
		host:"127.0.0.1:27017",
        connection:"mongodb://127.0.0.1:27017/sms"
	},
	default_sms_gateway:'SilverStreet',
	default_sms_sender:'Bengalsols',
	Synergy:{
		api_key:'',
		api_secret:''
	},
	Airtel:{
        api_key:'',
        api_secret:''
	},
    SilverStreet:{
        api_key:'',
        api_secret:''
    }	
};

module.exports = config;
