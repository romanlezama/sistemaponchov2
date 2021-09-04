! function(e, t, o) {
 function s(e) {
  for (var t = [], o = 0, s = e.length; s > o; o++) t[e[o]] = o;
  return t
 }

 function i(e, t, o) {
  var s = e.splice(t, 1)[0];
  e.splice(o, 0, s)
 }

 function a(e, t, o) {
  for (var s = [], i = 0, a = e.childNodes.length; a > i; i++) 1 == e.childNodes[i].nodeType && s.push(e.childNodes[i]);
  var n = s[t];
  null !== o ? e.insertBefore(n, s[o]) : e.appendChild(n)
 }
 e.fn.dataTableExt.oApi.fnColReorder = function(t, o, n) {
  var r, d, l, h, u, f, m = t.aoColumns.length;
  if (o != n) {
   if (0 > o || o >= m) return void this.oApi._fnLog(t, 1, "ColReorder 'from' index is out of bounds: " + o);
   if (0 > n || n >= m) return void this.oApi._fnLog(t, 1, "ColReorder 'to' index is out of bounds: " + n);
   var g = [];
   for (r = 0, d = m; d > r; r++) g[r] = r;
   i(g, o, n);
   var p = s(g);
   for (r = 0, d = t.aaSorting.length; d > r; r++) t.aaSorting[r][0] = p[t.aaSorting[r][0]];
   if (null !== t.aaSortingFixed)
    for (r = 0, d = t.aaSortingFixed.length; d > r; r++) t.aaSortingFixed[r][0] = p[t.aaSortingFixed[r][0]];
   for (r = 0, d = m; d > r; r++)
    for (f = t.aoColumns[r], l = 0, h = f.aDataSort.length; h > l; l++) f.aDataSort[l] = p[f.aDataSort[l]];
   for (r = 0, d = m; d > r; r++) f = t.aoColumns[r], "number" == typeof f.mData && (f.mData = p[f.mData], f.fnGetData = t.oApi._fnGetObjectDataFn(f.mData), f.fnSetData = t.oApi._fnSetObjectDataFn(f.mData));
   if (t.aoColumns[o].bVisible) {
    var c = this.oApi._fnColumnIndexToVisible(t, o),
     C = null;
    for (r = o > n ? n : n + 1; null === C && m > r;) C = this.oApi._fnColumnIndexToVisible(t, r), r++;
    for (u = t.nTHead.getElementsByTagName("tr"), r = 0, d = u.length; d > r; r++) a(u[r], c, C);
    if (null !== t.nTFoot)
     for (u = t.nTFoot.getElementsByTagName("tr"), r = 0, d = u.length; d > r; r++) a(u[r], c, C);
    for (r = 0, d = t.aoData.length; d > r; r++) null !== t.aoData[r].nTr && a(t.aoData[r].nTr, c, C)
   }
   for (i(t.aoColumns, o, n), i(t.aoPreSearchCols, o, n), r = 0, d = t.aoData.length; d > r; r++) e.isArray(t.aoData[r]._aData) && i(t.aoData[r]._aData, o, n), i(t.aoData[r]._anHidden, o, n);
   for (r = 0, d = t.aoHeader.length; d > r; r++) i(t.aoHeader[r], o, n);
   if (null !== t.aoFooter)
    for (r = 0, d = t.aoFooter.length; d > r; r++) i(t.aoFooter[r], o, n);
   for (r = 0, d = m; d > r; r++) t.aoColumns[r].aDataSort = [r], t.aoColumns[r]._ColReorder_iOrigCol = r, e(t.aoColumns[r].nTh).unbind("click"), this.oApi._fnSortAttachListener(t, t.aoColumns[r].nTh, r);
   "undefined" != typeof ColVis && ColVis.fnRebuild(t.oInstance), e(t.oInstance).trigger("column-reorder", [t, {
    iFrom: o,
    iTo: n,
    aiInvertMapping: p
   }]), "undefined" != typeof t.oInstance._oPluginFixedHeader && t.oInstance._oPluginFixedHeader.fnUpdate()
  }
 }, ColReorder = function(e, t) {
  return this.CLASS && "ColReorder" == this.CLASS || alert("Warning: ColReorder must be initialised with the keyword 'new'"), "undefined" == typeof t && (t = {}), this.s = {
   dt: null,
   init: t,
   allowReorder: !0,
   allowResize: !0,
   fixed: 0,
   dropCallback: null,
   mouse: {
    startX: -1,
    startY: -1,
    offsetX: -1,
    offsetY: -1,
    target: -1,
    targetIndex: -1,
    fromIndex: -1
   },
   aoTargets: []
  }, this.dom = {
   drag: null,
   resize: null,
   pointer: null
  }, this.table_size = -1, this.s.dt = e.oInstance.fnSettings(), this._fnConstruct(), e.oApi._fnCallbackReg(e, "aoDestroyCallback", jQuery.proxy(this._fnDestroy, this), "ColReorder"), ColReorder.aoInstances.push(this), this
 }, ColReorder.prototype = {
  fnReset: function() {
   for (var e = [], t = 0, o = this.s.dt.aoColumns.length; o > t; t++) e.push(this.s.dt.aoColumns[t]._ColReorder_iOrigCol);
   this._fnOrderColumns(e)
  },
  _fnConstruct: function() {
   var e, t, o = this;
   for ("undefined" != typeof this.s.init.allowReorder && (this.s.allowReorder = this.s.init.allowReorder), "undefined" != typeof this.s.init.allowResize && (this.s.allowResize = this.s.init.allowResize), "undefined" != typeof this.s.init.iFixedColumns && (this.s.fixed = this.s.init.iFixedColumns), "undefined" != typeof this.s.init.fnReorderCallback && (this.s.dropCallback = this.s.init.fnReorderCallback), e = 0, t = this.s.dt.aoColumns.length; t > e; e++) e > this.s.fixed - 1 && this._fnMouseListener(e, this.s.dt.aoColumns[e].nTh), this.s.dt.aoColumns[e]._ColReorder_iOrigCol = e;
   this.s.dt.oApi._fnCallbackReg(this.s.dt, "aoStateSaveParams", function(e, t) {
    o._fnStateSave.call(o, t)
   }, "ColReorder_State");
   var i = null;
   if ("undefined" != typeof this.s.init.aiOrder && (i = this.s.init.aiOrder.slice()), this.s.dt.oLoadedState && "undefined" != typeof this.s.dt.oLoadedState.ColReorder && this.s.dt.oLoadedState.ColReorder.length == this.s.dt.aoColumns.length && (i = this.s.dt.oLoadedState.ColReorder), i)
    if (o.s.dt._bInitComplete) {
     var a = s(i);
     o._fnOrderColumns.call(o, a)
    } else {
     var n = !1;
     this.s.dt.aoDrawCallback.push({
      fn: function() {
       if (!o.s.dt._bInitComplete && !n) {
        n = !0;
        var e = s(i);
        o._fnOrderColumns.call(o, e)
       }
      },
      sName: "ColReorder_Pre"
     })
    }
  },
  _fnOrderColumns: function(t) {
   if (t.length != this.s.dt.aoColumns.length) return void this.s.dt.oInstance.oApi._fnLog(oDTSettings, 1, "ColReorder - array reorder does not match known number of columns. Skipping.");
   for (var o = 0, s = t.length; s > o; o++) {
    var a = e.inArray(o, t);
    o != a && (i(t, a, o), this.s.dt.oInstance.fnColReorder(a, o))
   }("" !== this.s.dt.oScroll.sX || "" !== this.s.dt.oScroll.sY) && this.s.dt.oInstance.fnAdjustColumnSizing(), this.s.dt.oInstance.oApi._fnSaveState(this.s.dt)
  },
  _fnStateSave: function(t) {
   var o, s, i, a = this.s.dt;
   for (o = 0; o < t.aaSorting.length; o++) t.aaSorting[o][0] = a.aoColumns[t.aaSorting[o][0]]._ColReorder_iOrigCol;
   for (aSearchCopy = e.extend(!0, [], t.aoSearchCols), t.ColReorder = [], o = 0, s = a.aoColumns.length; s > o; o++) i = a.aoColumns[o]._ColReorder_iOrigCol, t.aoSearchCols[i] = aSearchCopy[o], t.abVisCols[i] = a.aoColumns[o].bVisible, t.ColReorder.push(i)
  },
  _fnMouseListener: function(t, o) {
   var s = this;
   e(o).unbind("mousemove.ColReorder"), e(o).unbind("mousedown.ColReorder"), this.s.allowResize && e(o).bind("mousemove.ColReorder", function(t) {
    if (null === s.dom.drag && null === s.dom.resize) {
     var o = "TH" == t.target.nodeName ? t.target : e(t.target).parents("TH")[0],
      i = e(o).offset(),
      a = e(o).innerWidth();
     e(o).css(Math.abs(t.pageX - Math.round(i.left + a)) <= 5 ? {
      cursor: "col-resize"
     } : {
      cursor: "pointer"
     })
    }
   }), e(o).bind("mousedown.ColReorder", function(e) {
    return s._fnMouseDown.call(s, e, o, t), !1
   })
  },
  _fnMouseDown: function(t, s, i) {
   var a = this,
    n = this.s.dt.aoColumns;
   if ("col-resize" == e(s).css("cursor")) {
    this.s.mouse.startX = t.pageX, this.s.mouse.startWidth = e(s).width(), this.s.mouse.resizeElem = e(s);
    var r = e(s).next();
    this.s.mouse.nextStartWidth = e(r).width(), a.dom.resize = !0, this.s.dt.aoColumns[i].bSortable = !1, this.s.dt.oFeatures.bAutoWidth = !1
   } else if (this.s.allowReorder) {
    a.dom.resize = null;
    var d = "TH" == t.target.nodeName ? t.target : e(t.target).parents("TH")[0],
     l = e(d).offset();
    this.s.mouse.startX = t.pageX, this.s.mouse.startY = t.pageY, this.s.mouse.offsetX = t.pageX - l.left, this.s.mouse.offsetY = t.pageY - l.top, this.s.mouse.target = s, this.s.mouse.targetIndex = e("th", s.parentNode).index(s), this.s.mouse.fromIndex = this.s.dt.oInstance.oApi._fnVisibleToColumnIndex(this.s.dt, this.s.mouse.targetIndex), this.s.aoTargets.splice(0, this.s.aoTargets.length), this.s.aoTargets.push({
     x: e(this.s.dt.nTable).offset().left,
     to: 0
    });
    for (var h = 0, i = 0, u = n.length; u > i; i++) i != this.s.mouse.fromIndex && h++, n[i].bVisible && this.s.aoTargets.push({
     x: e(n[i].nTh).offset().left + e(n[i].nTh).outerWidth(),
     to: h
    });
    0 !== this.s.fixed && this.s.aoTargets.splice(0, this.s.fixed)
   }
   e(o).bind("mousemove.ColReorder", function(e) {
    a._fnMouseMove.call(a, e, i)
   }), e(o).bind("mouseup.ColReorder", function(e) {
    setTimeout(function() {
     a._fnMouseUp.call(a, e, i)
    }, 10)
   })
  },
  _fnMouseMove: function(t, o) {
   var s;
   if (s = "" === this.s.dt.oInit.sScrollX ? !1 : !0, this.table_size < 0 && s && void 0 != e("div.dataTables_scrollHead", this.s.dt.nTableWrapper) && e("div.dataTables_scrollHead", this.s.dt.nTableWrapper).length > 0 && (this.table_size = e(e("div.dataTables_scrollHead", this.s.dt.nTableWrapper)[0].childNodes[0].childNodes[0]).width()), this.dom.resize) {
    var i = this.s.mouse.resizeElem,
     a = e(i).next(),
     n = t.pageX - this.s.mouse.startX;
    0 == n || s || e(a).width(this.s.mouse.nextStartWidth - n), e(i).width(this.s.mouse.startWidth + n), s && void 0 != e("div.dataTables_scrollHead", this.s.dt.nTableWrapper) && e("div.dataTables_scrollHead", this.s.dt.nTableWrapper).length > 0 && e(e("div.dataTables_scrollHead", this.s.dt.nTableWrapper)[0].childNodes[0].childNodes[0]).width(this.table_size + n);
    var r;
    if (null != e("div.dataTables_scrollBody") && e("div.dataTables_scrollBody").length > 0) {
     var d;
     for (r = -1, d = -1; d < this.s.dt.aoColumns.length - 1 && d != o; d++) this.s.dt.aoColumns[d + 1].bVisible && r++;
     tableScroller = e("div.dataTables_scrollBody", this.s.dt.nTableWrapper)[0], scrollingTableHead = e(tableScroller)[0].childNodes[0].childNodes[0].childNodes[0], 0 == n || s || e(e(scrollingTableHead)[0].childNodes[r + 1]).width(this.s.mouse.nextStartWidth - n), e(e(scrollingTableHead)[0].childNodes[r]).width(this.s.mouse.startWidth + n), s && e(e(tableScroller)[0].childNodes[0]).width(this.table_size + n)
 	 // Modificación 1
 	 tableScrollerHead = e("div.dataTables_scrollBody", this.s.dt.nTableWrapper)[0], scrollingTableHead = e(tableScrollerHead)[0].childNodes[0].childNodes[1].childNodes[0], 0 == n || s || e(e(scrollingTableHead)[0].childNodes[r + 1]).width(this.s.mouse.nextStartWidth - n), e(e(scrollingTableHead)[0].childNodes[r]).width(this.s.mouse.startWidth + n), s && e(e(tableScrollerHead)[0].childNodes[0]).width(this.table_size + n)
 	 // Termina modificación 1
    }
    // Modificación 2
    if (null != e("div.dataTables_scrollFootInner") && e("div.dataTables_scrollFootInner").length > 0) {
     var d;
     for (r = -1, d = -1; d < this.s.dt.aoColumns.length - 1 && d != o; d++) this.s.dt.aoColumns[d + 1].bVisible && r++;
     tableScroller = e("div.dataTables_scrollFootInner", this.s.dt.nTableWrapper)[0], scrollingTableHead = e(tableScroller)[0].childNodes[0].childNodes[0].childNodes[0], 0 == n || s || e(e(scrollingTableHead)[0].childNodes[r + 1]).width(this.s.mouse.nextStartWidth - n), e(e(scrollingTableHead)[0].childNodes[r]).width(this.s.mouse.startWidth + n), s && e(e(tableScroller)[0].childNodes[0]).width(this.table_size + n)
    }
    // Termina modificación 2
   } else if (this.s.allowReorder) {
    if (null === this.dom.drag) {
     if (Math.pow(Math.pow(t.pageX - this.s.mouse.startX, 2) + Math.pow(t.pageY - this.s.mouse.startY, 2), .5) < 5) return;
     this._fnCreateDragNode()
    }
    this.dom.drag.style.left = t.pageX - this.s.mouse.offsetX + "px", this.dom.drag.style.top = t.pageY - this.s.mouse.offsetY + "px";
    for (var l = !1, h = 1, u = this.s.aoTargets.length; u > h; h++)
     if (t.pageX < this.s.aoTargets[h - 1].x + (this.s.aoTargets[h].x - this.s.aoTargets[h - 1].x) / 2) {
      this.dom.pointer.style.left = this.s.aoTargets[h - 1].x + "px", this.s.mouse.toIndex = this.s.aoTargets[h - 1].to, l = !0;
      break
     }
    l || (this.dom.pointer.style.left = this.s.aoTargets[this.s.aoTargets.length - 1].x + "px", this.s.mouse.toIndex = this.s.aoTargets[this.s.aoTargets.length - 1].to)
   }
  },
  _fnMouseUp: function(t, s) {
   if (e(o).unbind("mousemove.ColReorder"), e(o).unbind("mouseup.ColReorder"), null !== this.dom.drag) o.body.removeChild(this.dom.drag), o.body.removeChild(this.dom.pointer), this.dom.drag = null, this.dom.pointer = null, this.s.dt.oInstance.fnColReorder(this.s.mouse.fromIndex, this.s.mouse.toIndex), ("" !== this.s.dt.oScroll.sX || "" !== this.s.dt.oScroll.sY) && this.s.dt.oInstance.fnAdjustColumnSizing(), null !== this.s.dropCallback && this.s.dropCallback.call(this), this._fnConstruct(), this.s.dt.oInstance.oApi._fnSaveState(this.s.dt);
   else if (null !== this.dom.resize) {
    var i, a, n, r, d;
    if (this.s.dt.aoColumns[s].bSortable = !0, this.s.dt.aoColumns[s].sWidth = e(this.s.mouse.resizeElem).innerWidth() + "px", d = "" === this.s.dt.oInit.sScrollX ? !1 : !0, !d) {
     for (n = s + 1; n < this.s.dt.aoColumns.length && !this.s.dt.aoColumns[n].bVisible; n++);
     for (r = s - 1; r >= 0 && !this.s.dt.aoColumns[r].bVisible; r--);
     if (this.s.dt.aoColumns.length > n) this.s.dt.aoColumns[n].sWidth = e(this.s.mouse.resizeElem).next().innerWidth() + "px";
     else
      for (a = this.s.mouse.resizeElem, i = r; i > 0; i--) this.s.dt.aoColumns[i].bVisible && (a = e(a).prev(), this.s.dt.aoColumns[i].sWidth = e(a).innerWidth() + "px")
    }
    d && void 0 != e("div.dataTables_scrollHead", this.s.dt.nTableWrapper) && e("div.dataTables_scrollHead", this.s.dt.nTableWrapper).length > 0 && (this.table_size = e(e("div.dataTables_scrollHead", this.s.dt.nTableWrapper)[0].childNodes[0].childNodes[0]).width()), this.s.dt.oInstance.oApi._fnSaveState(this.s.dt)
   }
   this.dom.resize = null
  },
  _fnCreateDragNode: function() {
   var t = this;
   for (this.dom.drag = e(this.s.dt.nTHead.parentNode).clone(!0)[0], this.dom.drag.className += " DTCR_clonedTable"; this.dom.drag.getElementsByTagName("caption").length > 0;) this.dom.drag.removeChild(this.dom.drag.getElementsByTagName("caption")[0]);
   for (; this.dom.drag.getElementsByTagName("tbody").length > 0;) this.dom.drag.removeChild(this.dom.drag.getElementsByTagName("tbody")[0]);
   for (; this.dom.drag.getElementsByTagName("tfoot").length > 0;) this.dom.drag.removeChild(this.dom.drag.getElementsByTagName("tfoot")[0]);
   e("thead tr:eq(0)", this.dom.drag).each(function() {
    e("th:not(:eq(" + t.s.mouse.targetIndex + "))", this).remove()
   }), e("tr", this.dom.drag).height(e("tr:eq(0)", t.s.dt.nTHead).height()), e("thead tr:gt(0)", this.dom.drag).remove(), e("thead th:eq(0)", this.dom.drag).each(function() {
    this.style.width = e("th:eq(" + t.s.mouse.targetIndex + ")", t.s.dt.nTHead).width() + "px"
   }), this.dom.drag.style.position = "absolute", this.dom.drag.style.zIndex = 1200, this.dom.drag.style.top = "0px", this.dom.drag.style.left = "0px", this.dom.drag.style.width = e("th:eq(" + t.s.mouse.targetIndex + ")", t.s.dt.nTHead).outerWidth() + "px", this.dom.pointer = o.createElement("div"), this.dom.pointer.className = "DTCR_pointer", this.dom.pointer.style.position = "absolute", "" === this.s.dt.oScroll.sX && "" === this.s.dt.oScroll.sY ? (this.dom.pointer.style.top = e(this.s.dt.nTable).offset().top + "px", this.dom.pointer.style.height = e(this.s.dt.nTable).height() + "px") : (this.dom.pointer.style.top = e("div.dataTables_scroll", this.s.dt.nTableWrapper).offset().top + "px", this.dom.pointer.style.height = e("div.dataTables_scroll", this.s.dt.nTableWrapper).height() + "px"), o.body.appendChild(this.dom.pointer), o.body.appendChild(this.dom.drag)
  },
  _fnDestroy: function() {
   for (var t = 0, o = ColReorder.aoInstances.length; o > t; t++)
    if (ColReorder.aoInstances[t] === this) {
     ColReorder.aoInstances.splice(t, 1);
     break
    }
   e(this.s.dt.nTHead).find("*").unbind(".ColReorder"), this.s.dt.oInstance._oPluginColReorder = null, this.s = null
  }
 }, ColReorder.aoInstances = [], ColReorder.fnReset = function(e) {
  for (var t = 0, o = ColReorder.aoInstances.length; o > t; t++) ColReorder.aoInstances[t].s.dt.oInstance == e && ColReorder.aoInstances[t].fnReset()
 }, ColReorder.prototype.CLASS = "ColReorder", ColReorder.VERSION = "1.0.7", ColReorder.prototype.VERSION = ColReorder.VERSION, "function" == typeof e.fn.dataTable && "function" == typeof e.fn.dataTableExt.fnVersionCheck && e.fn.dataTableExt.fnVersionCheck("1.9.3") ? e.fn.dataTableExt.aoFeatures.push({
  fnInit: function(e) {
   var t = e.oInstance;
   if ("undefined" == typeof t._oPluginColReorder) {
    var o = "undefined" != typeof e.oInit.oColReorder ? e.oInit.oColReorder : {};
    t._oPluginColReorder = new ColReorder(e, o)
   } else t.oApi._fnLog(e, 1, "ColReorder attempted to initialise twice. Ignoring second");
   return null
  },
  cFeature: "R",
  sFeature: "ColReorder"
 }) : alert("Warning: ColReorder requires DataTables 1.9.3 or greater - www.datatables.net/download")
}(jQuery, window, document);