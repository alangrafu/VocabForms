$(function(){
    for(i in values){
      visible = i.replace(":", '\\:');
      offset = values[i].offset;
      x = visible.split(separator);
      if(parseInt(x[0])>1){
        button = "#add_"+x[1];
        prev = "#field_"+(x[0]-1)+separator+x[1];
        clss = $(prev).attr("class");
        $(button).before('<br/><input disabled="true" size="100" type="text" id="field_'+i+'" class="'+clss+'" value="" />');
$("input:not(.rdfs\\:Literal)").each(function(i, item){
        autocomplete(item);
    });        console.log("#field_"+i);
      }      
      if(visible == "rdf\\:type"){
        $("#1"+separator+"a").val(values[i].value);
      }else if(visible == "1"+separator+"rdfs\\:label"){
        $("#1"+separator+"rdfs\\:label").val("\""+values[i].value+"\"");
        $("#field_1"+separator+"rdfs\\:label").val(values[i].value);
      }else if(visible == "1"+separator+"rdfs\\:comment"){
        $("#1"+separator+"rdfs\\:comment").val("\""+values[i].value+"\"");
        $("#field_1"+separator+"rdfs\\:comment").val(values[i].value);
      }else{        
        if(values[i].is_object){
          if(values[i].label.length > 0){
          $("#field_"+visible).val(values[i].label);
          }else{
          $("#field_"+visible).val(values[i].value);         
          }
          $("#"+visible).val("<"+values[i].value+">");
        }else{
          $("#field_"+visible).val(values[i].value);
          $("#"+visible).val("\""+values[i].value+"\"");
        }
      }
    };
});
