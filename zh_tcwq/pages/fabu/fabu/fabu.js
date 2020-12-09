var app = getApp();
Page({
    data: {
        index: 0,
        base: !1,
		 imgbox: [],//选择图片
		  fileIDs: [],//上传云存储后的返回值
    },
	uploader:function(){
	var that=this;
	
	let imagesList=[];
	
	let maxSize=1024*1024;
	
	let maxLength=3;
	
	let flag=true;
	
	wx.chooseImage({
	count: 6, //最多可以选择的图片总数
	
	sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
	
	sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	
	success: function(res) {
	wx.showToast({
	title: '正在上传...',
	
	icon: 'loading',
	
	mask: true,
	
	duration: 500
	
	})
	
	for(let i=0;i<res.tempFiles.length;i++){
	if(res.tempFiles[i].size>maxSize){
	flag=false;
	
	console.log(111)
	
	wx.showModal({
	content: '图片太大，不允许上传',
	
	showCancel: false,
	
	success: function (res) {
	if (res.confirm) {
	console.log('用户点击确定')
	
	}
	
	}
	
	});
	
	}
	
	 
	
	}
	
	if (res.tempFiles.length>maxLength){
	console.log('222');
	
	wx.showModal({
	content: '最多能上传'+maxLength+'张图片',
	
	showCancel:false,
	
	success:function(res){
	if(res.confirm){
	console.log('确定');
	
	}
	
	}
	
	})
	
	}
	
	if (flag == true && res.tempFiles.length <= maxLength){
	that.setData({
	imagesList: res.tempFilePaths
	
	})
	
	}
	
	wx.uploadFile({
	url: 'https://shop.gxyourui.cn',
	
	filePath: res.tempFilePaths[0],
	
	name: 'images',
	
	header: {
	"Content-Type": "multipart/form-data",
	
	'Content-Type': 'application/json'
	
	},
	
	success:function(data){
	console.log(data);
	
	},
	
	fail:function(data){
	console.log(data);
	
	}
	
	})
	
	console.log(res);
	
	},
	
	fail:function(res){
	console.log(res);
	
	}
	
	})
	
	},
	// 删除照片 &&
	 imgDelete1: function (e) {
	  let that = this;
	  let index = e.currentTarget.dataset.deindex;
	  let imgbox = this.data.imgbox;
	  imgbox.splice(index, 1)
	  that.setData({
	   imgbox: imgbox
	  });
	 },
	 // 选择图片 &&&
	 addPic1: function (e) {
	  var imgbox = this.data.imgbox;
	  console.log(imgbox)
	  var that = this;
	  var n = 5;
	  if (5 > imgbox.length > 0) {
	   n = 5 - imgbox.length;
	  } else if (imgbox.length == 5) {
	   n = 1;
	  }
	  wx.chooseImage({
	   count: n, // 默认9，设置图片张数
	   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	   success: function (res) {
	    // console.log(res.tempFilePaths)
	    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
	    var tempFilePaths = res.tempFilePaths
	 
	    if (imgbox.length == 0) {
	     imgbox = tempFilePaths
	    } else if (5 > imgbox.length) {
	     imgbox = imgbox.concat(tempFilePaths);
	    }
	    that.setData({
	     imgbox: imgbox
	    });
	   }
	  })
	 },
	 
	 //图片
	 imgbox: function (e) {
	  this.setData({
	   imgbox: e.detail.value
	  })
	 },
	 
	 
	 //发布按钮
	 fb: function (e) {
	  if (!this.data.imgbox.length) {
	   wx.showToast({
	    icon: 'none',
	    title: '图片类容为空'
	   });
	  } else {
	    //上传图片到云存储
	    wx.showLoading({
	     title: '上传中',
	    })
	    let promiseArr = [];
	    for (let i = 0; i < this.data.imgbox.length; i++) {
	     promiseArr.push(new Promise((reslove, reject) => {
	      let item = this.data.imgbox[i];
	      let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名
	      wx.cloud.uploadFile({
	       cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
	       filePath: item, // 小程序临时文件路径
	       success: res => {
	        this.setData({
	         fileIDs: this.data.fileIDs.concat(res.fileID)
	        });
	        console.log(res.fileID)//输出上传后图片的返回地址
	        reslove();
	        wx.hideLoading();
	        wx.showToast({
	         title: "上传成功",
	        })
	       },
	       fail: res=>{
	        wx.hideLoading();
	        wx.showToast({
	         title: "上传失败",
	        })
	       }
	 
	      })
	     }));
	    }
	    Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
	     console.log("图片上传完成后再执行")
	     this.setData({
	      imgbox:[]
	     })
	    })
	 
	   }
	 },
	 
    onLoad: function(a) {
        app.pageOnLoad(this), app.setNavigationBarColor(this), this.reload();
    },
    reload: function(a) {
        var e = this, t = wx.getStorageSync("System");
        console.log(t);
        var n = wx.getStorageSync("url");
        e.setData({
            url: n,
            pt_name: t.pt_name,
            System: wx.getStorageSync("System")
        }), app.util.request({
            url: "entry/wxapp/type",
            cachetime: "0",
            success: function(a) {
                console.log(a);
                var t = a.data;
                e.setData({
                    nav: t
                });
            }
        });
    },
    settled: function(a) {
        wx.navigateTo({
            url: "../../settled/settled",
            success: function(a) {},
            fail: function(a) {},
            complete: function(a) {}
        });
    },
    formid_one: function(a) {
        console.log("搜集第一个formid"), console.log(a), app.util.request({
            url: "entry/wxapp/SaveFormid",
            cachetime: "0",
            data: {
                user_id: wx.getStorageSync("users").id,
                form_id: a.detail.formId,
                openid: wx.getStorageSync("openid")
            },
            success: function(a) {}
        });
    },
    bindPickerChange: function(a) {
        console.log(a);
        var t = this, e = t.data.id, n = a.detail.value, o = t.data.nav[t.data.index].array[n];
        for (var i in t.data.nav[t.data.index].array) if (o == t.data.nav[t.data.index].arrays[i].name) var d = t.data.nav[t.data.index].arrays[i].id, r = t.data.nav[t.data.index].arrays[i].type_id, s = t.data.nav[t.data.index].money;
        console.log(t.data.nav[t.data.index]), wx.navigateTo({
            url: "../edit/edit?info=" + o + "&id=" + e + "&type_id=" + d + "&money=" + s + "&type2_id=" + r
        });
    },
    edit: function(a) {
        var t = this;
        console.log(a);
        var e = a.currentTarget.dataset.index, n = a.currentTarget.dataset.id, o = t.data.nav[e].money + "," + t.data.nav[e].money2, i = [], d = wx.getStorageSync("users").id;
        console.log(o), app.util.request({
            url: "entry/wxapp/FtXz",
            cachetime: "0",
            data: {
                user_id: d
            },
            success: function(a) {
                console.log(a, d), "今天发帖次数已经超限!" == a.data ? wx.showModal({
                    title: "提示",
                    content: "今天发帖次数已经超限!"
                }) : app.util.request({
                    url: "entry/wxapp/type2",
                    cachetime: "0",
                    data: {
                        id: n
                    },
                    success: function(a) {
                        console.log(a), 0 != a.data.length ? (a.data.map(function(a) {
                            var t;
                            t = a.name, i.push(t);
                        }), console.log(i), t.setData({
                            array: i,
                            arrays: a.data,
                            base: !0,
                            type_id: n,
                            money: o
                        })) : wx.navigateTo({
                            url: "../edit/edit?id=" + t.data.id + "&type_id=" + n + "&money=" + o + "&type2_id=0"
                        });
                    }
                });
            }
        });
    },
    cancel: function(a) {
        this.setData({
            base: !1
        });
    },
    selected: function(a) {
        var t = this, e = t.data.arrays, n = a.currentTarget.id, o = t.data.type_id, i = e[n].id, d = e[n].name, r = t.data.money;
        t.setData({
            base: !1
        }), wx.navigateTo({
            url: "../edit/edit?type2_id=" + i + "&type_id=" + o + "&money=" + r + "&info=" + d
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});