(function(root, factor){

	root.DrawTool = factor();

})(this, function(){

function getWidth( dom )
{
	return dom.offsetWidth;
}

function getHeight( dom )
{
	return dom.offsetHeight;
}

function hasClass( dom, className ) 
{
    return (' ' + dom.className + ' ').indexOf(' ' + className + ' ') > -1;
}

function addClass( dom, className )
{
	if( dom.className === undefined )
	{
		dom.className = className;
	}
	else
	{
		dom.className = dom.className + ' ' + className;
	}
}


function removeClass( dom, className ) 
{
	if( hasClass( dom, className ) ) 
	{
		var newClass = ' ' + dom.className.replace(/[\t\r\n]/g, '') + ' ';
		while ( newClass.indexOf(' ' + className + ' ') >= 0 ) 
		{
			newClass = newClass.replace(' ' + className + ' ', ' ');
		}
		dom.className = newClass.replace(/^\s+|\s+$/g, '');
	}
}

function addCanvas( dom )
{
	var canvas = document.createElement( "canvas" );
	canvas.width = getWidth( dom );
	canvas.height = getHeight( dom );
	dom.appendChild( canvas );
	return canvas;
}


var Event = new Object();
Event.on = function( elem, type, fn )
{
	if(elem.addEventListener)
	{
		Event.on = function( elem, type, fn )
		{
			elem.addEventListener( type, fn, false );
		}
	}
	else
	{
		Event.on = function( elem, type, fn )
		{
			elem.attachEvent( 'on'+ type, fn );
		}
	}
	Event.on( elem, type, fn );
}

Event.delegate = function( pdom, className, type, fn )
{
	Event.on( pdom, type, function( e ) {
		var e = e || window.event;
		var target = e.target || e.srcElement;
		if( hasClass( target, className ) )
		{
			fn.call( target, e );
		}
	}, false);
}

Event.off = function( elem, type, fn )
{
	if(elem.removeEventListener)
	{
		Event.off = function( elem, type, fn )
		{
			elem.removeEventListener( type, fn, false );
		}
	}
	else
	{
		Event.off = function( elem, type, fn )
		{
			elem.detachEvent( 'on'+ type, fn );
		}
	}
	Event.off( elem, type, fn );
}


function getMousePos( e )
{
	var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    return { x : x, y : y }
}

function getTargetPos( target, e )
{
	var mousePos = getMousePos( e );
	var targetPos = target.getBoundingClientRect();
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	var x = targetPos.left + scrollX ;
	var y = targetPos.top + scrollY;
	return { x: ( mousePos.x - x ), y : ( mousePos.y -y )}
}


function sightlineTo( ctx, start, end )
{
	ctx.save();
	ctx.beginPath();
	ctx.moveTo( start[0] , start[1] );
	ctx.lineTo( end[0] , end[1] );
	ctx.stroke();

	//箭头部分
	ctx.translate( end[0], end[1] );
	ctx.rotate(Math.atan2( end[1] - start[1], end[0] - start[0] ));
	ctx.lineTo(-15,5);
	ctx.lineTo(-15,-5);
	ctx.lineTo(0,0);
	ctx.fillStyle = "#444";
	ctx.fill();
	ctx.restore();
	return ctx;
}


function bezierlineTo(ctx, p1X, p1Y, p2X, p2Y, p3X, p3Y, p4X, p4Y, nodeRad) 
{
    //(nodeRad+10)加上箭头长度
    var k = (nodeRad+10) / (Math.sqrt((p3X - p4X) * (p3X - p4X) + (p3Y - p4Y) * (p3Y - p4Y))); 
    var innerK = nodeRad / (Math.sqrt((p3X - p4X) * (p3X - p4X) + (p3Y - p4Y) * (p3Y - p4Y)));
    var arrowEndX = p4X + innerK * (p3X - p4X);
    var arrowEndY = p4Y + innerK * (p3Y - p4Y);
    var bezierEndX = p4X + k * (p3X - p4X);
    var bezierEndY = p4Y + k * (p3Y - p4Y);
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(p1X, p1Y);
    ctx.bezierCurveTo(p2X, p2Y, p3X, p3Y, bezierEndX, bezierEndY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p4X, p4Y, nodeRad, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath(); //画箭头
    ctx.translate(arrowEndX, arrowEndY);
    ctx.rotate(Math.atan2(bezierEndY - p3Y, bezierEndX - p3X));
    ctx.moveTo(0, 0);
    ctx.lineTo(-10,3);//箭头大小控制在这
    ctx.lineTo(-7,0);//箭头大小控制在这
    ctx.lineTo(-10,-3);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
};


function drawLineSelected( ctx, p1X, p1Y, p2X, p2Y, p3X, p3Y, p4X, p4Y, nodeRad)
{
	var k = (nodeRad+10) / (Math.sqrt((p3X - p4X) * (p3X - p4X) + (p3Y - p4Y) * (p3Y - p4Y))); 
    var innerK = nodeRad / (Math.sqrt((p3X - p4X) * (p3X - p4X) + (p3Y - p4Y) * (p3Y - p4Y)));
    var arrowEndX = p4X + innerK * (p3X - p4X);
    var arrowEndY = p4Y + innerK * (p3Y - p4Y);
    var bezierEndX = p4X + k * (p3X - p4X);
    var bezierEndY = p4Y + k * (p3Y - p4Y);


    ctx.save();
    ctx.beginPath();
    ctx.lineWidth=10;
    ctx.strokeStyle = "#f00";
    ctx.moveTo(p1X, p1Y);
    ctx.bezierCurveTo(p2X, p2Y, p3X, p3Y, bezierEndX, bezierEndY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p4X, p4Y, nodeRad, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath(); //画箭头
    ctx.lineWidth=1;
    // ctx.strokeStyle = "#000";
    ctx.translate(arrowEndX, arrowEndY);
    ctx.rotate(Math.atan2(bezierEndY - p3Y, bezierEndX - p3X));
    ctx.moveTo(0, 0);
    ctx.lineTo(-10,3);//箭头大小控制在这
    ctx.lineTo(-7,0);//箭头大小控制在这
    ctx.lineTo(-10,-3);
    ctx.lineTo(0, 0);
    ctx.stroke();
    
    // ctx.fill();
    ctx.restore();
    return ctx;
}


/**
 * 此算法只提供选择线条
 */
function isSelected(ctx, p1X, p1Y, p2X, p2Y, p3X, p3Y, p4X, p4Y, nodeRad, pos )
{
	var dδ = 10;//偏移距离
    var d = 10;
    var θ1 = Math.atan(( p2Y - p1Y )/( p2X- p1X ));
    var θ2 = Math.atan(( p4Y - p3Y )/( p4X- p3X ));

    var p1Xd = -1*d*Math.sin( θ1 ) + p1X;
    var p1Yd = d*Math.cos( θ1 ) + p1Y;
    var p2Xd = -1*d*Math.sin( θ1 ) + p2X;
    var p2Yd = d*Math.cos( θ1 ) + p2Y;
    var p3Xd = -1*d*Math.sin( θ2 ) + p3X;
    var p3Yd = d*Math.cos( θ2 ) + p3Y;
    var p4Xd = -1*d*Math.sin( θ2 ) + p4X;
    var p4Yd = d*Math.cos( θ2 ) + p4Y;

    p1Xd = p1Xd + dδ*Math.cos( θ1 );
    p1Yd = p1Yd + dδ*Math.sin( θ1 );
    p4Xd = p4Xd - dδ*Math.cos( θ2 );
    p4Yd = p4Yd - dδ*Math.sin( θ2 );

    var k = (nodeRad+10) / (Math.sqrt((p3Xd - p4Xd) * (p3Xd - p4Xd) + (p3Yd - p4Yd) * (p3Yd - p4Yd))); 
    var innerK = nodeRad / (Math.sqrt((p3Xd - p4Xd) * (p3Xd - p4Xd) + (p3Yd - p4Yd) * (p3Yd - p4Yd)));
    var arrowEndX = p4Xd + innerK * (p3Xd - p4Xd);
    var arrowEndY = p4Yd + innerK * (p3Yd - p4Yd);
    var bezierEndXd = p4Xd + k * (p3Xd - p4Xd);
    var bezierEndYd = p4Yd + k * (p3Yd - p4Yd);
    ctx.save();
    ctx.lineWidth = 0;
    ctx.beginPath();
    ctx.moveTo(p1Xd, p1Yd);
    ctx.bezierCurveTo(p2Xd, p2Yd, p3Xd, p3Yd, bezierEndXd, bezierEndYd);

    var p1Xu = d*Math.sin( θ1 ) + p1X;
    var p1Yu = -1*d*Math.cos( θ1 ) + p1Y;
    var p2Xu = d*Math.sin( θ1 ) + p2X;
    var p2Yu = -1*d*Math.cos( θ1 ) + p2Y;
    var p3Xu = d*Math.sin( θ2 ) + p3X;
    var p3Yu = -1*d*Math.cos( θ2 ) + p3Y;
    var p4Xu = d*Math.sin( θ2 ) + p4X;
    var p4Yu = -1*d*Math.cos( θ2 ) + p4Y;

    p1Xu = p1Xu + dδ*Math.cos( θ1 );
    p1Yu = p1Yu + dδ*Math.sin( θ1 );
    p4Xu = p4Xu - dδ*Math.cos( θ2 );
    p4Yu = p4Yu - dδ*Math.sin( θ2 );


    var k = (nodeRad+10) / (Math.sqrt((p3Xu - p4Xu) * (p3Xu - p4Xu) + (p3Yu - p4Yu) * (p3Yu - p4Yu))); 
    var innerK = nodeRad / (Math.sqrt((p3Xu - p4Xu) * (p3Xu - p4Xu) + (p3Yu - p4Yu) * (p3Yu - p4Yu)));
    var arrowEndX = p4Xu + innerK * (p3Xu - p4Xu);
    var arrowEndY = p4Yu + innerK * (p3Yu - p4Yu);
    var bezierEndXu = p4Xu + k * (p3Xu - p4Xu);
    var bezierEndYu = p4Yu + k * (p3Yu - p4Yu);

    //连线
    ctx.lineTo(bezierEndXd, bezierEndYd);
    ctx.lineTo(bezierEndXu, bezierEndYu);


    ctx.lineTo(bezierEndXu, bezierEndYu);
    ctx.bezierCurveTo(p3Xu, p3Yu, p2Xu, p2Yu, p1Xu, p1Yu);

    ctx.moveTo(p1Xu, p1Yu);
    ctx.lineTo(p1Xd, p1Yd);
    ctx.restore();

    return ctx.isPointInPath(pos[0], pos[1]);
}




function lineTo( ctx, start, end , ctrl1, ctrl2 )
{
	// 画直线
	if( ( !ctrl1 && !ctrl2 )  || ( ctrl1 && ctrl1.length == 0  && ctrl2 && ctrl2.length == 0 ) )
	{
		sightlineTo( ctx, start, end );
	}
	// 画贝塞尔曲线
	else
	{
		if( !ctrl1 || ctrl1.length == 0 )
		{
			ctrl1 = start;
		}
		if( !ctrl2 || ctrl2.length == 0 )
		{
			ctrl2 = end;
		}
		bezierlineTo( ctx, start[0], start[1], ctrl1[0], ctrl1[1], ctrl2[0], ctrl2[1], end[0], end[1], 0);
	}
	
}


function clearCanvas( ctx , canvas )
{
	ctx.clearRect( 0, 0, getWidth( canvas ), getHeight( canvas ) );
}


var Classes = {
	showCss:"drawTool-show",
	hideCss:"drawTool-hide",
	rootCss: "drawTool-content-root",
	nodeCss: "drawTool-node",
	nodeJs: "js-drawTool-node",
	innerNodeJs: "js-drawTool-inner-node",
	anchorCss: "drawTool-anchor",
	anchorJs: "js-drawTool-anchor",
	operateCss: "drawTool-operate",
	operateDeleteCss: "drawTool-operate-delete",
	operateDeleteJs: "js-drawTool-operate-delete",
	operateEditJs: "js-drawTool-operate-edit",
	controller: "drawTool-controller",
	ctrlli: "drawTool-controller-li",
	ctrlJs: "js-drawTool-controller-li"
}


function showDom( dom )
{
	addClass( dom, Classes.showCss );
	removeClass( dom, Classes.hideCss )
}

function hideDom( dom )
{
	addClass( dom, Classes.hideCss );
	removeClass( dom, Classes.showCss )
}



/**
 * 线栈
 */
function LineStack()
{
	this.length = 0;
}

var lineproto = LineStack.prototype;
lineproto.pop = Array.prototype.pop;

lineproto.peek = function()
{
	return this.length > 0
			? this[this.length -1]
			: undefined;
}
lineproto.push = function( line ){
	var maxId = 0;
	for(var i = 0; i < this.length; i++)
	{
		if( this[i].lineid > maxId )
		{
			maxId = this[i].lineid;
		}
	}
	line.lineid = maxId+1;
	Array.prototype.push.call( this, line );
	return line;
}
lineproto.deleteById = function( lineid ){
	for(var i = 0; i < this.length; i++)
	{
		if( this[i].lineid == lineid )
		{
			Array.prototype.splice.call( this, i, 1 );
			break;
		}
	}
}
lineproto.getLineById = function( lineid )
{
	var line = null;
	for(var i = 0; i < this.length; i++)
	{
		var oLine= this[i];
		if( oLine.lineid == lineid )
		{
			line = oLine;
			break;
		}
	}
	return line;
}


/**
 * 节点栈
 */
function NodeStack()
{
	this.length = 0;
}
var nodeproto = NodeStack.prototype;
nodeproto.pop = Array.prototype.pop;
nodeproto.push = function( node ){
	var maxId = 0;
	for(var i = 0; i < this.length; i++)
	{
		if( this[i].nodeid > maxId )
		{
			maxId = this[i].nodeid;
		}
	}
	node.nodeid = maxId+1;
	Array.prototype.push.call( this, node );
}
nodeproto.getNodeById = function( nodeid )
{
	var node = null;
	for(var i = 0; i < this.length; i++)
	{
		var oNode = this[i];
		if( oNode.nodeid == nodeid )
		{
			node = oNode;
			break;
		}
	}
	return node;
}
nodeproto.clear = function()
{
	this.length = 0;
}

function getAnchorPosById( anchorsLists, anchorid )
{
	var pos = [];
	for( var j = 0; j < anchorsLists.length; j++)
	{
		var oAnchor = anchorsLists[j];
		if( hasClass( oAnchor, Classes.anchorJs ) )
		{
			
			if( oAnchor.anchorid == anchorid )
			{
				var x = oAnchor.parentNode.offsetTop + oAnchor.offsetTop + 5;
				var y = oAnchor.parentNode.offsetLeft + oAnchor.offsetLeft + 5;
				pos[1] = x;
				pos[0] = y;
				break;
			}
		}
	}
	return pos;
}


function extend( to, _from ) 
{
	for (var key in _from) 
	{
		to[key] = _from[key];
	}
	return to;
}



function addLineOperate( dom )
{
	var div = document.createElement( "div" );
	div.className = Classes.operateCss;
	div.innerHTML = "<span class='" + Classes.operateDeleteCss + ' ' 
						+ Classes.operateDeleteJs +"'>×</span>"
						+"<span class='" + Classes.operateDeleteCss + ' '
						+ Classes.operateEditJs +"'>+</span>"
	dom.appendChild( div );
	hideDom( div );
	return div;
}


function addAnchors( node )
{
	for( var i = 0; i < node.anchors.length; i++ )
	{
		var anchors = node.anchors[i];
		var anchorNode = document.createElement( "span" );
		anchorNode.className = Classes.anchorCss + " " + Classes.anchorJs;
		anchorNode.style.left = anchors[0] - 5 + "px";
		anchorNode.style.top = anchors[1] - 5 + "px";
		anchorNode.anchorid = i;
		anchorNode.pos = [anchors[0], anchors[1]];
		anchorNode.setAttribute("anchorNode-id", i);
		node.appendChild( anchorNode );
	}
}

function addBezierControl( dom )
{
	var ul = document.createElement( "ul" );
	ul.className = Classes.controller;
	var li1 = document.createElement( "li" );
	li1.className = Classes.ctrlli + ' ' + Classes.ctrlJs;
	li1.ctrlFlag = 1;
	var li2 = document.createElement( "li" );
	li2.className = Classes.ctrlli + ' ' + Classes.ctrlJs;
	li2.ctrlFlag = 2;
	ul.appendChild( li1 );
	ul.appendChild( li2 );
	dom.appendChild( ul );
	hideDom( ul );
	return { ctrl1: li1, ctrl2: li2, ctrl: ul };
}

function divide( start, end , num )
{
	var divideMap = {};
	var δx = ( end[0] - start[0] ) / num;
	var δy = ( end[1] - start[1] ) / num;
	for( var i = 1; i < num; i++ )
	{
		var x = start[0] + i * δx;
		var y = start[1] + i * δy;
		divideMap[i] = [x, y];
	}
	return divideMap;
}


function hasCtrl( line )
{
	var bFlag = true;
	do 
	{
		if(!line)
		{
			bFlag = false;
			break;
		}
		if(!line.ctrl1)
		{
			bFlag = false;
			break;
		}
		if(line.ctrl1.length == 0)
		{
			bFlag = false;
			break;
		}
		if(!line.ctrl2)
		{
			bFlag = false;
			break;
		}
		if(line.ctrl2.length == 0)
		{
			bFlag = false;
			break;
		}
	}while(false)

	return bFlag;
}

//节流优化
function DrawTool( dom )
{
	var _dom = dom;
	var _activeDom = null;
	var _activeCtrl = null;
	var _canvas = null;
	var _ctx = null;
	var _lineStack = new LineStack();
	var _nodeStack = new NodeStack();
	var _activeline = {
		startNodeid : false,
		startAnchorid : false,
		endNodeid : false,
		endAnchorid : false,
		ctrl1:[],
		ctrl2:[]
	}
	var _isSelectedLine = false;
	var _selectedLine = null;
	var _operateLine = null;
	var _lineType = "bezier";
	addClass( _dom , Classes.rootCss );
	_canvas = addCanvas( _dom );
	_ctx = _canvas.getContext( "2d" );
	var _operate = addLineOperate( _dom );
	var _ctrlMap = addBezierControl( _dom );
	var _listenMap = {
		clickLine: new Function(),
		deleteLine: function deleteLine(){
			return true;
		},
		lineTo: function lineTo(){
			return true;
		}
	};

	Event.delegate( _dom, Classes.innerNodeJs, "mousedown", mousedownOnNode);

	Event.delegate( _dom, Classes.anchorJs, "click", clickOnAnchor );

	Event.delegate( _dom, Classes.operateDeleteJs, "click", clickDeleteLine );

	Event.delegate( _dom, Classes.operateEditJs, "click", operateEditLine );

	Event.delegate( _dom, Classes.ctrlJs, "mousedown", mousedownCtrl );
	
	Event.on( _dom, "mousemove", mousemoveOnDom );

	Event.on( _dom, "click", clickOnDom );

	Event.on( _dom, "mouseup", mouseup );

	
	/**
	 * void
	 * 按下控制点，绑定鼠标移动事件
	 */
	function mousedownCtrl( e )
	{
		_activeCtrl = this;
		_activeCtrl.relX = e.clientX - _activeCtrl.offsetLeft;
		_activeCtrl.relY = e.clientY - _activeCtrl.offsetTop;
		Event.on( _dom, "mousemove", mousemoveCtrl );
	}

	
	function mousemoveCtrl( e )
	{
		if( _activeCtrl )
		{
			var x = e.clientX - _activeCtrl.relX;
			var y = e.clientY - _activeCtrl.relY;
			_activeCtrl.style.left = x  + 'px';
			_activeCtrl.style.top  = y  + 'px';
		    _operateLine["ctrl"+_activeCtrl.ctrlFlag] = [
		    	x + _activeCtrl.offsetWidth/2, 
		    	y + _activeCtrl.offsetHeight/2
		    ];
			clearCanvas( _ctx, _canvas );
			linkAllLines();
		}
	}

	function mouseupCtrl( e )
	{
		Event.off( _dom, "mousemove", mousemoveCtrl );
		_activeCtrl = null;
	}


	function operateEditLine()
	{
		_operateLine = _selectedLine;//操作状态的线激活
		_selectedLine = null;//选择线释放
		var lineid = _operateLine.lineid;
		var oLine = _lineStack.getLineById( lineid );
		showDom( _ctrlMap.ctrl );
		hideDom( _operate );
		var ctrl1 = _ctrlMap.ctrl1;
		var ctrl2 = _ctrlMap.ctrl2;
		var c1WidHalf = ctrl1.offsetWidth/2;
		var c1HeiHalf = ctrl1.offsetHeight/2;
		var c2WidHalf = ctrl2.offsetWidth/2;
		var c2HeiHalf = ctrl2.offsetHeight/2;
		//第一次展示的情况
		if( !hasCtrl( oLine ) )
		{
			var allPos = getAllPosByLine( oLine );
			ctrl1.style.left = allPos[1][0] - c1WidHalf + "px";
			ctrl1.style.top = allPos[1][1] - c1HeiHalf + "px";
			ctrl2.style.left = allPos[2][0] - c2WidHalf + "px";
			ctrl2.style.top = allPos[2][1] - c2HeiHalf + "px";
			//设置初始化的贝塞尔角点
			oLine.ctrl1 = [
				allPos[1][0] - c1WidHalf + ctrl1.offsetWidth/2,
				allPos[1][1] - c1HeiHalf + ctrl1.offsetWidth/2
			];
			oLine.ctrl2 = [
				allPos[2][0] - c2WidHalf + ctrl2.offsetWidth/2,
				allPos[2][1] - c2HeiHalf + ctrl2.offsetWidth/2
			];
		}
		else
		{
			ctrl1.style.left = oLine.ctrl1[0] - c1WidHalf  + "px";
			ctrl1.style.top = oLine.ctrl1[1] - c1HeiHalf  + "px";
			ctrl2.style.left = oLine.ctrl2[0] - c2WidHalf  + "px";
			ctrl2.style.top = oLine.ctrl2[1]  - c2HeiHalf  + "px";
		}
	}


	function mousedownOnNode( e )
	{
		var e = e || window.event;
		var target = e.target || e.srcElement;
		_activeDom = target.parentNode;
		_activeDom.relX = e.clientX - _activeDom.offsetLeft;
		_activeDom.relY = e.clientY - _activeDom.offsetTop;
		Event.on( _dom, "mousemove", mousemove );
	}

	function clickOnAnchor( e )
	{
		Event.on( _dom, "mousemove", mousemoveline );
		var pos = getTargetPos( _canvas, e);
		var nodeid = e.target.parentNode.nodeid;
		var anchorid = e.target.anchorid;
		if( _activeline.startNodeid )
		{
			var isLineTo = _listenMap.lineTo.call( this, _activeline );
			if( isLineTo )
			{
				_activeline.endNodeid = nodeid;
				_activeline.endAnchorid = anchorid;
				_activeline.lineType = _lineType;
				var line = _lineStack.push( _activeline );
				_activeline = {};
			}
			else
			{
				_activeline.startNodeid = null;
				_activeline.startAnchorid = null;
			}
			clearCanvas( _ctx , _canvas );
			linkAllLines( _ctx, _lineStack );
		}
		else
		{
			_activeline.startNodeid = nodeid;
			_activeline.startAnchorid = anchorid;
		}
	}

	function clickDeleteLine( e )
	{
		var lineid = _selectedLine.lineid;
	 	var isDelete = _listenMap.deleteLine.call( this, _selectedLine );
	 	if( isDelete )
	 	{
	 		_lineStack.deleteById( lineid );
			hideDom( _operate );
			clearCanvas( _ctx , _canvas );
			linkAllLines( _ctx, _lineStack );
	                _selectedLine = null;//释放选中线条
	 	}
		
	}

	function mousemoveOnDom( e )
	{
		var x = e.pageX - _canvas.getBoundingClientRect().left;
        var y = e.pageY - _canvas.getBoundingClientRect().top;
		drawSelectedLine();
        selectedLineHover( x, y );
		linkAllLines();
	}

	function clickOnDom( e )
	{
		//点击空白才隐藏线
		if(_canvas != e.target)
		{
			return;
		}
		_selectedLine = getSelectedLineByEvt( e );//选择线
		if(_selectedLine)
		{
			var pos = getTargetPos( _dom,  e );
			_operate.style.left = pos.x + "px";
			_operate.style.top = pos.y + "px";
			_isSelectedLine = true;
			_listenMap.clickLine.call( this, _selectedLine );//选中线的切面
			showDom( _operate );
		}
		else
		{
			hideDom( _operate );
			hideDom( _ctrlMap.ctrl );
		}
		linkAllLines();
	}


	function mousemoveline( e )
	{
		var topoNodeStart = _nodeStack.getNodeById( _activeline.startNodeid );
		if( !topoNodeStart )
		{
			return;
		}
		var startAnchorsLists = topoNodeStart.childNodes;
		var start = getAnchorPosById( startAnchorsLists, _activeline.startAnchorid );
		var end = getTargetPos( _canvas, e);
		var divideMap = divide( start, [end.x, end.y] , 3 );
		clearCanvas( _ctx , _canvas );
		lineTo( _ctx, start, [end.x, end.y], divideMap[1], divideMap[2] );
		linkAllLines();
	}

	function mousemove( e )
	{
		if( _activeDom )
		{
		    _activeDom.style.cursor = "move";
			_activeDom.style.left = e.clientX - _activeDom.relX + 'px';
			_activeDom.style.top  = e.clientY - _activeDom.relY + 'px';
			clearCanvas( _ctx, _canvas );
			linkAllLines();
		}
	}

	function mouseup( e )
	{
		mouseupActiveDom( e );
		mouseupCtrl( e );
	}

	function mouseupActiveDom( e )
	{
		Event.off( _dom, "mousemove", mousemove );
		_activeDom = null;
	}


	function linkAllLines()
	{
		for( var i = 0; i < _lineStack.length; i++ )
		{
			var oLine = _lineStack[i];
			var allPos = getAllPosByLine( oLine );
			var ctrl1 = oLine.ctrl1;
			var ctrl2 = oLine.ctrl2;
			lineTo( _ctx, allPos.start, allPos.end, ctrl1, ctrl2 );
		}
	}


	function drawSelectedLine()
	{
		if(_selectedLine)
		{
			var oLine = _selectedLine;
			var allPos = getAllPosByLine( oLine );
	        drawLineSelected(
	        	_ctx, 
				allPos.start[0], 
				allPos.start[1], 
				oLine.ctrl1&&oLine.ctrl1.length==2?oLine.ctrl1[0]:allPos[1][0],
				oLine.ctrl1&&oLine.ctrl1.length==2?oLine.ctrl1[1]:allPos[1][1], 
				oLine.ctrl2&&oLine.ctrl2.length==2?oLine.ctrl2[0]:allPos[2][0], 
				oLine.ctrl2&&oLine.ctrl2.length==2?oLine.ctrl2[1]:allPos[2][1], 
				allPos.end[0], 
				allPos.end[1], 
				0
	        )
		}
	}


	function getSelectedLineByEvt( e )
	{
		var x = e.pageX - _canvas.getBoundingClientRect().left;
        var y = e.pageY - _canvas.getBoundingClientRect().top;
        return selectedLineHover( x, y );
	}

	function selectedLineHover( x, y )
	{
		var resLine = null;
		for( var i = 0; i < _lineStack.length; i++ )
		{
			var oLine = _lineStack[i];
			var allPos = getAllPosByLine( oLine );
			var isSelect = isSelected( 
				_ctx, 
				allPos.start[0], 
				allPos.start[1], 
				oLine.ctrl1&&oLine.ctrl1.length==2?oLine.ctrl1[0]:allPos[1][0],
				oLine.ctrl1&&oLine.ctrl1.length==2?oLine.ctrl1[1]:allPos[1][1], 
				oLine.ctrl2&&oLine.ctrl2.length==2?oLine.ctrl2[0]:allPos[2][0], 
				oLine.ctrl2&&oLine.ctrl2.length==2?oLine.ctrl2[1]:allPos[2][1], 
				allPos.end[0], 
				allPos.end[1], 
				0,
				[x, y]
			)
			// 判断是否选中线，并把线返回
			if( isSelect )
			{
				//这是保证hover事件
		        drawLineSelected(
		        	_ctx, 
					allPos.start[0], 
					allPos.start[1], 
					oLine.ctrl1&&oLine.ctrl1.length==2?oLine.ctrl1[0]:allPos[1][0],
					oLine.ctrl1&&oLine.ctrl1.length==2?oLine.ctrl1[1]:allPos[1][1], 
					oLine.ctrl2&&oLine.ctrl2.length==2?oLine.ctrl2[0]:allPos[2][0], 
					oLine.ctrl2&&oLine.ctrl2.length==2?oLine.ctrl2[1]:allPos[2][1], 
					allPos.end[0], 
					allPos.end[1], 
					0
		        );
		        // _listenMap.clickLine( oLine );//点击切面
		        resLine = oLine;
		        break;
		    }
		    else
		    {
		    	clearCanvas( _ctx , _canvas );
		    }
		}
		return resLine;
	}


	function getAllPosByLine( oLine )
	{
		var topoNodeStart = _nodeStack.getNodeById( oLine.startNodeid );
		var topoNodeEnd = _nodeStack.getNodeById( oLine.endNodeid );
		var startAnchorsLists = topoNodeStart.childNodes;
		var endAnchorsLists = topoNodeEnd.childNodes;
		var start = getAnchorPosById( startAnchorsLists, oLine.startAnchorid );
		var end = getAnchorPosById( endAnchorsLists, oLine.endAnchorid );
		var divideMap = divide( start, end , 3 );
		var resMap = extend({ start: start, end: end }, divideMap );
		return resMap;
	}


	/*
	{
		pos:{x:0,y:0},
		html:"<div>盒子</div>"
	}
	*/
	this.addNode = function ( nodeCfg )
	{
		var node = document.createElement( "div" );
		node.className = Classes.nodeCss + " " + Classes.nodeJs;
		node.style.left = nodeCfg.pos.x + "px";
		node.style.top = nodeCfg.pos.y + "px";
		node.innerHTML = nodeCfg.html;
		var innerNode = node.children[0];
		innerNode.className = Classes.innerNodeJs;
		node.anchors = nodeCfg.anchors;
		_dom.appendChild( node );
		_nodeStack.push( node );
		addAnchors( node );
		return node;
	}

	this.getAllNodesInfo = function ()
	{
		var nodeStack = [];
		for (var i = 0; i < _nodeStack.length; i++) 
		{
			var node = _nodeStack[i];
			var oNode = {
				html: node.innerHTML,
				nodeid: node.nodeid
			}
			nodeStack.push( oNode );

		}
		return nodeStack;
	}

	this.getAllNodes = function ()
	{
		return _nodeStack;
	}

	this.getAllLines = function ()
	{
		return _lineStack;
	}

	this.listen = function( listenMap )
	{
		_listenMap = extend( _listenMap, listenMap );
	}

	this.init = function( nodeStack, lineStack )
	{
		_nodeStack.clear();
		for( var i = 0; i < nodeStack.length; i++)
		{
			var node = nodeStack[i];
			_dom.appendChild( node );
			_nodeStack.push( node );
			addAnchors( node );
		}
		
	}
}


return DrawTool;

});