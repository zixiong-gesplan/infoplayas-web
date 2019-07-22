function createWebMap(WebMap, itemID){
  // Create a map from the referenced webmap item id
  var webmap = new WebMap({
    portalItem: {
      id: itemID
    }
  });
  return webmap;
};

function createMapView(MapView, container, webMap, zoom){
  var view = new MapView({
    container: container,
    map: webMap,
    zoom: zoom
  });
  view.constraints = {
    minZoom: zoom
  };
  return view;
};

function createScaleBar(ScaleBar, view){
  var scaleBar = new ScaleBar({
    view: view,
    unit: "metric",
    style: "line"
  });
  return scaleBar;
};

function createBaseMapToggle(BasemapToggle, view, basemap){
  var basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: basemap
  });
  return basemapToggle;
};

function createLegend(Legend, view, container){
  var legend = new Legend({
    view: view,
    container: container
  });
  return legend;
};

function createExpand(Expand, view, content, icon, tooltip){
  var expand = new Expand({
    view: view,
    content: content,
    expandIconClass: icon,
    expandTooltip: tooltip,
  });
  return expand;
};

function createViewpoint(Viewpoint, extent){
  var vp = new Viewpoint({
    targetGeometry: extent
  });
  return vp;
};

function createHomeButton(Home, view){
  var home = new Home({
    view: view
  });
  return home;
};

function createForm(FeatureForm, container, featureLayer, formDefinition){
  var form = new FeatureForm({
    container: container,
    layer: featureLayer,
    fieldConfig: formDefinition
  });
  return form;
};
