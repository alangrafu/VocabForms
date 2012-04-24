$(function(){
    for(i in values){
      visible = i.replace(":", '\\:');
      offset = values[i].offset;
      x = visible.split(separator);
      if(parseInt(x[0])>1){
        button = "#add_"+x[1];
        prev = "#field_"+(x[0]-1)+separator+x[1];
        clss = $(prev).attr("class");
        $(button).before('<br/><span id="field_'+i+'" class="'+clss+'"></span>');
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
    for(i in revvalues){
      visible = i.replace(":", '\\:');
      offset = revvalues[i].offset;
      x = visible.split(separator);
      if(parseInt(x[0])>1){
        button = "#revadd_"+x[1];
        prev = "#rev_"+(x[0]-1)+separator+x[1];
        clss = $(prev).attr("class");
        $(button).before('<br/><span id="rev_'+i+'" class="'+clss+'"></span>');
      }      
      myLabel = revvalues[i].value;
      if(revvalues[i].label.length > 0){
        myLabel = revvalues[i].label;
      }
      $("#rev_"+visible).html("<a href='"+revvalues[i].value+"'>"+myLabel+"</a>");      
    };
});
