d3.json("samples.json").then((data)=> {
  // Extract Names for dropdown

  var names = data.names;
  var dropdown = d3.select("#selDataset");
  names.forEach((name) => {
    var opt = dropdown.append("option");
    opt.text(name);
    // Object.entries(data).forEach(([key, value]) => {
    //   var cell = row.append("td");
    //   cell.text(value);
    // });
  });

  d3.selectAll("#selDataset").on("change", updatePlotly);


  function updatePlotly() {
    d3.json("samples.json").then((data)=> {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");

    //Select metadata
    var metadata = data.metadata;
    console.log(metadata[0])
    for (var j = 0; j< metadata.length; j++)
      if (parseInt(dataset) === metadata[j].id) {
        var demo_info = metadata[j]
        console.log(demo_info)
        var demo_loc = d3.select("#sample-metadata")
        var demo_str = JSON.stringify(demo_info, null, 5)
        demo_loc.text(demo_str)
      };

  //  Extract array data from samples
    var sample_id = data.samples;
  
    for (var j = 0; j< sample_id.length; j++)
      if (dataset === sample_id[j].id) {
        var otu_id = sample_id[j].otu_ids;
        var sample_values = sample_id[j].sample_values;
        var otu_labels = sample_id[j].otu_labels;
        // var meta_id = metadata[j];
        // if (dataset === meta_id.id) {
        //   var demo_info = meta_id;
        //   
        //   var select = document.getElementById("#demographic"); 
        //   select.append(demo_info);
        // };
      };
    // Push array data into dictionaries
    var otu_objects = []
    for (var i=0;i<otu_id.length;i++){
        var otu_details = {
            id: otu_id[i],
            value: sample_values[i],
            label: otu_labels[i] 
        };
        otu_objects.push(otu_details);

    };

    // Sort otu data
    var sort_Samplevalues = otu_objects.sort((a, b) => b.value - a.value);
    var top_Samplevalues = otu_objects.slice(0, 10)
    reversedData = top_Samplevalues.reverse();
    
    //plot horizonral bar chart
    // var axis_ids = reversedData.map(object => {return 'OTU ' + object.id}
    var trace_bar = {
        x: reversedData.map(object => object.value),
        y: reversedData.map(object => {return 'OTU ' + object.id}),
        text: reversedData.map(object => object.label),
        name: "OTU IDs",
        type: "bar",
        orientation: "h"
      };
      
      // data
      var data = [trace_bar];
      
      // Apply the group bar mode to the layout
      var layout = {
        title: "OTU ID Values",
      };
      
      // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", data, layout);
    
    //   Create a bubble chart that displays each sample.
    //   Use otu_ids for the x values.      
    //   Use sample_values for the y values.
    //   Use sample_values for the marker size.
    //   Use otu_ids for the marker colors.
    //   Use otu_labels for the text values.
    var trace_bubble = {
        x: otu_objects.map(object => object.id),
        y: otu_objects.map(object => object.value),
        text: otu_objects.map(object => object.label),
        mode: 'markers',
        marker: {
            // colorscale: [[0, 'rgb(0,0,255)'], [1, 'rgb(255,0,0)']]
            size: otu_objects.map(object => object.value)
            }
    };
    var data2 = [trace_bubble];

    var layout2 = {
        xaxis: {title: 'OTU ID'},
        yaxis: {title: 'Sample Value'},
        showlegend: false
      };

    Plotly.newPlot("bubble", data2, layout2);

    d3.json("samples.json").then((data)=> {
    var metadata = data.metadata;
    for (var k = 0; k< metadata.length; k++)
    var meta_id = metadata[k];
        if (dataset === meta_id.id) {
          var demo_info = meta_id;
          console.log(demo_info)
          // var select = document.getElementById("#demographic"); 
          // select.append(demo_info);
        };
      });
    });
  };
});
