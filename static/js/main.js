// Populate the Metadata dropdown select box
function loadMetadataSelect() {
    var url= "/names";
    d3.json(url).then(function(namesData) {
        var namesData= namesData;
        Object.values(namesData).forEach(sample => {
            var menuSample= document.createElement("option");
            var textSample= document.createTextNode(sample);
            menuSample.value= sample;
            menuSample.appendChild(textSample);
            document.getElementById("sample-select-box").appendChild(menuSample);
        });
    });
};

// Define function for retrieving Metadata for selected Sample
function loadMetadataTable(sample) {
    var url= `/metadata/${sample}`
    var metadataTable= d3.select("#sample-metadata-body");
    metadataTable.selectAll("tr").remove()
    d3.json(url).then(function(sampleMetadata) {
        var sampleMetadata= sampleMetadata;
        Object.entries(sampleMetadata).forEach(([key,value]) => {
            var tRow= metadataTable.append("tr");
            tRow.append("td").text(`${key}: ${value}`)
        });
    });
};


// Define function for creating a Pie Chart for  the requested sample
function createPieChart(sample) {
    var url= `/samples/${sample}`;
    d3.json(url).then(function(sampleDataEnter) {
        var sampleData= {};
        Object.entries(sampleDataEnter).forEach(([key,value]) => {
            var topTen= value.slice(0,10);
            sampleData[key]= topTen;
        });
        var trace= {
            labels: sampleData.otu_ids,
            values: sampleData.sample_values,
            type: "pie",
            hoverinfo: "text",
            hovertext: sampleData.otu_labels
        };
        var sampleTrace= [trace];
        Plotly.newPlot("pie", sampleTrace);
    });
};


// Define function for creating Bubble Chart for the requested sample
function createBubbleChart(sample) {
    var url= `/samples/${sample}`;
    d3.json(url).then(function(sampleDataEnter) {
        var sampleData= sampleDataEnter;
        var adjustedSizes= sampleData.otu_ids.map(n => n/100);
        var trace= {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            mode: "markers",
            marker: {
                size: adjustedSizes,
                color: sampleData.otu_ids
            },
            hovertext: sampleData.otu_labels 
        };
        var sampleTrace= [trace];
        Plotly.newPlot("bubble", sampleTrace);
    });
};


function createCharts(sample) {
    var url= `/samples/${sample}`;
    d3.json(url).then(function(sampleData) {
        var sampleData= sampleData;

        // Do that Pie Chart thang
        var sampleTopTenData= {};
        Object.entries(sampleData).forEach(([key,value]) => {
            var topTen= value.slice(0,10);
            sampleTopTenData[key]= topTen;
        });
        var pieTrace= {
            labels: sampleTopTenData.otu_ids,
            values: sampleTopTenData.sample_values,
            type: "pie",
            hoverinfo: "text",
            hovertext: sampleTopTenData.otu_labels
        };
        var samplePieTrace= [pieTrace];
        Plotly.newPlot("pie", samplePieTrace);

        // Now work the Bubblz
        var adjustedSizes= sampleData.sample_values.map(n => n/2)
        var bubbleTrace= {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            mode: "markers",
            colorscale: "Jet",
            marker: {
                size: adjustedSizes,
                color: sampleData.otu_ids
            }
            // text: [sampleData.otu_ids,sampleData.sample_values,sampleData.otu_labels],
        };
        var sampleBubbleTrace= [bubbleTrace];
        Plotly.newPlot("bubble", sampleBubbleTrace);
    });
};


// Set variables for use in below functions
var sampleSelection= d3.select("#sample-select-box");
var sampleValue= ""

// Create event-listener for changing the page based on 
sampleSelection.on("change", function() {
    var value= document.getElementById("sample-select-box").value;
    loadMetadataTable(value);
    // createPieChart(value);
    // createBubbleChart(value);
    createCharts(value)
    console.log(value);
    sampleValue= value;
});


// Load the select element
loadMetadataSelect();




var strArr= [];

d3.json(url).then(function(sampleData) {
    var sampleData= sampleData;
    for (i=0; i < sampleData['otu_ids'].length; i++) {
        var strEntry= ""
        Object.keys(sampleData).forEach(key => {
			var j = 0;
			if (j < 2) {
                strEntry.concat(String(data[key][i])).concat("<br>");
                j++
            } else if (j == 2) {
                strEntry.concat(String(data[key][i]));
                j++
            };
        strArr.push(strEntry);
        });
    };
});