var app = getApp();

Page({
	data: {
		"textareaHtml":'',
"textarea":false,
"textareaView":true,
		"status": 0,
		"dataindx":'',
		"set": [
			{
			"name": "名称",
			"type": "text",
			"xuan": null,
			"isok": "1",
			"value":"刘大姐"
		}, {
			"name": "性别",
			"type": "radio",
			"xuan": [
					{'value': '0', 'name': '男'},
				    {'value': '1', 'name': '女', 'checked': 'true'},
				    
			],
			"isok": "1"
		}, {
			"name": "城市",
			"type": "select",
			"xuan": ["北京", "上海", "天津"],
			"isok": "0",
			"value":2
		}, {
			"name": "备注",
			"type": "textarea",
			"xuan": null,
			"isok": "0",
			"value":"你是事实上事实上"
		}, {
			"name": "年龄",
			"type": "number",
			"xuan": null,
			"isok": "0",
			"value":34
		}, {
			"name": "爱好",
			"type": "checkbox",
			"xuan": [
				{'value': '0', 'name': '苹果'},
				{'value': '1', 'name': '橘子', 'checked': 'true'},
				{'value': '0', 'name': '香蕉'},
				
			],
			"isok": "0"
		}]

	},
	textChang:function(e){
		
		this.setData({
			'textareaView':false,
			"textarea":true,
		})
	},
	textBlur:function(e){
		debugger;
		this.setData({
			'textareaView':true,
			"textarea":false,
			"textareaHtml":e.detail.value
		})
	},
	onLoad: function(t) {
		let n= this;
		  let op_ip =wx.getStorageSync("openid")
		app.util.request({
				      url: "entry/wxapp/FormInfo",
				     data:{
						 openid:op_ip
					 },
					   success: function(e) {
							  n.setData({
								  "status":e.data.status,
								  "set":e.data.set
							  })
					   }
		})
	
		

	},
	 bindPickerChange: function(e) {
	    console.log('picker发送选择改变，携带值为', e.detail.value)
	    this.setData({
	      dataindx: e.detail.value
	    })
	  },

	  formSubmit(e) {
		  var o = this;
		  let op_ip =wx.getStorageSync("openid")
		 
		  console.log(op_ip)
		  let arr= [];
		 for (let key in e.detail.value) {
		       // 每遍历一次，就创建一个字典对象
		       let dict = {};
		       dict[key] = e.detail.value[key];
		       arr.push(dict);
		     }
		  app.util.request({
		      url: "https://picunshenghuo.hqkjbj.com/app/index.php?i=2&c=entry&a=wxapp&do=tjInfo&m=zh_tcwq",
		      
		      data: {
		          openid: op_ip,
				  info:JSON.stringify(e.detail.value)
		      },
			  method: 'POST',
			    header: { 'content-type': 'application/x-www-form-urlencoded' },
		      success: function(e) {
		  		o.data = e;
				  wx.showToast({
				       title:"编辑成功 ",
				       icon: 'success...',//图标，支持"success"、"loading" 
				       duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
				       mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false 
				     })
				
		      }
		  })
	      console.log('form发生了submit事件，携带数据为：arr'+e.detail.value, )
	    }
	 ,
	onReady: function() {},
	onShow: function() {},
	onHide: function() {},
	onUnload: function() {
		wx.removeStorageSync("bzinfo");
	},
	onPullDownRefresh: function() {},
	onReachBottom: function() {}
});
