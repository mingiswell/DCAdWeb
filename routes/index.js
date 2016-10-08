var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get parameter page.
router.get('/parameter', function (req, res, next) {
  res.render('parameter');
});

// Test page.
router.get('/test', function (req, res, next) {
  res.render('test');
});

app.post('/process_post', function(req, res){
  console.log("start body parse");
  // response = {
  //   CensusDate: req.body.txtCensusDate,
  //   ProjectType: req.body.dllProjectType
  // };
  console.log("end");
});

router.post('/process_post', function (req, res) {
  response = {
        CensusDate: req.body.txtCensusDate,
        ProjectType: req.body.dllProjectType,
        ImportDBResults: req.body.dllImportDBResults,
        Notes: req.body.txtNotes,
        PopulationToBeRun: req.body.dllPopulationtobeRun,
        SubSetOfParticipantsNoOfParticipants: req.body.txtNoofParticipants,
        SubSetOfParticipantsStratWithRow: req.body.txtStartwithRow,
        TestCasesEEID1: req.body.txttableTestCases1,
        TestCasesEEID2: req.body.txttableTestCases2,
        TestCasesEEID3: req.body.txttableTestCases3,
        TestCasesEEID4: req.body.txttableTestCases4,
        TestCasesEEID5: req.body.txttableTestCases5,
        TestCasesEEID6: req.body.txttableTestCases6,
        TestCasesEEID7: req.body.txttableTestCases7,
        TestCasesEEID8: req.body.txttableTestCases8,
        TestCasesEEID9: req.body.txttableTestCases9,
        TestCasesEEID10: req.body.txttableTestCases10,
        TestCasesEEID11: req.body.txttableTestCases11,
        TrialToBeRun: req.body.dllTrialtobeRun,
        TestTrialNumber: req.body.txtTesttrialnumber,
        StartAge: req.body.txtStartAge,
        EndAge: req.body.txtEndAge,
        PayIncreaseType: req.body.dllPayIncreaseType,
        PayGroup1: {
          FixedInCrease: req.body.txtPayGroup1FixedIncrease,
          AgeRelatedTable: req.body.dllPayGroup1Agerelatedtable,
          ServiceRelatedTable: req.body.dllPayGroup1Servicerelatedtable,
          BonusAsTarget: req.body.txtPayGroup1BonusasaPecentofTarget
        },
        PayGroup2: {
          FixedInCrease: req.body.txtPayGroup2FixedIncrease,
          AgeRelatedTable: req.body.dllPayGroup2Agerelatedtable,
          ServiceRelatedTable: req.body.dllPayGroup2Servicerelatedtable,
          BonusAsTarget: req.body.txtPayGroup2BonusasaPecentofTarget
        },
        PayGroup3: {
          FixedInCrease: req.body.txtPayGroup3FixedIncrease,
          AgeRelatedTable: req.body.dllPayGroup3Agerelatedtable,
          ServiceRelatedTable: req.body.dllPayGroup3Servicerelatedtable,
          BonusAsTarget: req.body.txtPayGroup3BonusasaPecentofTarget
        },
        AdjustedForInflation: req.body.dllAdjustedforInflation,
        BaselineInflationForadj: req.body.txtBaselineinflationforadj,
        MinimumIncrease: req.body.txtMinimumIncrease,
        AssumedTaxRatePreRetirement: req.body.txtPreRetirement,
        AssumedTaxRatePostRetirement: req.body.txtPostRetirement,
        ProrateTargetforShortSvc: req.body.dllProrateTargetforShortSvc,
        NoofYearsforFullTarget: req.body.txtNoofYearsforFullTarget,
        Startingageforprorateperiod: req.body.txtStartingageforprorateperiod,
        CustomPercentiletoincludeinoutput: req.body.txtCustomPercentiletoincludeinoutput,
        StopAgeforpostretirementbenefits: req.body.txtStopAgeforpostretirementbenefits,
        InterestratetocalculatePV: req.body.txtInterestratetocalculatePV,
        ProfitSharingpercentage: req.body.txtProfitSharingpercentage,
        IncludeBonusinProfitSharingpay: req.body.dllIncludeBonusinProfitSharingpay,
        MinimumserviceforPSeligibility: req.body.txtMinimumserviceforPSeligibility,
        Portionofyearinterestforannualcontribution: req.body.txtPortionofyearinterestforannualcontribution,
        IncludeBonusin401pay: req.body.dllIncludeBonusin401pay,
        Minimumdeferralrate: req.body.txtMinimumdeferralrate,
        Maximumdeferralrate: req.body.txtMaximumdeferralrate,
        AllowCatchupcontributions: req.body.dllAllowCatchupcontributions,
        Autoescalation: req.body.dllAutoescalation,
        AnnualIncrease: req.body.txtAnnualIncrease,
        MaximumAutoescalation: req.body.btxtMaximumAutoescalation,
        Ratetableforfirstx: req.body.dllRatetableforfirstx,
        Percentageofpay: req.body.txtPercentageofpay,
        Ratetablefornexty: req.body.dllRatetablefornexty,
        PercentageofAdditionalPay: req.body.txtPercentageofadditionalpay,
        IncludeAftertaxcontributions: req.body.dllIncludeAftertaxcontributions,
        Maxoverallmatchasapercentageofpay: req.body.txtMaxoverallmatchasapercentageofpay,
        Maximumdollarmatch: req.body.txtMaximumdollarmatch,
        Adjustmaximumdollarmatchforinflation: req.body.dllAdjustmaximumdollarmatchforinflation,
        Adjustformedicalexpenses: req.body.dllAdjustformedicalexpenses,
        Preretirementmedicalexpenses: req.body.txtPreretirementmedicalexpenses,
        PostretirementmedicalexpensesPre65: req.body.txtPostretirementmedicalexpensesPre65,
        PostretirementmedicalexpensesPost65: req.body.txtPostretirementmedicalexpensesPost65,
        SocialSecurityCOLAAssumption: req.body.txtSocialSecurityCOLAAssumption,
        WageBaseIncreaseAssumption: req.body.txtWageBaseIncreaseAssumption,
        SocialSecurityPIACommencementAge: req.body.txtSocialSecurityPIACommencementAge,
        HistoricalPayScale: req.body.txtHistoricalPayScale,
        AGGRESSIVEFUNDTPQASingleclassormix: req.body.dllAGGRESSIVEFUNDTPQASingleclassormix,
        AGGRESSIVEGROWTHEQTCAGSingleclassormix: req.body.dllAGGRESSIVEGROWTHEQTCAGSingleclassormix,
        BONDINDEXTPQBSingleclassormix: req.body.dllBONDINDEXTPQBSingleclassormix,
        BROKERAGELINKBLNKSingleclassormix: req.body.dllBROKERAGELINKBLNKSingleclassormix,
        CAPITALPRESERVATIONGCTISingleclassormix: req.body.dllCAPITALPRESERVATIONGCTISingleclassormix,
        CONSERVATIVEFUNDTPQCSingleclassormix: req.body.dllCONSERVATIVEFUNDTPQCSingleclassormix,
        DFAEMRGMKTCOREEQOEFQSingleclassormix: req.body.dllDFAEMRGMKTCOREEQOEFQSingleclassormix,
        DIVERSIFIEDBONDTPQDSingleclassormix: req.body.dllDIVERSIFIEDBONDTPQDSingleclassormix,
        GROWTHFUNDTPQESingleclassormix: req.body.dllGROWTHFUNDTPQESingleclassormix,
        INTERNATIONALINDEXTPQGSingleclassormix: req.body.dllINTERNATIONALINDEXTPQGSingleclassormix,
        AGGRESSIVEFUNDTPQASingleclass: req.body.dllAGGRESSIVEFUNDTPQASingleclass,
        AGGRESSIVEGROWTHEQTCAGSingleclass: req.body.dllAGGRESSIVEGROWTHEQTCAGSingleclass,
        BONDINDEXTPQBSingleclass: req.body.dllBONDINDEXTPQBSingleclass,
        BROKERAGELINKBLNKSingleclass: req.body.dllBROKERAGELINKBLNKSingleclass,
        CAPITALPRESERVATIONGCTISingleclass: req.body.dllCAPITALPRESERVATIONGCTISingleclass,
        CONSERVATIVEFUNDTPQCSingleclass: req.body.dllCONSERVATIVEFUNDTPQCSingleclass,
        DFAEMRGMKTCOREEQOEFQSingleclass: req.body.dllDFAEMRGMKTCOREEQOEFQSingleclass,
        DIVERSIFIEDBONDTPQDSingleclass: req.body.dllDIVERSIFIEDBONDTPQDSingleclass,
        GROWTHFUNDTPQESingleclass: req.body.dllGROWTHFUNDTPQESingleclass,
        INTERNATIONALINDEXTPQGSingleclass: req.body.dllINTERNATIONALINDEXTPQGSingleclass,
        AGGRESSIVEFUNDTPQA: req.body.txtAGGRESSIVEFUNDTPQASingleclassormix,
        AGGRESSIVEGROWTHEQTCAG: req.body.txtAGGRESSIVEGROWTHEQTCAGSingleclassormix,
        BONDINDEXTPQB: req.body.txtBONDINDEXTPQBSingleclassormix,
        BROKERAGELINKBLNK: req.body.txtBROKERAGELINKBLNKSingleclassormix,
        CAPITALPRESERVATIONGCTI: req.body.txtCAPITALPRESERVATIONGCTISingleclassormix,
        CONSERVATIVEFUNDTPQC: req.body.txtCONSERVATIVEFUNDTPQCSingleclassormix,
        DFAEMRGMKTCOREEQOEFQ: req.body.txtDFAEMRGMKTCOREEQOEFQSingleclassormix,
        DIVERSIFIEDBONDTPQD: req.body.txtDIVERSIFIEDBONDTPQDSingleclassormix,
        GROWTHFUNDTPQE: req.body.txtGROWTHFUNDTPQESingleclassormix,
        INTERNATIONALINDEXTPQG: req.body.txtINTERNATIONALINDEXTPQGSingleclassormix,
        Rebalanceattheendofeachyear: req.body.dllRebalanceattheendofeachyear,
        MixedFundClassallocations: req.body.dllMixedFundClassallocations,
        UseCurrentMixforfuturecontributions: req.body.dllUseCurrentMixforfuturecontributions,
        AGGRESSIVEFUNDTPQAFundAllocations: req.body.txtAGGRESSIVEFUNDTPQA,
        BONDINDEXTPQBFundAllocations: req.body.txtBONDINDEXTPQB,
        BROKERAGELINKBLNKFundAllocations: req.body.txtBROKERAGELINKBLNK,
        CAPITALPRESERVATIONGCTIFundAllocations: req.body.txtCAPITALPRESERVATIONGCTI,
        CONSERVATIVEFUNDTPQCFundAllocations: req.body.txtCONSERVATIVEFUNDTPQC,
        DFAEMRGMKTCOREEQOEFQFundAllocations: req.body.txtDFAEMRGMKTCOREEQOEFQ,
        DIVERSIFIEDBONDTPQDFundAllocations: req.body.txtDIVERSIFIEDBONDTPQD,
        GROWTHFUNDTPQEFundAllocations: req.body.txtGROWTHFUNDTPQE,
        INTERNATIONALINDEXTPQGFundAllocations: req.body.txtINTERNATIONALINDEXTPQG,
        AGGRESSIVEGROWTHEQTCAGFundAllocations: req.body.txtAGGRESSIVEGROWTHEQTCAG
  };
  // var obj = {};
  // obj = response;
  // console.log(JSON.stringify(obj));

  //todo : hardcoded the saved JSON file
  //create the subfolder then create the JSON file
  var path = require('path');
  des_folder = path.resolve('download/clientA/job_version_201609260557')
  // fs.mkdirSync(des_folder, 0755);
  var des_file = des_folder + "/parameter.json";
  console.log(des_file);
  fs.writeFile(des_file, JSON.stringify(response, null, ' '), function (err) {
    if (err) {
      console.log(err);
    }
    res.end(JSON.stringify(response));
  });
});
module.exports = router;