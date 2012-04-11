$(document).ready(function(){
    for(i in values){
      visible = i.replace(":", '\\:');
      //Get type
      if(visible == "rdf\\:type"){
        $("#a").val(values[i].value);
      }
      if(values[i].label != ""){
        $("#field_"+visible).val(values[i].label);
      }else{
        $("#field_"+visible).val(values[i].value);
      }
      $("#"+visible).val(values[i].value);
      if(visible == "rdfs\\:label"){
        $("#rdfs\\:label").val("\""+values[i].value+"\"");
      }
      if(visible == "rdfs\\:comment"){
        $("#rdfs\\:comment").val("\""+values[i].value+"\"");
      }
      
    };
});
