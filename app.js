/*isc.Button.create({
	title:"Add Row",
	width: 200,
	click: addRow
});

function btnShow() {
	hiddenBtn.show();
}; */

RPCManager.allowCrossDomainCalls = true;
// Canvas.resizeControls(5);
Canvas.resizeFonts(3);


isc.DataSource.create({
	ID: "quelleDS",
	//total: 500,
	dataURL: "http://glibrary.ct.infn.it:3500/v2/repos/dariah/quelle",
	//preventHTTPCaching: false,

	requestProperties: {
		httpHeaders: {
			"content-type": "application/json",
		}
	},
	transformRequest: function(dsRequest) {
		// var params = {
    // 	start : dsRequest.startRow,
    //   end : dsRequest.endRow
    // };

		dsRequest.httpHeaders["Authorization"] = access_token;
		dsRequest.actionURL = this.dataURL + "?filter[limit]=" + dsRequest.dataPageSize + "&filter[skip]=" + dsRequest.startRow + "&include_count=true";
		//console.log("dsRequest", dsRequest);
		console.log("criteria", dsRequest.resultSet.getCriteria());

		var criteria = dsRequest.resultSet.getCriteria();
		var criteria = {titel: "Material", autor: "Eugen"};
		var where = "";
		if (criteria) {
			for (key in criteria) {
				where = where + "&filter[where][" + key + "][like]=%25" + encodeURIComponent(criteria[key]) + "%25";
			}
			dsRequest.actionURL = dsRequest.actionURL + where;
		}
		//console.log(where);
		console.log(dsRequest.actionURL);
		//return dsRequest.data;
	},
	transformResponse: function(dsResponse, dsRequest, data) {
		//console.log();
		dsResponse.totalRows = data.total;
		dsResponse.data = data.data;
		this.fields = [{ name: 'id', type: 'integer', hidden: true },
	  { name: 'tmphash' },
	  { name: 'gesamtwerkId', type: 'integer' }];

		//console.log('dsResponse', dsResponse);
	},

	dataFormat: "json",
	fields: [
        { name: 'id', type: 'integer', detail: true },
	    { name: 'tmphash', detail: true },
        { name: 'gesamtwerkId', type: 'integer', detail: true },
        { name: 'typId', type: 'integer', detail: true },
        { name: 'veroeffentlicht', type: 'integer', detail: true },
        { name: 'titel', autoFitWidth: true },
		{ name: 'autor', autoFitWidth: true },
        { name: 'untertitel', autoFitWidth: true  },
        { name: 'bandtitel' },
        { name: 'baende', type: 'integer' },
        { name: 'band' },
        { name: 'reihentitel',  autoFitWidth: true  },
        { name: 'reihennummer' },
        { name: 'auflage' },
        { name: 'nachdruck', detail: true },
        { name: 'erscheinungsort', detail: true },
        { name: 'erscheinungsjahr', type: 'integer', detail: true },
        { name: 'erstauflage', detail: true },
        { name: 'erscheinungszeitvon', type: 'integer', detail: true },
        { name: 'erscheinungszeitbis', type: 'integer', detail: true },
        { name: 'verlag', detail: true },
        { name: 'isbn', detail: true },
        { name: 'seiten', type: 'integer', detail: true },
        { name: 'seitenvonbis', detail: true },
        { name: 'seitenstruktur', detail: true },
        { name: 'hyperlink', detail: true },
        { name: 'hyperlinkDatum', type: 'datetime', detail: true },
        { name: 'exzerpiert', type: 'integer', detail: true },
        { name: 'belegmaterial', type: 'integer', detail: true },
        { name: 'bezugszeitraum', detail: true },

        { name: 'bearbeiter' },
        { name: 'herausgeber' },
        { name: 'herausgeberreihe' },
        { name: 'kurzzitat' },
        { name: 'kurzzitatSort' },
        { name: 'langzitat' },
        { name: 'verweiszitat', detail: true },
        { name: 'zitatseite', type: 'integer', detail: true },
        { name: 'zitatspalte', type: 'integer', detail: true },
        { name: 'zitatversion', type: 'integer', detail: true },
        { name: 'zitatohneseite', type: 'integer', detail: true },
        { name: 'zitatjahr', type: 'integer', detail: true },
        { name: 'zitatjahrgang', type: 'integer', detail: true },
        { name: 'zitatband', type: 'integer', detail: true },
        { name: 'klassifikation', detail: true },
        { name: 'originaldaten', detail: true },
        { name: 'freigabe', type: 'integer', detail: true },
        { name: 'checked', type: 'integer', detail: true },
        { name: 'wordleiste', type: 'integer', detail: true },
        { name: 'druck', type: 'integer', detail: true },
        { name: 'online', type: 'integer', detail: true },
        { name: 'publiziert', type: 'integer', detail: true },
        { name: 'anmerkung', detail: true },
        { name: 'zugeordnet', type: 'integer', detail: true }
	]
});

var access_token = null;

function login(_callback) {
	var data = JSON.stringify({ username: "dariahadmin", password: "d4r142016"});
 	isc.RPCManager.sendRequest({
		data: data,
		useSimpleHttp: true,
		contentType: "application/json",
		actionURL: "http://glibrary.ct.infn.it:3500/v2/users/login",
		callback: function (response, data) {
			if (response.status != 0) {
				console.log(response.data.response.data);
				response.errors = response.data.response.data;
				_callback({success: false});
				return;
			}
			access_token = JSON.parse(data).id;
			//console.log("sessione:", JSON.parse(data).id);
			//quelleDS.requestProperties.httpHeaders["Authorization"] = access_token;
			//console.log(todolistDS.requestProperties.httpHeaders);
			if (_callback) {
				_callback({success: true});
			}
		}
	});
}


if (!access_token) {
	login(function(e) {
		if (e.success) {
			//populateQuelle();
			quelle.fetchData();
		}
	})
} else {
	//populateQuelle();
	quelle.fetchData();
}


/* Not needed anymore: we implemented a server side method that returns the number of rows that match a query
function populateQuelle() {

	RPCManager.sendRequest({
		actionURL: "http://glibrary.ct.infn.it:3500/v2/repos/dariah/quelle/_count",
		httpHeaders: {"Authorization": access_token},
		httpMethod: "GET",
		callback: function(res, data) {
			quelleDS.total = JSON.parse(data).total;
			quelle.fetchData();
			//console.log(JSON.parse(data).total);
		}
	});
} */

function getRelatedMultimediaList(id) {
	RPCManager.sendRequest({
		actionURL: "http://glibrary.ct.infn.it:3500/v2/repos/dariah/quelle/" + id + "/quelle_multimedia_liste",
		httpHeaders: {"Authorization": access_token},
		httpMethod: "GET",
		useSimpleHttp: true,
		callback: function(res, data) {
			var multimedia_list = JSON.parse(data).quelle_multimedia_liste;
			console.log(multimedia_list);
			if (multimedia_list.length > 0) {
				var multimediaId = multimedia_list[0].multimediaId;
				getMultimediaSource(multimediaId);
			}

		}
	});
}

function getMultimediaSource(multimediaId) {
	RPCManager.sendRequest({
		actionURL: "http://glibrary.ct.infn.it:3500/v2/repos/dariah/multimedia/" + multimediaId,
		httpHeaders: {"Authorization": access_token},
		httpMethod: "GET",
		useSimpleHttp: true,
		callback: function(res, data) {
			var source = JSON.parse(data).source;
			console.log("Multimedia Source: ", source);
			getAssets(source);
		}
	});
}

function getAssets(source) {
	RPCManager.sendRequest({
		actionURL: "http://glibrary.ct.infn.it:3500/v2/repos/dariah/assets?filter[where][path][like]=" + source,
		httpHeaders: {"Authorization": access_token},
		httpMethod: "GET",
		useSimpleHttp: true,
		callback: function(res, data) {
			var assets = JSON.parse(data);
			if (assets.length) {
				// for (var i=0; i < assets.length; i++) {
				// 	console.log(assets[i].id, assets[i].path);
				// }
				asset_list.setData(assets);
			} else {
				console.log("No assets found");
			}
		}
	});
}


isc.Img.create({
	ID: "image_wrapper",
	height: "100%"
});

isc.Window.create({
	ID: "preview",
	title: "Preview Window",
	canDragResize: true,
	canDragPosition: true,
	width:"50%", height:"90%",
	// top: 100,
	// left: 100,
	right: 0,
	visibility: "hidden",
	headerControls : ["headerIcon","headerLabel",isc.Button.create({
		layoutAlign:"center",
		title:"Download",
		click: function() {
			location.href = image_wrapper.src.replace("&inline", "");
			//console.log(image_wrapper.src);
		}
	}), "minimizeButton", "maximizeButton", "closeButton"],
	//autoSize: true,
	autoCenter: true,
	showMaximizeButton: true,
	showModalMask: true,
	showFooter: true,
	layoutMargin: 10,
	items: [image_wrapper, isc.Button.create({
		autoFit: true,
		title: "Save as the correct asset for the current lemma",
		layoutAlign: "right",
		margin: 5,
		height: 40,
		click: function() {
			isc.confirm("Are you sure", function(value) {
				if (value) {
					console.log("value", value);
					var quelle_id = quelle.getSelectedRecord().id;
					var asset_id = asset_list.getSelectedRecord().id;
					//console.log(asset_list.getSelectedRecord());
					//console.log(quelle.getSelectedRecord());
					saveCorrectAssetForLemma(quelle_id, asset_id);
				}
			});
		}
	})]
	//src: url + "&inline"
	// items:
	// 	isc.Img.create({
	// 		imageStyle: "center",
	// 		src: url,
	// 		autodraw: false
	// 	})

});

function getAssociatedAsset(quelle_id, _callback) {
	RPCManager.sendRequest({
		actionURL: 'http://glibrary.ct.infn.it:3500/v2/repos/dariah/assets?filter={"where":{"quelle_id":'+ quelle_id + '}}',
		httpHeaders: {"Authorization": access_token},
		useSimpleHttp: true,
		httpMethod: "GET",
		dataFormat: "json",
		callback: function(res, data) {
			if (res.httpResponseCode == 200) {
				var data = JSON.parse(data);
				if (data.length > 0) {
					_callback(data);
				} else {
					_callback(null);
				}
			}
		}
	});
}


function saveCorrectAssetForLemma(quelle_id, asset_id) {
	RPCManager.sendRequest({
		actionURL: "http://glibrary.ct.infn.it:3500/v2/repos/dariah/assets/" + asset_id,
		httpHeaders: {"Authorization": access_token, "content-type": "application/json"},
		httpMethod: "PUT",
		data: JSON.stringify({"quelle_id": quelle_id}),
		useSimpleHttp: true,
		callback: function(res, data) {
			if (res.httpResponseCode == 200) {
					isc.say("Successfully saved!")
			}

		}
	});
}


function getAssetTempURL(id) {
	RPCManager.sendRequest({
		actionURL: "http://glibrary.ct.infn.it:3500/v2/repos/dariah/assets/" + id + "/_replicas",
		httpHeaders: {"Authorization": access_token},
		httpMethod: "GET",
		callback: function(res, data) {
			var replica_id = JSON.parse(data)[0].id;
				RPCManager.sendRequest({
					downloadResult: true,
					actionURL: "http://glibrary.ct.infn.it:3500/v2/repos/dariah/assets/" + id + "/_replicas/" + replica_id + "?no_redirect=true",
					httpHeaders: {"Authorization": access_token},
					httpMethod: "GET",
					callback: function(res, data) {
						var url = JSON.parse(data).url;
						console.log("Download URL", url);

						image_wrapper.setSrc("");
						preview.show();
						image_wrapper.setSrc(url + "&inline");
						preview.setAutoSize(true);


						//preview.autoSize = true;
						//location.href = url;
						//window.open(url);
						//downloadAsset(url);
					}
				});
		}
	});
}


function downloadAsset(url) {
	RPCManager.sendRequest({
		downloadResult: true,
		downloadToNewWindow: true,
		actionURL: url,
		useSimpleHttp: true,
		httpMethod: "GET",
		callback: function(res, data, request) {
			console.log(res);
			console.log(request);
		}
	});
}

isc.ListGrid.create({
	ID: "quelle",
	//left: 10,
	//top: 50,
	// width: "100%",
    // height: "100%",

	dataSource: "quelleDS",
	autoFetchData: false,
	canEdit: false,
	dataPageSize: 50,
	showFilterEditor: true,
    autoDraw: false,
    showResizeBar: true,
    alternateRecordStyles: true,
    selectionType:"single",
	//headerContextMenu: true
	//filterOnKeypress: true,
	//allowFilterOperators: true
    recordClick: function() {
        var record = this.getSelectedRecord();
        detailView.setData(record);
		console.log("selected record-> ", record.id);
		getAssociatedAsset(record.id, function(assets) {
			if (assets) {
				//console.log(asset);
				asset_list.setData(assets);
				showAllBtn.setDisabled(false);
			} else {
				getRelatedMultimediaList(record.id);
				showAllBtn.setDisabled(true);
			}
		});
		
    }
});

isc.ListGrid.create({
   ID: "asset_list",
   autoDraw: false,
   height: "30%",
   fields: [
		{ name: "category", title: "Category"},
	   	{ name: "filetype", title: "File Type"},
		{ name: "filename", title: "File Name"},
		{ name: "path", title: "Container Path", autoFitWidth: true},
		{ name: "filesize", title: "File Size", type: "number"},
		{ name: "uploaddate", title: "Upload Date", type: "date"}
   ],
   recordClick: function() {
	   var record = this.getSelectedRecord();
	   console.log(record);
	   getAssetTempURL(record.id)
   }
});

isc.DetailViewer.create({
    ID:"detailView",
    autoDraw:false,
    dataSource:"quelleDS",
    width:"30%",
    margin:"5",
    showDetailFields: true,
    canPickFields: true,
    showEmptyField: false,
    margin: 10,
    emptyMessage:"Select an item to view its details"
});

isc.VLayout.create({
    ID: "mainView",
    autoDraw: false,
    showResizeBar: true,
    members: [quelle, asset_list, isc.Button.create({
		ID: "showAllBtn",
		title: "Show all", 
		layoutAlign:"right",
		disabled: true, 
		margin: 5, 
		height: 35,
		click: function() {
			var record = quelle.getSelectedRecord();
			getRelatedMultimediaList(record.id);
		}}
	)]
});


isc.HLayout.create({
    ID:"pageLayout",
    width:"100%",
    height:"100%",
    autoDraw: true,
    layoutMargin: 10,
    members: [mainView, detailView]
});