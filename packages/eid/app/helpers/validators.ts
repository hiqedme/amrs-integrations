import _ from "lodash";

export default class Validators {
 checkStatusOfViralLoad(viralLoadPayload:string) {
    var status = 0;
    var hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
    var hasLessThanSymbol = /</g;
    if (_.isEmpty(viralLoadPayload)) return -1;
    var viralLoadResult = this.removeWhiteSpace(viralLoadPayload);

    if (_.isEmpty(viralLoadResult)) {
      return -1;
    }

    if (hasNumbersOnly.test(viralLoadResult)) {
      status = 1;
    } else if (
      hasLessThanSymbol.test(viralLoadResult) ||
      viralLoadPayload.trim() === 'Target Not Detected'
    ) {
      status = 0;
    } else {
      status = 2;
    }
    return status;
  }
   removeWhiteSpace(param:string) {
    var whitePaceVar;
    if (param === '' || param === null) {
      whitePaceVar = '';
    } else {
      whitePaceVar = param.replace(/\s+/g, '');
    }
    return whitePaceVar;
  }
}