// Query a specific feature from the server, highlight the clicked feature and display its attributes in the featureform.
function selectFeature(view, objectId, featureLayer, form) {
  return featureLayer.queryFeatures({
    objectIds: [objectId],
    outFields: ["*"],
    returnGeometry: true
  })
  .then(function(results) {
    var outPutData = {};
    if (results.features.length > 0) {
      editFeature = results.features[0];
      // display the attributes of selected feature in the form
      form.feature = editFeature;
      // highlight the feature on the view
      view.whenLayerView(editFeature.layer).then(function(layerView) {
        if (highlight){
          highlight.remove();
          highlight = null;
        };
        highlight = layerView.highlight(editFeature);
        resize(1);
        outPutData.beachId = editFeature.attributes.objectid;
        outPutData.id_dgse = editFeature.attributes.id_dgse;
        outPutData.localName = editFeature.attributes.nombre_municipio ? editFeature.attributes.nombre_municipio : 'Nombre por definir';
        outPutData.clasificacion = editFeature.attributes.clasificacion;
        // extensiones del feature para componentes externos
        outPutData.coordX = editFeature.geometry.centroid.x;
        outPutData.coordY = editFeature.geometry.centroid.y;
        outPutData.wkid = editFeature.geometry.centroid.spatialReference.wkid;
      });
    }
    return outPutData;
  });
};

//Query all features from layer view
function queryAllFeatures(featureLayer) {
  featureLayer.queryFeatures()
  .then(function(results) {
    return results.features;
  })
};

function submitForm(featureLayer, form, fields, filter) {
  if (editFeature) {
    // Grab updated attributes from the form.
    const updated = form.getValues();
    // Loop through updated attributes and assign
    // the updated values to feature attributes.
    Object.keys(updated).forEach(function(name) {
      editFeature.attributes[name] = updated[name];
    });

    // Setup the applyEdits parameter with updates.
    const edits = {
      updateFeatures: [editFeature]
    };
      return applyAttributeUpdates(edits, featureLayer, view, fields, filter);
  }
};

function applyAttributeUpdates(params, featureLayer, view, fields, filter) {
  $('#btnSave')[0].style.cursor = "progress";
  // if(checkNull(params.updateFeatures[0].attributes.nombre_municipio) === false) {
  //   params.updateFeatures[0].attributes.nombre_municipio = params.updateFeatures[0].attributes.nombre_municipio.toUpperCase();
  // };
  return featureLayer.applyEdits(params).then(function(editsResult) {
    $('#btnSave')[0].style.cursor = "pointer";
    loadList(view, featureLayer, fields, filter);
    return true;
  }).catch(function(error) {
    console.log("===============================================");
    console.error("[ applyEdits ] FAILURE: ", error.code, error.name, error.message);
    console.log("error = ", error);
    $('#btnSave')[0].style.cursor = "pointer";
    return false;
  });
};

function unselectFeature(view){
  if (highlight){
    resize(0);
    highlight.remove();
  }
  return unselectedMessage;
};

function checkNull(text){
  if (!text || text === "NULL" ||  text === "NONE" || text === "") {
    return true;
  }
  else {
    return false;
  };
};

function resize(status){
  if (status === 0){
    $('#viewDiv').animate({
      'width': '100%',
    },
    { duration: 500 })
    $('#formContainer')[0].style.width = "0px";
    $('#formContainer')[0].classList.add("esri-hidden");
    $('#txtSelecciona')[0].innerHTML = "Seleccione Playa/ZBM";
  }
  else if (status === 1 && $('#viewDiv')[0].style.width != "70%"){
    $('#viewDiv').animate({
      'width': '70%',
    },
    {
      duration: 500,
      complete: function () {
        $('#formContainer')[0].style.width = "30%";
        $('#formContainer')[0].classList.remove("esri-hidden");
        $('#txtSelecciona')[0].innerHTML = "Editando Playa/ZBM";
      }
    })
  };
};

//Load a feature list
function loadList(view, featureLayer, fields, filter) {
  return featureLayer.queryFeatures({
    outFields: fields,
    where: filter,
    geometry: view.initialExtent,
    returnGeometry: true
  })
  .then(function(results) {
    const fragment = document.createDocumentFragment();
      results.features.sort(compare);
      results.features.forEach(function(result, index) {
      const attributes = result.attributes;
      var name = attributes.nombre_municipio;

      const li = document.createElement("li");
      if (checkNull(name)){
        name = "NOMBRE POR DEFINIR";
        li.classList.add("panel-result-noname");
      }
      else {
        li.classList.add("panel-result");
      };
      li.style.fontSize = "0.75em";

      li.tabIndex = 0;
      li.setAttribute("data-result-id", index);
      li.setAttribute("oid", attributes.objectid);
      li.textContent = name;

      fragment.appendChild(li);
    });
    // Empty the current list - se usan distintos divs para la lista en distintos componentes para evitar problemas con el dojo
      switch (view.container.id) {
          case 'viewDivViewer':
              listNodeViewer.innerHTML = "";
              listNodeViewer.appendChild(fragment);
              break;
          case 'viewDivDrowningsViewer':
              listNodeDrowningsViewer.innerHTML = "";
              listNodeDrowningsViewer.appendChild(fragment);
              break;
          default:
              listNode.innerHTML = "";
              listNode.appendChild(fragment);
              break;
      }
    return results.features;
  })
  .catch(function(error) {
    console.error("query failed: ", error);
  });
};
// Ordenamos el listado de playas obviando las coletillas tipicas
function compare(a, b) {
    const beachA = replaceFor(a.attributes.nombre_municipio);
    const beachB = replaceFor(b.attributes.nombre_municipio);

    let comparison = 0;
    if (beachA > beachB) {
        comparison = 1;
    } else if (beachA < beachB) {
        comparison = -1;
    }
    return comparison;
};

function replaceFor(a) {
    return a.toUpperCase()
        .replace("PLAYA DEL ", "")
        .replace("PLAYAS DE ", "")
        .replace("PLAYA DE ", "")
        .replace("PLAYA EL ", "")
        .replace("PLAYA LA ", "")
        .replace("PLAYA ", "")
        .replace("PISCINA ", "")
        .replace("ZONA DE BAÑO DE ", "")
        .replace("ZONA DE BAÑO ", "")
        .replace("LAS ", "")
        .replace("LOS ", "")
        .replace("LA ", "")
        .replace("EL ", "");
}
