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

// Set variables for use in below functions
var sampleSelection= d3.select("#sample-select-box");
var sampleValue= ""

// Define function for retrieving top 10 OTU's for the requested sample
function createPieChart(sample) {
    var url= `/samples/${sample}`;
    d3.json(url).then(function(sampleData) {
        var sampleData= sampleData;
        var trace= {
            labels: sampleData.otu_ids,
            values: sampleData.sample_values,
            type: "pie",
            hoverinfo: "text",
            hovertext: sampleData.otu_labels
        };
        sampleTrace= [trace]
        Plotly.newPlot("pie", sampleTrace);
    });
};


// Create event-listener for changing the page based on 
sampleSelection.on("change", function() {
    var value= document.getElementById("sample-select-box").value;
    loadMetadataTable(value);
    createPieChart(value)
    console.log(value);
    sampleValue= value;
});




// Load the select element
loadMetadataSelect();