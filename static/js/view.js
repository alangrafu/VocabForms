$(function(){
    for(i in values){
      visible = i.replace(":", '\\:');
      offset = values[i].offset;
      x = visible.split(separator);
      if(parseInt(x[0])>1){
        button = "#add_"+x[1];
        prev = "#field_"+(x[0]-1)+separator+x[1];
        clss = $(prev).attr("class");
        $(button).before('<br/><input size="100" type="text" id="field_'+i+'" class="'+clss+'" value="" />');
$("input:not(.rdfs\\:Literal)").each(function(i, item){
        autocomplete(item);
    });        console.log("#field_"+i);
        $("#data").append('<input size="100" type="hidden" id="'+i+'" value=""/>');
      }      
      if(visible == "rdf\\:type"){
        $("#1"+separator+"a").html(values[i].value);
      }else if(visible == "1"+separator+"rdfs\\:label"){
        $("#1"+separator+"rdfs\\:label").html("\""+values[i].value+"\"");
        $("#field_1"+separator+"rdfs\\:label").html(values[i].value);
      }else if(visible == "1"+separator+"rdfs\\:comment"){
        $("#1"+separator+"rdfs\\:comment").html("\""+values[i].value+"\"");
        $("#field_1"+separator+"rdfs\\:comment").html(values[i].value);
      }else{        
        if(values[i].is_object){
          myLabel = values[i].value;
          if(values[i].label.length > 0){
            myLabel = values[i].label;
          }
          $("#field_"+visible).html("<a href='"+values[i].value+"'>"+myLabel+"</a>");
        }else{
          $("#field_"+visible).html(values[i].value);
        }
      }
    };
});
