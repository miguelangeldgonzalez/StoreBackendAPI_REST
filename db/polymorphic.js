function polymorpihc(findResult, first, second, final){
    if (findResult) {
        if(!Array.isArray(findResult)) findResult = [findResult];
    
        for (const instance of findResult) {
            if (instance.dataValues[first] !== null){
                instance.dataValues[final] = instance.dataValues[first];
            } else if (instance.dataValues[second] !== null){
                instance.dataValues[final] = instance.dataValues[second];
            }
    
            delete instance.dataValues[first];
            delete instance.dataValues[second];
        }
    }
}

function polymorpihcReturn(findResult, first, second, final){
    if(!Array.isArray(findResult)) findResult = [findResult];

    for (const instance of findResult) {
        if (instance.dataValues[first] !== null){
            instance.dataValues[final] = instance.dataValues[first];
        } else if (instance.dataValues[second] !== null){
            instance.dataValues[final] = instance.dataValues[second];
        }

        delete instance.dataValues[first];
        delete instance.dataValues[second];
    }

    return findResult;
}

module.exports = polymorpihc;