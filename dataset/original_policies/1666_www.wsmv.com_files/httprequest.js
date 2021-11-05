if(typeof(wng_includesTracker)=='undefined'){var wng_includesTracker={};}wng_includesTracker['/global/interface/httprequest/httprequest.js']=1;if(!wng_includesTracker['/global/interface/globals.js']){var wng_includesDomain='';var wng_includesVersion='';try{wng_includesDomain=wng_pageInfo.contentDomain;wng_includesVersion=wng_pageInfo.includesVersion;}catch(e){wng_includesDomain='http://content.worldnow.com';wng_includesVersion='20070120';}document.writeln('<scr'+'ipt type="text/javascript" src="'+wng_includesDomain+'/global/interface/globals.js?ver='+wng_includesVersion+'"></scr'+'ipt>');}var wng_doc=document;var WNHttpRequestManager=function(){var _PROXY_URL='/global/interface/httprequest/hrproxy.asp';var _PROXY_PARAM_URL='url';var _METHODS={GET:1,HEAD:1,POST:1,PUT:1,DELETE:1};var _METHOD_DEFAULT='GET';var _POST_MIMETYPE_DEFAULT='application/x-www-form-urlencoded';var _XMLPARSER_LIBVERSIONS=[['MSXML2','3.0'],['MSXML2','2.6'],['Microsoft','']];var _RESPONSE_HEADERS_DELIMITER=new RegExp(':\\s+|\\n','g');var _READYSTATE_HANDLERS={onSuccess:true,onError:true,onCompleted:4,onInteractive:3,onLoaded:2,onLoading:1,onUninitialized:0};var _encodeURIComponent=(typeof(encodeURIComponent)!='undefined')?encodeURIComponent:escape;function _convertXMLParserObjectType(libraryName,objectType){if(libraryName!='Microsoft'){return objectType;}switch(objectType){case 'DOMDocument':{return 'XMLDOM';break;}case 'FreeThreadedDOMDocument':{return 'FreeThreadedXMLDOM';break;}case 'DSOControl':{return 'XMLDSO';break;}default:{return objectType;break;}}}function _getProgId(libraryName,objectType,version){var progId='';if(libraryName&&objectType){progId=libraryName+'.'+objectType;if(version){progId+='.'+version;}}return progId;}function _getXMLParserActiveXControl(objectType){if(!objectType||!window.ActiveXObject){return;}var libraryName=_getXMLParserActiveXControl.libraryName;if(libraryName){objectType=_convertXMLParserObjectType(libraryName,objectType);return new ActiveXObject(_getProgId(libraryName,objectType,_getXMLParserActiveXControl.version));}var libVersion,libraryName,version,tempObjectType,xmlHttp,xmlParserObj;for(var i=0,v=_XMLPARSER_LIBVERSIONS,l=v.length;i<l;i++){libVersion=v[i],libraryName=libVersion[0],version=libVersion[1];try{tempObjectType=_convertXMLParserObjectType(libraryName,objectType);xmlParserObj=new ActiveXObject(_getProgId(libraryName,tempObjectType,version));_getXMLParserActiveXControl.libraryName=libraryName;_getXMLParserActiveXControl.version=version;return xmlParserObj;}catch(e){}}}function _getXMLHttpRequest(){var request=null;try{if(window.XMLHttpRequest){request=new XMLHttpRequest();}else{request=_getXMLParserActiveXControl('XMLHTTP');}}catch(e){request=null;}return request;}function _loadXMLDocFromString(text){var xmlDoc=null;if(text){if(window.DOMParser){var parser=new DOMParser();xmlDoc=parser.parseFromString(text,'text/xml');if(xmlDoc.documentElement.nodeName=='parsererror'){xmlDoc=null;}}else{xmlDoc=_getXMLParserActiveXControl('DOMDocument');if(xmlDoc){xmlDoc.async=false;loaded=xmlDoc.loadXML(text);if(!loaded){xmlDoc=null;}}}}return xmlDoc;}function _setRequestHeaders(request,headers){try{for(var header in headers){request.setRequestHeader(header,headers[header]);}}catch(e){}}function _extractResponseHeaders(headersText){var values=headersText.split(_RESPONSE_HEADERS_DELIMITER);var headers={};var l=headers.length;if(l){var i=0;do{headers[values[i++]]=values[i++];}while(i<l);}return headers;}function _XMLHttpResponse(request){this.status=request.status;this.statusText=request.statusText;this.responseText=request.responseText;responseXML=request.responseXML;if(!responseXML||!responseXML.documentElement){responseXML=_loadXMLDocFromString(this.responseText);}this.responseXML=responseXML;this._headersText=request.getAllResponseHeaders();this._headers=null;}_XMLHttpResponse.prototype={getResponseHeader:function(header){if(!this._headers){this._headers=_extractResponseHeaders(this._headersText);}return this._headers[header];},getAllResponseHeaders:function(){return this._headersText;}};function _XMLHttpWrapper(url,options){this.url=url;this.setOptions(options);this._statesHandled={};var self=this;this._handleRequestChange=function(){try{var readyState=self.request.readyState;}catch(e){self.onRequestError(e);}switch(readyState){case 0:{self._performCallback('onUninitialized');break;}case 1:{self._performCallback('onLoading');break;}case 2:{self._performCallback('onLoaded');break;}case 3:{self._performCallback('onInteractive');break;}case 4:{self._onRequestStateCompleted();break;}}};}_XMLHttpWrapper.prototype={PROXY_URL:_PROXY_URL,setOptions:function(options){if(typeof(options)!='object'||options instanceof Array){options={};}options.async=true;if(!_METHODS[options.method]){options.method=_METHOD_DEFAULT;}if(!options.requestHeaders){options.requestHeaders={};}if(options.method=='POST'){if(!options.postData){options.postData='';}if(!options.requestHeaders['Content-Type']){options.requestHeaders['Content-Type']=_POST_MIMETYPE_DEFAULT;}}if(!options.parameters){options.parameters='';}this.options=options;},getRequestUrl:function(){var url=this.url,useProxy=false;if(!url||typeof(url)!='string'){return null;}var domainStart=url.indexOf('//'),slashIndex=url.indexOf('/'),urlLen=url.length;var hostEnd=(slashIndex>-1)?slashIndex:urlLen;if(domainStart>-1||(url.substring(0,hostEnd)).indexOf('.')>-1){var protocol=url.substring(0,url.indexOf(':')+1);if(protocol&&protocol!=window.location.protocol){useProxy=true;}else{var domainEnd=url.indexOf('/',domainStart+2);domainStart=(domainStart!=-1)?domainStart+2:0,domainEnd=(domainEnd!=-1)?domainEnd:urlLen;var domain=url.substring(domainStart,domainEnd);if(window.location.host!=domain){useProxy=true;}}}var separator=(url.indexOf('?')==-1)?'?':'&';var options=this.options;if(options.method=='GET'){var parameters=this.getRequestParameters();if(parameters.length){url+=separator+parameters;}}var fullUrl='';if(useProxy){url=_encodeURIComponent(url);fullUrl+=this.PROXY_URL;var separator=(fullUrl.indexOf('?')==-1)?'?':'&';var parameters=this.getRequestParameters('proxyParameters');if(parameters.length){fullUrl+=separator+parameters;separator='&';}fullUrl+=separator+_PROXY_PARAM_URL+'=';}fullUrl+=url;var separator=(fullUrl.indexOf('?')==-1)?'?':'&';fullUrl+=separator+'rand='+(Math.floor(Math.random()*999999));return fullUrl;},getRequestParameters:function(type){var parameters=(type!='proxyParameters')?this.options['parameters']:this.options['proxyParameters'];var paramsTypeOf=typeof(parameters);var paramsStr='';if(parameters&&paramsTypeOf=='string'){var params=parameters.split('&');for(var i=0,l=params.length,param;i<l;i++){param=params[i].split('=');paramsStr+='&'+_encodeURIComponent(param[0])+'='+_encodeURIComponent(param[1]);}}else if(paramsTypeOf=='object'&&!(parameters instanceof Array)){for(var key in parameters){paramsStr+='&'+_encodeURIComponent(key)+'='+_encodeURIComponent(parameters[key]);}}if(paramsStr){paramsStr=paramsStr.substr(1);}return paramsStr;},makeRequest:function(){try{var request=_getXMLHttpRequest();if(request){var url=this.getRequestUrl();if(url){this.request=request;var options=this.options,method=options.method,headers=options.requestHeaders;var content=null;if(method=='POST'){content=options.postData;if(headers.mimetype==_POST_MIMETYPE_DEFAULT){var parameters=this.getRequestParameters();if(parameters){if(content){content+='&';}content+=parameters;}}headers['Content-Length']=content.length;headers['Connection']='close';}request.onreadystatechange=this._handleRequestChange;if(typeof(WNClosureTracker)!='undefined'){WNClosureTracker.add(this.request,'onreadystatechange',true);WNClosureTracker.add(this,'request');}request.open(method,url,options.async);_setRequestHeaders(request,headers);request.send(content);}else{throw new Error('Invalid request url');}}else{throw new Error('XMLHTTPRequest not supported by this browser');}}catch(e){this.onRequestError(e);}},_performCallback:function(name){try{if(this._statesHandled[name]){return;}this._statesHandled[name]=true;var callback=this.options[name];if(callback){var handler,args=[];if(typeof(callback)=='function'){handler=callback;}else if(callback instanceof Array){handler=callback[0];if(callback.length>1){args=callback[1];}}else if(typeof(callback)=='object'){handler=callback.callback;if(typeof(callback.args)!='undefined'){args=callback.args;}}if(!(args instanceof Array)){args=[args];}if(arguments.length>1){var al=args.length;for(var i=1,l=arguments.length;i<l;i++){args[al++]=arguments[i];}}if(typeof(handler)=='function'){if(handler.apply){handler.apply(this,args);}else{var arg;for(var i=0,l=args.length,arg;i<l;i++){arg=args[i];if(typeof(arg)=='string'){args[i]="'"+arg+"'";}}eval('handler('+args.toString()+')');}}}}catch(e){if(name!='onError'){this.onRequestError(e);}else{}}},onRequestError:function(e){this.errorMessage=(e.message||e);this._performCallback('onError',e);},_onRequestStateCompleted:function(){try{if(this._statesHandled['onCompleted']){return;}this.response=new _XMLHttpResponse(this.request);this._performCallback('onCompleted');var status=this.response.status;delete this.request['onreadystatechange'];this.request=null;if(status==200||status==304){this._performCallback('onSuccess');}else{throw new Error('XMLHTTPRequest status was '+status);}}catch(e){this.onRequestError(e);}}};var Manager={Handlers:{},makeRequest:function(url,options){var xmlHttpRequest=new _XMLHttpWrapper(url,options);xmlHttpRequest.makeRequest();return xmlHttpRequest;},transferNodeData:function(parent,nodeName,target){var result=false;try{var source=parent.getElementsByTagName(nodeName);source=(source.length)?source[0]:this.retrieveChildElement(parent,nodeName);if(source){var hasInnerHTML=typeof(target.innerHTML)!='undefined';var nLen=source.childNodes.length;if(hasInnerHTML&&nLen==1){target.innerHTML=source.firstChild.nodeValue;result=true;}else if(hasInnerHTML&&typeof(source.xml)!='undefined'&&nLen){if(nLen==1){target.innerHTML=source.firstChild.xml;}else{var htmlStr='';var child=source.firstChild;if(child){do{htmlStr+=child.xml;}while(child=child.nextSibling);}target.innerHTML=htmlStr;}result=true;}else{try{target.appendChild(wng_doc.importNode(source,true));result=true;}catch(e){}}}}catch(e){}if(!result&&target&&target.style){target.style.display='none';}return result;},retrieveChildElement:function(parent,nodeName){if(!parent.childNamesIndex){parent.childNamesIndex={_index:0};}var namesIndex=parent.childNamesIndex;var nIndex=(!recalculate)?namesIndex._index:0;var nodes=parent.childNodes,nLen=nodes.length;if(nIndex===nLen){var cIndex=namesIndex[nodeName];return(typeof(cIndex)=='number')?nodes[cIndex]:null;}var node;while(nIndex<nLen){node=nodes[nIndex];if(node.nodeType===1){namesIndex[node.nodeName]=nIndex;if(node.nodeName===nodeName){break;}}nIndex++;}namesIndex._index=nIndex;parent.childNamesIndex=namesIndex;var cIndex=namesIndex[nodeName];return(typeof(cIndex=='number'))?nodes[cIndex]:null;}};Manager.Handlers.RSS=function(){var _RSS_TARGET_DEFAULT='_blank';var _RSS_REQUIRED_NODES_DEFAULT={link:1,title:1};function _createItemStructure(target){var item=wng_doc.createElement('DIV');item.className='rssItem';var href=wng_doc.createElement('A');href.setAttribute('target',target);item.appendChild(href);var desc=wng_doc.createElement('DIV');desc.className='rssItemDesc';item.appendChild(desc);return item;}return{onSuccess:function(targetId,options){try{if(!options){options={};}var wrapper=wng_doc.getElementById(targetId);if(options.clearTarget){var child=wrapper.firstChild;while(child){wrapper.removeChild(child);child=wrapper.firstChild;}}var xmlDoc=this.response.responseXML;var nodes=xmlDoc.documentElement.getElementsByTagName('item'),nLen=nodes.length;if(nLen==0&&options.hideEmpty){return;}var limit=options.limit;if(typeof(limit)!='number'||limit>nLen){limit=nLen;}var bucket=wng_doc.createElement('DIV');bucket.className='rssBucket';var header=wng_doc.createElement('DIV');header.className='rssHeader';var oHeader=options.header;if(oHeader){if(typeof(header.innerHTML)!='undefined'){header.innerHTML=oHeader;}else{oHeader=(oHeader.nodeType)?oHeader.cloneNode(true):wng_doc.createTextNode(oHeader);header.appendChild(oHeader);}}var footer=wng_doc.createElement('DIV');footer.className='rssFooter';var oFooter=options.footer;if(oFooter){if(typeof(footer.innerHTML)!='undefined'){footer.innerHTML=oFooter;}else{oFooter=(oFooter.nodeType)?oFooter.cloneNode(true):wng_doc.createTextNode(oFooter);footer.appendChild(oFooter);}}var items=wng_doc.createElement('DIV');items.className='rssItems';var displayWhileLoading=options.displayWhileLoading;if(displayWhileLoading){bucket.appendChild(header);bucket.appendChild(items);wrapper.appendChild(bucket);}var itemClone=_createItemStructure(options.target||_RSS_TARGET_DEFAULT);var requiredNodes=options.requiredNodes||_RSS_REQUIRED_NODES_DEFAULT;var transfer=WNHttpRequestManager.transferNodeData;var retrieve=WNHttpRequestManager.retrieveChildElement;for(var i=0,node,item,linkVal;i<limit;i++){node=nodes[i];item=itemClone.cloneNode(true);linkVal=node.getElementsByTagName('link');linkVal=(linkVal.length)?linkVal[0]:retrieve(node,'link');linkVal=(linkVal)?linkVal.firstChild:null;if(linkVal&&linkVal.nodeValue){item.firstChild.setAttribute('href',linkVal.nodeValue);}else if(requiredNodes['link']){continue;}if(!transfer(node,'title',item.firstChild)&&requiredNodes['title']){continue;}if(!transfer(node,'description',item.lastChild)&&requiredNodes['description']){continue;}items.appendChild(item);}if(!displayWhileLoading){bucket.appendChild(header);bucket.appendChild(items);}bucket.appendChild(footer);if(!displayWhileLoading){wrapper.appendChild(bucket);}}catch(e){this.onRequestError(e);}},onError:function(targetId,options,e){try{if(!options){options={};}if(options.hideTarget){var wrapper=wng_doc.getElementById(targetId);wrapper.style.display='none';}}catch(e){}}};}();return Manager;}();