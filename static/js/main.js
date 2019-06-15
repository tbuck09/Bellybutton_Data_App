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


// Create charts in a single function
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
            marker: {
                size: adjustedSizes,
                color: sampleData.otu_ids,
                colorscale: "Earth"
            }
            // text: [sampleData.otu_ids,sampleData.sample_values,sampleData.otu_labels],
        };
        var sampleBubbleTrace= [bubbleTrace];
        Plotly.newPlot("bubble", sampleBubbleTrace);
    });
};


// Set variables for use in below functions
var sampleSelection= d3.select("#sample-select-box");
var sampleValue= "940"

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

// Create charts upon Load for default sample (940)
loadMetadataTable(sampleValue);
createCharts(sampleValue);