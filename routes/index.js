var fs = require('fs');
var path = require('path');

module.exports = function (app) {
    app.get('/', function (req, res) {
        console.log(req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress);

        
        res.render('index', { title: 'Express' });
    });

    app.get('/test', function(req,res){
        res.sendFile(__dirname + "/" + "test.htm");
    });

    /* GET home page. */
    app.get('/', function (req, res, next) {
        res.render('index', { title: 'Express' });
    });
    app.get('/index', function (req, res, next) {
        res.render('index', { title: 'Express' });
    });

    /* GET Clients page. */
    app.get('/Clients', function (req, res, next) {
        var path = require('path');
        var clientPath = path.resolve('download');
        var clientList = GetAllFolders(clientPath);
        res.render('Clients', { 'clientList': clientList });
    });

    /* GET MetaData page. */
    app.get('/MetaData', function (req, res, next) {
        res.render('MetaData');
    });

    /* GET New Client page. */
    app.get('/NewClient', function (req, res, next) {
        res.render('NewClient');
    });

    /* GET New Jobs page. */
    app.get('/Jobs', function (req, res, next) {
        var clients = GetAllFolders(path.resolve('download'));
        var clientJobs = [];
        clients.forEach(function(client) {
            var jobs = GetAllFolders(path.resolve('download', client));
            jobs.forEach(function(job) {
                if(job != "DBResult" && job != "EmployeeData"){
                    clientJobs.push(client + ' - ' + job);
                }
            }, this);
        }, this);
        res.render('Jobs', {'ClientJobs': clientJobs});
    });

    //Add new client and its subfolders (DBResult and EmployeeData) 
    //and return to ClientDetail page
    app.post('/process_addclient', function (req, res) {
        var newClientName = req.body.name;

        // Create Job folder
        var path = require('path');
        desFolder = path.resolve('download/', newClientName);
        fs.mkdirSync(desFolder, 0755);

        // Create DBResult folder under Job Folder
        var path = require('path');
        desFolder = path.resolve('download/' + newClientName + '/DBResult');
        fs.mkdirSync(desFolder, 0755);

        //Create EmployeeData folder under Job Folder
        var path = require('path');
        desFolder = path.resolve('download/' + newClientName + '/EmployeeData');
        fs.mkdirSync(desFolder, 0755);

        res.redirect('Clients');
    });

    /* GET Client Detail page. */
    app.get('/ClientDetail', function (req, res, next) {
        var ClientName = req.query.ClientName;
        var DBResultPath = path.resolve('download/' + ClientName + '/DBResult');
        var DBResultList = GetAllFiles(DBResultPath);
        var EmployeeDataPath = path.resolve('download/' + ClientName + '/EmployeeData');
        var EmployeeDataList = GetAllFiles(EmployeeDataPath);
        res.render('ClientDetail', { 'ClientName': ClientName, 'DBResultList': DBResultList, 'EmployeeDataList': EmployeeDataList });
    });

    //In the ClientDetail
    //delete the selected EmployeeData
    app.post('/process_deleteData', function (req, res) {
        var ClientName = req.query.ClientName;
        var fileType = req.query.fileType;
        var dataPath = path.resolve('download/' + ClientName + '/' + fileType + '/');
        var fileList = GetAllFiles(dataPath); 
        fileList.forEach(function(file) {
            var chbFile = req.body['chb_' + file];
            if(chbFile == "on"){
                desFile = path.resolve(dataPath, file);
                fs.unlink(desFile, function(err){
                    if(err){
                        console.error(err.message);
                    }
                    console.log('delete file successfully!');
                });
            }
        }, this);

        var ClientName = req.query.ClientName;
        var DBResultPath = path.resolve('download/' + ClientName + '/DBResult');
        var DBResultList = GetAllFiles(DBResultPath);
        var EmployeeDataPath = path.resolve('download/' + ClientName + '/EmployeeData');
        var EmployeeDataList = GetAllFiles(EmployeeDataPath);
        res.render('ClientDetail', { 'ClientName': ClientName, 'DBResultList': DBResultList, 'EmployeeDataList': EmployeeDataList });

    });

    //delete the selected DBResult
    app.post('/process_deleteDBResult', function (req, res) {
        console.log('delete db result');
        res.redirect('ClientDetail');
    });

    //delete the selected client
    app.post('/process_deleteclient', function (req, res) {
        var clientPath = path.resolve('download');
        var clientList = GetAllFolders(clientPath);
        var clientToBeDeletedList = [];

        clientList.forEach(function (ClientName) {
            controlId = 'chb_' + ClientName;
            var chbClientName = req.body[controlId];
            if (chbClientName == "on") {
                desFolder = path.resolve('download/', ClientName);
                var stat = fs.statSync(desFolder);
                if (stat.isDirectory()) {
                    //rmdirSync only delete a non empty directory
                    //use wrench instead
                    //https://github.com/ryanmcgrath/wrench-js
                    var wrench = require('wrench'),
                        util = require('util');
                    wrench.rmdirSyncRecursive(desFolder);
                }
            }
        }, this);
        res.redirect('Clients');
    });

    /* GET New DB Result page. */
    app.get('/NewEmployeeData', function (req, res, next) {
        var ClientName = req.query.ClientName;
        res.render('NewEmployeeData', { 'ClientName': ClientName });
    });

    /* GET New DB Result page. */
    app.get('/NewDBResult', function (req, res, next) {
        var ClientName = req.query.ClientName;
        res.render('NewDBResult', { 'ClientName': ClientName });
    });

    /* file upload in NewEmployeeData and NewDBResult*/
    app.post('/fileUpload', function (req, res) {
        var ClientName = req.query.ClientName;
        var fileType = req.query.fileType;
        var des_file;
        if (fileType == "MetaData"){
            des_file = path.resolve('download/' + req.files[0].originalname);
        }
        else{
            des_file = path.resolve('download/' + ClientName + '/' + fileType + '/' + req.files[0].originalname);
        }
        // __dirname + "/" + req.files[0].originalname;
        console.log(des_file);
        fs.readFile(req.files[0].path, function (err, data) {
            fs.writeFile(des_file, data, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    response = {
                        message: 'File uploaded successfully',
                        filename: req.files[0].originalname
                    };
                }
                
                if (fileType == "MetaData") {
                    res.redirect('MetaData');
                }
                else{
                    var ClientName = req.query.ClientName;
                    var DBResultPath = path.resolve('download/' + ClientName + '/DBResult');
                    var DBResultList = GetAllFiles(DBResultPath);
                    var EmployeeDataPath = path.resolve('download/' + ClientName + '/EmployeeData');
                    var EmployeeDataList = GetAllFiles(EmployeeDataPath);
                    res.render('ClientDetail', { 'ClientName': ClientName, 'DBResultList': DBResultList, 'EmployeeDataList': EmployeeDataList });
                }
            });
        });
    });

    // Get parameter page.
    app.get('/parameter', function (req, res, next) {
        var employeeDataPath = path.resolve('download/clientA/EmployeeData');
        var dbResultPath = path.resolve('download/clientA/DBResult');
        var employeeDataList = GetAllFiles(employeeDataPath);
        var dbResultList = GetAllFiles(dbResultPath);
        var ClientName = req.query.ClientName;
        res.render('parameter', {'ClientName': ClientName, 'employeeDataList': employeeDataList, 'dbResultList': dbResultList });
    });

    //process parameter page, clicking 'Run' button
    app.post('/process_parameter', function (req, res) {
        // fetch the info from the web page
        response = {
            CensusDate: req.body.txtCensusDate,
            ProjectType: req.body.dllProjectType,
            EmployeeData: req.body.dllEmployeeData,
            ImportDBResults: Boolean(req.body.dllImportDBResults),
            DBResult: req.body.dllDBResult,
            OutputFile: req.body.txtOutputFile,
            Notes: req.body.txtNotes,
            PopulationToBeRun: req.body.dllPopulationtobeRun,
            NumbOfEEsToRun: parseInt(req.body.txtNoofParticipants),
            StartFromRow: parseInt(req.body.txtStartwithRow),
            EEID1: parseInt(req.body.txttableTestCases1),
            EEID2: parseInt(req.body.txttableTestCases2),
            EEID3: parseInt(req.body.txttableTestCases3),
            EEID4: parseInt(req.body.txttableTestCases4),
            EEID5: parseInt(req.body.txttableTestCases5),
            EEID6: parseInt(req.body.txttableTestCases6),
            EEID7: parseInt(req.body.txttableTestCases7),
            EEID8: parseInt(req.body.txttableTestCases8),
            EEID9: parseInt(req.body.txttableTestCases9),
            EEID10: parseInt(req.body.txttableTestCases10),
            TrialToBeRun: req.body.dllTrialtobeRun,
            TestTrialNumber: parseInt(req.body.txtTesttrialnumber),
            StartAge: parseInt(req.body.txtStartAge),
            EndAge: parseInt(req.body.txtEndAge),
            PayIncreaseType: req.body.dllPayIncreaseType,
            PayRelatedAssumptions: {
                "Fixed Increase": { "Pay Group 1": parseFloat(req.body.txtPayGroup1FixedIncrease), "Pay Group 2": req.body.txtPayGroup2FixedIncrease, "Pay Group 3": req.body.txtPayGroup3FixedIncrease },
                "Age related table": { "Pay Group 1": parseFloat(req.body.dllPayGroup1Agerelatedtable), "Pay Group 2": req.body.dllPayGroup2Agerelatedtable, "Pay Group 3": req.body.dllPayGroup3Agerelatedtable },
                "Service related table": { "Pay Group 1": parseFloat(req.body.dllPayGroup1Servicerelatedtable), "Pay Group 2": req.body.dllPayGroup2Servicerelatedtable, "Pay Group 3": req.body.dllPayGroup3Servicerelatedtable }
            },
            TableBonusPctTarget: { "Pay Group 1": parseFloat(req.body.txtPayGroup1BonusasaPecentofTarget), "Pay Group 2": parseFloat(req.body.txtPayGroup2BonusasaPecentofTarget), "Pay Group 3": parseFloat(req.body.txtPayGroup3BonusasaPecentofTarget) },
            AdjForInflation: Boolean(req.body.dllAdjustedforInflation),
            BaselineInflationForadj: parseFloat(req.body.txtBaselineinflationforadj),
            MinPayInc: parseInt(req.body.txtMinimumIncrease),
            TaxRatePreRet: parseFloat(req.body.txtPreRetirement),
            TaxRatePostRet: parseFloat(req.body.txtPostRetirement),
            ProrateForShortSvc: Boolean(req.body.dllProrateTargetforShortSvc),
            YrsForFullTarget: parseInt(req.body.txtNoofYearsforFullTarget),
            StartingAgeForProratePeriod: parseInt(req.body.txtStartingageforprorateperiod),
            CustomPercentile: parseFloat(req.body.txtCustomPercentiletoincludeinoutput),
            CovStopAge: parseInt(req.body.txtStopAgeforpostretirementbenefits),
            PVIntRate: parseFloat(req.body.txtInterestratetocalculatePV),
            PSPercentage: parseFloat(req.body.txtProfitSharingpercentage),
            PSIncludeBonus: Boolean(req.body.dllIncludeBonusinProfitSharingpay),
            PSMinService: parseInt(req.body.txtMinimumserviceforPSeligibility),
            PSPOYInt: parseFloat(req.body.txtPortionofyearinterestforannualcontribution),
            IncludeBonus401K: Boolean(req.body.dllIncludeBonusin401pay),
            MinPreTaxDefRate: parseFloat(req.body.txtMinimumdeferralrate),
            MaxPreTaxDefRate: parseFloat(req.body.txtMaximumdeferralrate),
            AllowCatchUp: Boolean(req.body.dllAllowCatchupcontributions),
            AutoEscalation: Boolean(req.body.dllAutoescalation),
            AutoEscalationAnnualIncrease: parseFloat(req.body.txtAnnualIncrease),
            AutoEscalationMax: parseFloat(req.body.txtMaximumAutoescalation),
            MatchTableNum1: req.body.dllRatetableforfirstx,
            MatchPayPct1: parseFloat(req.body.txtPercentageofpay),
            MatchTableNum2: req.body.dllRatetablefornexty,
            MatchPayPct2: parseFloat(req.body.txtPercentageofadditionalpay),
            IncludeATContForMatch: Boolean(req.body.dllIncludeAftertaxcontributions),
            MaxMatchPctOfPay: parseFloat(req.body.txtMaxoverallmatchasapercentageofpay),
            MaxMatchDollar: parseInt(req.body.txtMaximumdollarmatch),
            MaxMatchDollarIncludeInflation: Boolean(req.body.dllAdjustmaximumdollarmatchforinflation),
            AdjForPRM: Boolean(req.body.dllAdjustformedicalexpenses),
            RetMedPreRetCost: Boolean(req.body.txtPreretirementmedicalexpenses),
            RetMedPre65GrossCost: parseInt(req.body.txtPostretirementmedicalexpensesPre65),
            RetMedPost65GrossCost: parseInt(req.body.txtPostretirementmedicalexpensesPost65),
            SocSecCOLA: parseFloat(req.body.txtSocialSecurityCOLAAssumption),
            WageBaseInc: parseFloat(req.body.txtWageBaseIncreaseAssumption),
            SSPIAStartAge: parseInt(req.body.txtSocialSecurityPIACommencementAge),
            PIAHistSS: parseFloat(req.body.txtHistoricalPayScale),
            FundAlloc: ["AGGRESSIVE FUNDTPQA",
                "AGGRESSIVE GROWTH EQTCAG",
                "BOND INDEXTPQB",
                "BROKERAGELINKBLNK",
                "CAPITAL PRESERVATIONGCTI",
                "CONSERVATIVE FUNDTPQC",
                "DFA EMRG MKT CORE EQOEFQ",
                "DIVERSIFIED BONDTPQD",
                "GROWTH FUNDTPQE",
                "INTERNATIONAL INDEXTPQG"
            ],
            FundAllocPct: ["AGGRESSIVE FUNDTPQA _PCT",
                "AGGRESSIVE GROWTH EQTCAG _PCT",
                "BOND INDEXTPQB _PCT",
                "BROKERAGELINKBLNK _PCT",
                "CAPITAL PRESERVATIONGCTI _PCT",
                "CONSERVATIVE FUNDTPQC _PCT",
                "DFA EMRG MKT CORE EQOEFQ _PCT",
                "DIVERSIFIED BONDTPQD _PCT",
                "GROWTH FUNDTPQE _PCT",
                "INTERNATIONAL INDEXTPQG _PCT"
            ],
            SingleOrMix: [
                parseInt(req.body.dllAGGRESSIVEFUNDTPQASingleclassormix),
                parseInt(req.body.dllAGGRESSIVEGROWTHEQTCAGSingleclassormix),
                parseInt(req.body.dllBONDINDEXTPQBSingleclassormix),
                parseInt(req.body.dllBROKERAGELINKBLNKSingleclassormix),
                parseInt(req.body.dllCAPITALPRESERVATIONGCTISingleclassormix),
                parseInt(req.body.dllCONSERVATIVEFUNDTPQCSingleclassormix),
                parseInt(req.body.dllDFAEMRGMKTCOREEQOEFQSingleclassormix),
                parseInt(req.body.dllDIVERSIFIEDBONDTPQDSingleclassormix),
                parseInt(req.body.dllGROWTHFUNDTPQESingleclassormix),
                parseInt(req.body.dllINTERNATIONALINDEXTPQGSingleclassormix)
            ],
            RebalanceValues: [
                parseInt(req.body.txtAGGRESSIVEFUNDTPQA),
                parseInt(req.body.txtAGGRESSIVEGROWTHEQTCAG),
                parseInt(req.body.txtBONDINDEXTPQB),
                parseInt(req.body.txtBROKERAGELINKBLNK),
                parseInt(req.body.txtCAPITALPRESERVATIONGCTI),
                parseInt(req.body.txtCONSERVATIVEFUNDTPQC),
                parseInt(req.body.txtDFAEMRGMKTCOREEQOEFQ),
                parseInt(req.body.txtDIVERSIFIEDBONDTPQD),
                parseInt(req.body.txtGROWTHFUNDTPQE),
                parseInt(req.body.txtINTERNATIONALINDEXTPQG)
            ],
            Class: [
                req.body.dllAGGRESSIVEFUNDTPQASingleclass,
                req.body.dllAGGRESSIVEGROWTHEQTCAGSingleclass,
                req.body.dllBONDINDEXTPQBSingleclass,
                req.body.dllBROKERAGELINKBLNKSingleclass,
                req.body.dllCAPITALPRESERVATIONGCTISingleclass,
                req.body.dllCONSERVATIVEFUNDTPQCSingleclass,
                req.body.dllDFAEMRGMKTCOREEQOEFQSingleclass,
                req.body.dllDIVERSIFIEDBONDTPQDSingleclass,
                req.body.dllGROWTHFUNDTPQESingleclass,
                req.body.dllINTERNATIONALINDEXTPQGSingleclass
            ],
            Rebalance: Boolean(req.body.dllRebalanceattheendofeachyear),
            MixedFundType: req.body.dllMixedFundClassallocations,
            UseCurrentMix: Boolean(req.body.dllUseCurrentMixforfuturecontributions),
        };

        // Create Job folder
        var path = require('path');
        var jobName = "job_" + getDateTime();
        var ClientName = req.query.ClientName;
        desFolder = path.resolve('download/' + ClientName + '/' + jobName);
        fs.mkdirSync(desFolder, 0755);
        var desFile = desFolder + "/parameter.json";
        console.log(desFile);

        // write to json file
        fs.writeFile(desFile, JSON.stringify(response, null, ' '), function (err) {
            if (err) {
                console.log(err);
            }
            res.end(JSON.stringify(response));
        });
    });

    // Get UserManagement page.
    app.get('/UserManagement', function(req, res, next){
        // fs.readFileSync(path.resolve('download/', 'UserClient.json'), function (err, data) {
        //     if (err) {
        //         throw err;
        //     }
        //     var userClient = JSON.parse(data);

        //     // for (var i = 0; i < userClient.Users.length; i++) {
        //     //     var one = userClient.Users[i];
        //     //     var id = one['ID'];
        //     //     var name = one['Name'];
        //     //     var password = one['Password'];
        //     //     var clients = one['Clients'];
        //     // }
        // });

        
        var clients = GetAllFolders(path.resolve('download'));
        var clientUser = fs.readFileSync(path.resolve('download/', 'ClientUser.json'));
        // clients.forEach(function(client) {
        //     clientUser.Clients.forEach(function(clientUser) {
        //         if(client == clientUser.ClientName){

        //         }
        //     }, this);
        // }, this);


        res.render('UserManagement', { 'ClientUserList': JSON.parse(clientUser).Clients, 'Clients': clients});
    });
};

function getDateTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    return year + month + day + hour + min + sec;
}

// Get all the folders based on the path
function GetAllFolders(srcPath) {
    var directoryList = [];
    var files = fs.readdirSync(srcPath);
    files.forEach(function (file) {
        var statInfo = fs.statSync(path.join(srcPath, file));
        if (statInfo.isDirectory()) {
            directoryList.push(file);
        }
    }, this);
    return directoryList;
}

//there is an issue for the async readdir method, the return value is never get at once.
//readdirSync method is used here. 
function GetAllFiles(srcPath) {
    var fileList = [];
    var files = fs.readdirSync(srcPath);
    files.forEach(function (file) {
        var statInfo = fs.statSync(path.join(srcPath, file));
        if (statInfo.isFile()) {
            fileList.push(file);
        }
    }, this);
    return fileList;
}