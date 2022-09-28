//test script
const fs = require("fs");

const jsonFile3 = fs.readFileSync("./files/534cd57-825-24f1-d7-65d845fae1d.json", "utf8");


const data3 = JSON.parse(jsonFile3);

function test2(o) {
  let ret = [];
  for (let divisionIndex in o) {
    for (let variableFactor in o[divisionIndex]) {
      if (variableFactor === "variableFactor") {
				for (weight in o[divisionIndex][variableFactor]) {
					if (weight === "weight") {
						for (let weightIndex in o[divisionIndex][variableFactor][weight]) {
							for (belt in o[divisionIndex][variableFactor]) {
								if (belt === "belt"){
									for (let beltIndex in o[divisionIndex][variableFactor][belt]) {
										ret.push({
											uniform: o[divisionIndex].constantFactor.uniform,
											gender: o[divisionIndex].constantFactor.gender,
											name: o[divisionIndex].constantFactor.name,
											birth: o[divisionIndex].constantFactor.birth,
											pricingPolicy: o[divisionIndex].pricingPolicy,
											weight: o[divisionIndex][variableFactor][weight][weightIndex],
											belt: o[divisionIndex][variableFactor][belt][beltIndex],
										});
									}
								}
							}
						}
					}
				}
      }
    }
  }
  return ret;
}

const ret = test2(data3.division);

console.log(ret);
console.log(ret.length);