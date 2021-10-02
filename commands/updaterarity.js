var rarityFile = "./commands/rarity.json";
// var traitsFilePath = "./commands/traits.xml";


var fs = require('fs'),
    xml2js = require('xml2js');

 
module.exports = {
	name: "updaterarity",
	execute(message) {
        var parser = new xml2js.Parser();
        fs.readFile(traitsFilePath, function(err, data) {
            parser.parseString(data, function (err, result) {
        
                let numberOfRows = result.Workbook.Worksheet[2].Table[0].Row.length
        
                var complete = [];
        
                for(let idx=0; idx < numberOfRows; idx++ ){
                    var scoreCell = result.Workbook.Worksheet[2].Table[0].Row[idx].Cell[11];
                    var nameCell = result.Workbook.Worksheet[2].Table[0].Row[idx].Cell[10];
        
                    if(scoreCell.Data){
                        var name = nameCell.Data[0]["_"];
                        var score = scoreCell.Data[0]["_"];
                        var myObj = {"name": name, "rarity" : score, "score" : idx};
                        complete.push(myObj)
                    }
                }
                // console.log(complete);
        
                fs.writeFile(rarityFile, JSON.stringify(complete, null, 4), 'utf8',  function(err, result) {
                    if(err) console.log('error', err);
                    console.log("Updating rarity details done")
                    message.channel.send("Updating rarity details done")
                });
            });
        
        });
    }
};
